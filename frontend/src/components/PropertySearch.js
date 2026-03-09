import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, BedDouble } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function PropertySearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    priceRange: "",
    bedrooms: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.type) params.set("type", filters.type);
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-");
      if (min) params.set("min_price", min);
      if (max) params.set("max_price", max);
    }
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section data-testid="property-search" className="relative z-20 -mt-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 shadow-2xl border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> ទីតាំង
            </label>
            <Select
              value={filters.city}
              onValueChange={(v) => setFilters({ ...filters, city: v })}
            >
              <SelectTrigger data-testid="search-location" className="h-12 border-[#E2E8F0] focus:border-[#C9A227] rounded-none">
                <SelectValue placeholder="គ្រប់ទីតាំង" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phnom Penh">ភ្នំពេញ</SelectItem>
                <SelectItem value="Siem Reap">សៀមរាប</SelectItem>
                <SelectItem value="Sihanoukville">ព្រះសីហនុ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Home className="w-3 h-3" /> ប្រភេទអចលនទ្រព្យ
            </label>
            <Select
              value={filters.type}
              onValueChange={(v) => setFilters({ ...filters, type: v })}
            >
              <SelectTrigger data-testid="search-type" className="h-12 border-[#E2E8F0] focus:border-[#C9A227] rounded-none">
                <SelectValue placeholder="គ្រប់ប្រភេទ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">វីឡា</SelectItem>
                <SelectItem value="borey">ផ្ទះបុរី</SelectItem>
                <SelectItem value="condo">ខុនដូ</SelectItem>
                <SelectItem value="land">ដី</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> កម្រិតតម្លៃ
            </label>
            <Select
              value={filters.priceRange}
              onValueChange={(v) => setFilters({ ...filters, priceRange: v })}
            >
              <SelectTrigger data-testid="search-price" className="h-12 border-[#E2E8F0] focus:border-[#C9A227] rounded-none">
                <SelectValue placeholder="គ្រប់តម្លៃ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-100000">ក្រោម $100K</SelectItem>
                <SelectItem value="100000-200000">$100K - $200K</SelectItem>
                <SelectItem value="200000-500000">$200K - $500K</SelectItem>
                <SelectItem value="500000-">លើស $500K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BedDouble className="w-3 h-3" /> បន្ទប់គេង
            </label>
            <Select
              value={filters.bedrooms}
              onValueChange={(v) => setFilters({ ...filters, bedrooms: v })}
            >
              <SelectTrigger data-testid="search-bedrooms" className="h-12 border-[#E2E8F0] focus:border-[#C9A227] rounded-none">
                <SelectValue placeholder="ណាមួយ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              data-testid="search-submit-btn"
              onClick={handleSearch}
              className="w-full h-12 bg-[#C9A227] text-[#0F2A44] hover:bg-[#D4B03B] font-medium tracking-wide uppercase text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              ស្វែងរក
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
