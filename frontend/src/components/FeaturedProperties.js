import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API}/properties?featured=true`);
        setProperties(res.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section data-testid="featured-properties" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
              ជ្រើសរើសសម្រាប់អ្នក
            </p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#0F2A44] font-['Poppins']">
              អចលនទ្រព្យលេចធ្លោ
            </h2>
          </div>
          <Link
            to="/properties"
            data-testid="view-all-properties-btn"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-[#0F2A44] hover:text-[#C9A227] font-medium text-sm transition-colors"
          >
            មើលអចលនទ្រព្យទាំងអស់ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 mb-4" />
                <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
