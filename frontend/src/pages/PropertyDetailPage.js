import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Phone, Send, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API}/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to fetch property", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-pulse text-slate-400">កំពុងទាញយកអចលនទ្រព្យ...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-slate-400 font-['Poppins']">រកមិនឃើញអចលនទ្រព្យទេ</p>
        <Link to="/properties" className="text-[#C9A227] hover:underline text-sm">
          ត្រឡប់ទៅអចលនទ្រព្យវិញ
        </Link>
      </div>
    );
  }

  const images = property.images?.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=800"];

  return (
    <main data-testid="property-detail-page" className="min-h-screen bg-[#F5F5F5]">
      {/* Back */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-4">
          <Link
            to="/properties"
            data-testid="back-to-properties"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F2A44] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ត្រឡប់ទៅអចលនទ្រព្យវិញ
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-white overflow-hidden" data-testid="property-image-gallery">
              <img
                src={images[currentImage]}
                alt={property.title}
                className="w-full aspect-[16/10] object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    data-testid="prev-image-btn"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#0F2A44]" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    data-testid="next-image-btn"
                  >
                    <ChevronRight className="w-5 h-5 text-[#0F2A44]" />
                  </button>
                </>
              )}
              {/* Type badge */}
              <span className="absolute top-4 left-4 bg-[#0F2A44]/90 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                {property.property_type}
              </span>
            </div>

            {/* Details */}
            <div className="bg-white p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-medium text-[#0F2A44] font-['Poppins'] mb-2"
                    data-testid="detail-property-title"
                  >
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                    {property.location}, {property.city}
                  </div>
                </div>
                <div
                  className="bg-[#C9A227] text-[#0F2A44] px-6 py-3 text-2xl font-semibold font-['Poppins']"
                  data-testid="detail-property-price"
                >
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-t border-b border-gray-100">
                {property.property_type !== "land" && (
                  <>
                    <div className="flex items-center gap-2 text-slate-600">
                      <BedDouble className="w-5 h-5 text-[#C9A227]" />
                      <span className="font-medium">{property.bedrooms}</span>
                      <span className="text-sm text-slate-400">បន្ទប់គេង</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bath className="w-5 h-5 text-[#C9A227]" />
                      <span className="font-medium">{property.bathrooms}</span>
                      <span className="text-sm text-slate-400">បន្ទប់ទឹក</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Maximize className="w-5 h-5 text-[#C9A227]" />
                  <span className="font-medium">{property.area}</span>
                  <span className="text-sm text-slate-400">m²</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-[#0F2A44] font-['Poppins'] mb-3">ការពិពណ៌នា</h3>
                <p className="text-slate-600 text-sm leading-relaxed" data-testid="detail-property-description">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white p-8" data-testid="agent-card">
              <h3 className="text-lg font-medium text-[#0F2A44] font-['Poppins'] mb-4">
                ចាប់អារម្មណ៍អចលនទ្រព្យនេះទេ?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                ទាក់ទងភ្នាក់ងាររបស់យើងសម្រាប់ការទស្សនា ឬព័ត៌មានបន្ថែមអំពីអចលនទ្រព្យនេះ។
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+85512345678"
                  data-testid="detail-call-btn"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#0F2A44] text-white font-medium text-sm uppercase tracking-wide hover:bg-[#163A5E] transition-all"
                >
                  <Phone className="w-4 h-4" /> ហៅទូរស័ព្ទទៅភ្នាក់ងារ
                </a>
                <a
                  href="https://t.me/khrealty"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="detail-telegram-btn"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#C9A227] text-[#0F2A44] font-medium text-sm uppercase tracking-wide hover:bg-[#D4B03B] transition-all"
                >
                  <Send className="w-4 h-4" /> ផ្ញើសារតាមតេឡេក្រាម
                </a>
              </div>
            </div>

            {/* Property Summary */}
            <div className="bg-white p-8" data-testid="property-summary">
              <h3 className="text-lg font-medium text-[#0F2A44] font-['Poppins'] mb-4">
                សង្ខេបអចលនទ្រព្យ
              </h3>
              <div className="space-y-3">
                {[
                  ["ប្រភេទ", { villa: "វីឡា", borey: "បុរី", condo: "ខុនដូ", land: "ដី" }[property.property_type] || property.property_type],
                  ["ទីក្រុង", property.city],
                  ["ទីតាំង", property.location],
                  ["ស្ថានភាព", { available: "មាន", sold: "លក់ហើយ" }[property.status] || property.status],
                  ["ទំហំ", `${property.area} m²`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-medium text-[#0F2A44]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
