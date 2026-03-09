import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";

export default function PropertyCard({ property }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

  const typeLabel = {
    villa: "វីឡា",
    borey: "បុរី",
    condo: "ខុនដូ",
    land: "ដី",
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      data-testid={`property-card-${property.id}`}
      className="group bg-white overflow-hidden border border-transparent hover:border-[#C9A227]/30 transition-all duration-300 shadow-sm hover:shadow-xl block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=600"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Type badge */}
        <span className="absolute top-4 left-4 bg-[#0F2A44]/90 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
          {typeLabel[property.property_type] || property.property_type}
        </span>
        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <span
            className="bg-[#C9A227] text-[#0F2A44] px-4 py-2 text-lg font-semibold font-['Poppins']"
            data-testid={`property-price-${property.id}`}
          >
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <h3
          className="text-[#0F2A44] font-medium text-base font-['Poppins'] mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-1"
          data-testid={`property-title-${property.id}`}
        >
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>{property.location}, {property.city}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-slate-500 text-sm">
          {property.property_type !== "land" && (
            <>
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                <span>{property.bedrooms} បន្ទប់គេង</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} បន្ទប់ទឹក</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
