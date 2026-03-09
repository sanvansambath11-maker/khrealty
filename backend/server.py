# trigger reload
from fastapi import FastAPI, APIRouter, HTTPException, Query, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import cloudinary
import cloudinary.uploader

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ── Models ──────────────────────────────────────────────

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: float
    property_type: str  # villa, borey, condo, land
    location: str
    city: str  # Phnom Penh, Siem Reap, Sihanoukville
    bedrooms: int = 0
    bathrooms: int = 0
    area: float = 0  # sqm
    images: List[str] = []
    featured: bool = False
    status: str = "available"  # available, sold, rented
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PropertyCreate(BaseModel):
    title: str
    description: str
    price: float
    property_type: str
    location: str
    city: str
    bedrooms: int = 0
    bathrooms: int = 0
    area: float = 0
    images: List[str] = []
    featured: bool = False
    status: str = "available"

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[float] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None
    status: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    telegram: str = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactCreate(BaseModel):
    name: str
    phone: str
    telegram: str = ""
    message: str

class LoginRequest(BaseModel):
    username: str
    password: str

# ── Admin Login ─────────────────────────────────────────

@api_router.post("/admin/login")
async def admin_login(data: LoginRequest):
    admin_user = os.environ.get("ADMIN_USERNAME", "admin")
    admin_pass = os.environ.get("ADMIN_PASSWORD", "admin123")
    if data.username == admin_user and data.password == admin_pass:
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ── Property Endpoints ──────────────────────────────────

@api_router.get("/properties", response_model=List[Property])
async def list_properties(
    city: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None),
):
    query = {}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if property_type:
        query["property_type"] = {"$regex": property_type, "$options": "i"}
    if min_price is not None:
        query.setdefault("price", {})["$gte"] = min_price
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if bedrooms is not None:
        query["bedrooms"] = {"$gte": bedrooms}
    if featured is not None:
        query["featured"] = featured

    docs = await db.properties.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")
    return doc

@api_router.post("/properties", response_model=Property)
async def create_property(data: PropertyCreate):
    prop = Property(**data.model_dump())
    doc = prop.model_dump()
    await db.properties.insert_one(doc)
    return prop

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, data: PropertyUpdate):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.properties.update_one({"id": property_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    doc = await db.properties.find_one({"id": property_id}, {"_id": 0})
    return doc

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted"}

# ── Upload Endpoint ──────────────────────────────────────

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        result = cloudinary.uploader.upload(content, folder="khrealty")
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ── Contact Endpoints ───────────────────────────────────

@api_router.post("/contacts", response_model=ContactSubmission)
async def submit_contact(data: ContactCreate):
    contact = ContactSubmission(**data.model_dump())
    doc = contact.model_dump()
    await db.contacts.insert_one(doc)
    return contact

@api_router.get("/contacts", response_model=List[ContactSubmission])
async def list_contacts():
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs

# ── Seed Data ───────────────────────────────────────────

@api_router.post("/seed")
async def seed_data():
    existing = await db.properties.count_documents({})
    if existing > 0:
        return {"message": f"Database already has {existing} properties. Skipping seed."}

    sample_properties = [
        {
            "id": str(uuid.uuid4()),
            "title": "Luxury Villa Borey Peng Huoth",
            "description": "Stunning 4-bedroom luxury villa in the prestigious Borey Peng Huoth development. Features modern architecture, spacious living areas, private garden, and swimming pool. Located in a secure gated community with 24/7 security.",
            "price": 250000,
            "property_type": "villa",
            "location": "Borey Peng Huoth, Chbar Ampov",
            "city": "Phnom Penh",
            "bedrooms": 4,
            "bathrooms": 5,
            "area": 320,
            "images": ["https://images.unsplash.com/photo-1757439402359-aed14d39fc1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Modern Condo BKK1",
            "description": "Premium 2-bedroom condominium in the heart of BKK1. Fully furnished with high-end appliances, floor-to-ceiling windows, and stunning city views. Building amenities include rooftop pool, gym, and concierge service.",
            "price": 185000,
            "property_type": "condo",
            "location": "BKK1, Chamkarmon",
            "city": "Phnom Penh",
            "bedrooms": 2,
            "bathrooms": 2,
            "area": 95,
            "images": ["https://images.unsplash.com/photo-1762452059456-e4c16c256dd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb25kbyUyMGJ1aWxkaW5nJTIwYXBhcnRtZW50fGVufDB8fHx8MTc3MzAzNjc1NHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Borey Villa Sen Sok",
            "description": "Beautiful 3-bedroom borey house in Sen Sok district. Modern design with open-plan living, fitted kitchen, and private parking. Close to international schools and shopping centers.",
            "price": 165000,
            "property_type": "borey",
            "location": "Sen Sok District",
            "city": "Phnom Penh",
            "bedrooms": 3,
            "bathrooms": 3,
            "area": 200,
            "images": ["https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Premium Land Sihanoukville",
            "description": "Prime beachfront land in Sihanoukville. Perfect for resort development or investment. Flat terrain with road access and utilities nearby. Clear title deed.",
            "price": 450000,
            "property_type": "land",
            "location": "Otres Beach Area",
            "city": "Sihanoukville",
            "bedrooms": 0,
            "bathrooms": 0,
            "area": 1500,
            "images": ["https://images.unsplash.com/photo-1622015663084-307d19eabbbf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Riverside Luxury Apartment",
            "description": "Elegant 3-bedroom apartment overlooking the Mekong River. Premium finishes throughout, including marble floors, designer kitchen, and spa-like bathrooms. Full-service building with concierge.",
            "price": 320000,
            "property_type": "condo",
            "location": "Sisowath Quay, Daun Penh",
            "city": "Phnom Penh",
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 150,
            "images": ["https://images.unsplash.com/photo-1765785165219-d5dd951fbc98?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25kbyUyMGJ1aWxkaW5nJTIwYXBhcnRtZW50fGVufDB8fHx8MTc3MzAzNjc1NHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Siem Reap Colonial Villa",
            "description": "Charming colonial-style villa near Angkor Wat. 5 bedrooms, lush tropical garden, and private pool. Ideal as a boutique hotel or family residence. Rich heritage with modern comforts.",
            "price": 380000,
            "property_type": "villa",
            "location": "Svay Dangkum, Near Angkor",
            "city": "Siem Reap",
            "bedrooms": 5,
            "bathrooms": 4,
            "area": 450,
            "images": ["https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85"],
            "featured": True,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Borey New World Phnom Penh",
            "description": "Modern 4-bedroom townhouse in Borey New World. Contemporary design with smart home features, double garage, and rooftop terrace. Excellent investment opportunity.",
            "price": 195000,
            "property_type": "borey",
            "location": "Chroy Changvar",
            "city": "Phnom Penh",
            "bedrooms": 4,
            "bathrooms": 3,
            "area": 240,
            "images": ["https://images.unsplash.com/photo-1628744876497-eb30460be9f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tJTIwbW9kZXJufGVufDB8fHx8MTc3MzAzNjc1OHww&ixlib=rb-4.1.0&q=85"],
            "featured": False,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Studio Condo Toul Kork",
            "description": "Cozy studio apartment in trendy Toul Kork area. Perfect for young professionals or as a rental investment. Fully furnished with modern amenities. Walking distance to restaurants and cafes.",
            "price": 75000,
            "property_type": "condo",
            "location": "Toul Kork",
            "city": "Phnom Penh",
            "bedrooms": 1,
            "bathrooms": 1,
            "area": 45,
            "images": ["https://images.unsplash.com/photo-1628745277866-ff9305ac52cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tJTIwbW9kZXJufGVufDB8fHx8MTc3MzAzNjc1OHww&ixlib=rb-4.1.0&q=85"],
            "featured": False,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Development Land Phnom Penh",
            "description": "Large plot of land in rapidly developing area of Phnom Penh. Zoned for mixed-use development. Excellent ROI potential with nearby infrastructure projects underway.",
            "price": 680000,
            "property_type": "land",
            "location": "Meanchey District",
            "city": "Phnom Penh",
            "bedrooms": 0,
            "bathrooms": 0,
            "area": 2000,
            "images": ["https://images.unsplash.com/photo-1628744876525-f2678d8af47f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tJTIwbW9kZXJufGVufDB8fHx8MTc3MzAzNjc1OHww&ixlib=rb-4.1.0&q=85"],
            "featured": False,
            "status": "available",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]

    await db.properties.insert_many(sample_properties)
    return {"message": f"Seeded {len(sample_properties)} properties"}

@api_router.get("/")
async def root():
    return {"message": "KH Realty API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
