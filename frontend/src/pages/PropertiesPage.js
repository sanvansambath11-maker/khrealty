import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    priceRange: "",
    bedrooms: searchParams.get("bedrooms") || "",
  });

  // Build min/max from URL params
  useEffect(() => {
    const minP = searchParams.get("min_price");
    const maxP = searchParams.get("max_price");
    if (minP && maxP) {
      setFilters((f) => ({ ...f, priceRange: `${minP}-${maxP}` }));
    } else if (minP) {
      setFilters((f) => ({ ...f, priceRange: `${minP}-` }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const city = searchParams.get("city");
      const type = searchParams.get("type");
      const minPrice = searchParams.get("min_price");
      const maxPrice = searchParams.get("max_price");
      const beds = searchParams.get("bedrooms");

      if (city) params.set("city", city);
      if (type) params.set("property_type", type);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      if (beds) params.set("bedrooms", beds);

      const res = await axios.get(`${API}/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.type) params.set("type", filters.type);
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-");
      if (min) params.set("min_price", min);
      if (max) params.set("max_price", max);
    }
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ city: "", type: "", priceRange: "", bedrooms: "" });
    setSearchParams({});
    setShowFilters(false);
  };

  const activeFilterCount = [filters.city, filters.type, filters.priceRange, filters.bedrooms].filter(Boolean).length;

  const getPageTitle = () => {
    const type = searchParams.get("type");
    if (type === "borey") return "ផ្ទះបុរី";
    if (type === "condo") return "ខុនដូ";
    if (type === "villa") return "វីឡា";
    if (type === "land") return "ដីលក់";
    return "អចលនទ្រព្យទាំងអស់";
  };

  return (
    <main data-testid="properties-page" className="min-h-screen bg-[#F5F5F5]">
      {/* Page Header */}
      <div className="bg-[#0F2A44] py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
            ស្វែងរកការចុះបញ្ជីរបស់យើង
          </p>
          <h1
            className="text-3xl md:text-5xl font-medium tracking-tight text-white font-['Poppins']"
            data-testid="properties-page-title"
          >
            {getPageTitle()}
          </h1>
          <p className="text-white/60 mt-2 text-base">
            បានរកឃើញ {properties.length} អចលនទ្រព្យ
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            data-testid="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-[#0F2A44] hover:border-[#C9A227] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            តម្រង
            {activeFilterCount > 0 && (
              <span className="bg-[#C9A227] text-[#0F2A44] text-xs w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              data-testid="clear-filters-btn"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#C9A227] transition-colors"
            >
              <X className="w-3.5 h-3.5" /> សម្អាតទាំងអស់
            </button>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-white p-6 mb-8 shadow-sm border border-gray-100" data-testid="filter-panel">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">ទីតាំង</label>
                <Select value={filters.city} onValueChange={(v) => setFilters({ ...filters, city: v })}>
                  <SelectTrigger data-testid="filter-location" className="h-11 rounded-none">
                    <SelectValue placeholder="គ្រប់ទីតាំង" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phnom Penh">ភ្នំពេញ</SelectItem>
                    <SelectItem value="Siem Reap">សៀមរាប</SelectItem>
                    <SelectItem value="Sihanoukville">ព្រះសីហនុ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">ប្រភេទ</label>
                <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                  <SelectTrigger data-testid="filter-type" className="h-11 rounded-none">
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
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">កម្រិតតម្លៃ</label>
                <Select value={filters.priceRange} onValueChange={(v) => setFilters({ ...filters, priceRange: v })}>
                  <SelectTrigger data-testid="filter-price" className="h-11 rounded-none">
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
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">បន្ទប់គេង</label>
                <Select value={filters.bedrooms} onValueChange={(v) => setFilters({ ...filters, bedrooms: v })}>
                  <SelectTrigger data-testid="filter-bedrooms" className="h-11 rounded-none">
                    <SelectValue placeholder="ណាមួយ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                data-testid="apply-filters-btn"
                onClick={applyFilters}
                className="px-6 py-2.5 bg-[#C9A227] text-[#0F2A44] font-medium text-sm uppercase tracking-wide hover:bg-[#D4B03B] transition-all"
              >
                <Search className="w-4 h-4 inline mr-2" />
                អនុវត្តតម្រង
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 border border-gray-200 text-slate-500 font-medium text-sm uppercase tracking-wide hover:border-[#0F2A44] hover:text-[#0F2A44] transition-all"
              >
                កំណត់ឡើងវិញ
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white p-0">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 w-3/4" />
                  <div className="h-3 bg-gray-200 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <p className="text-xl text-slate-400 font-['Poppins']">រកមិនឃើញអចលនទ្រព្យទេ</p>
            <p className="text-sm text-slate-400 mt-2">សាកល្បងកែតម្រូវតម្រងរបស់អ្នក</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2.5 bg-[#C9A227] text-[#0F2A44] font-medium text-sm uppercase tracking-wide"
            >
              សម្អាតតម្រង
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
