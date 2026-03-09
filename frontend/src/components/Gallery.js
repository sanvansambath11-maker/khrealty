import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

const galleryData = {
  completed: [
    { src: "https://images.unsplash.com/photo-1757439402359-aed14d39fc1b?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Luxury Villa Project" },
    { src: "https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Modern Residence" },
    { src: "https://images.unsplash.com/photo-1622015663084-307d19eabbbf?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Tropical Estate" },
    { src: "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Borey Development" },
  ],
  interiors: [
    { src: "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Living Room" },
    { src: "https://images.unsplash.com/photo-1628744876490-19b035ecf9c3?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Modern Interior" },
    { src: "https://images.unsplash.com/photo-1628745277866-ff9305ac52cc?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Kitchen Design" },
    { src: "https://images.unsplash.com/photo-1628744876525-f2678d8af47f?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Bedroom Suite" },
  ],
  exteriors: [
    { src: "https://images.unsplash.com/photo-1717910699360-8199089f0446?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Villa Exterior" },
    { src: "https://images.unsplash.com/photo-1715874690160-3bc8acfc2fc5?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Phnom Penh Skyline" },
    { src: "https://images.unsplash.com/photo-1762452059456-e4c16c256dd1?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Modern Building" },
    { src: "https://images.unsplash.com/photo-1765785165219-d5dd951fbc98?crop=entropy&cs=srgb&fm=jpg&w=600&q=80", alt: "Condo Tower" },
  ],
};

function GalleryGrid({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative overflow-hidden group cursor-pointer ${i === 0 ? "col-span-2 row-span-2" : ""
            }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#0F2A44]/0 group-hover:bg-[#0F2A44]/40 transition-all duration-300 flex items-end">
            <span className="text-white text-sm font-medium p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              {img.alt}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [tab, setTab] = useState("completed");

  return (
    <section data-testid="gallery-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-12">
          <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
            ស្នាដៃរបស់យើង
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#0F2A44] font-['Poppins']">
            វិចិត្រសាល និងគម្រោង
          </h2>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-[#F5F5F5] mb-8" data-testid="gallery-tabs">
            <TabsTrigger
              value="completed"
              data-testid="gallery-tab-completed"
              className="data-[state=active]:bg-[#0F2A44] data-[state=active]:text-white"
            >
              គម្រោងដែលបានបញ្ចប់
            </TabsTrigger>
            <TabsTrigger
              value="interiors"
              data-testid="gallery-tab-interiors"
              className="data-[state=active]:bg-[#0F2A44] data-[state=active]:text-white"
            >
              ការរចនាខាងក្នុង
            </TabsTrigger>
            <TabsTrigger
              value="exteriors"
              data-testid="gallery-tab-exteriors"
              className="data-[state=active]:bg-[#0F2A44] data-[state=active]:text-white"
            >
              ការរចនាខាងក្រៅ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            <GalleryGrid images={galleryData.completed} />
          </TabsContent>
          <TabsContent value="interiors">
            <GalleryGrid images={galleryData.interiors} />
          </TabsContent>
          <TabsContent value="exteriors">
            <GalleryGrid images={galleryData.exteriors} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
