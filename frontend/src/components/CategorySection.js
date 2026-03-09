import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "ផ្ទះបុរី",
    description: "ផ្ទះសហគមន៍ទំនើបជាមួយបរិក្ខារលំដាប់ខ្ពស់",
    image: "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85",
    type: "borey",
    span: "md:col-span-2",
  },
  {
    title: "ខុនដូ",
    description: "អាផាតមិនលំដាប់ខ្ពស់នៅទីតាំងល្អបំផុត",
    image: "https://images.unsplash.com/photo-1762452059456-e4c16c256dd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb25kbyUyMGJ1aWxkaW5nJTIwYXBhcnRtZW50fGVufDB8fHx8MTc3MzAzNjc1NHww&ixlib=rb-4.1.0&q=85",
    type: "condo",
    span: "",
  },
  {
    title: "ដីលក់",
    description: "ឱកាសវិនិយោគដីដ៏ល្អ",
    image: "https://images.unsplash.com/photo-1622015663084-307d19eabbbf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYSUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MzAzNjc1MHww&ixlib=rb-4.1.0&q=85",
    type: "land",
    span: "",
  },
];

export default function CategorySection() {
  return (
    <section data-testid="category-section" className="py-16 md:py-24 bg-[#F5F5F5]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-12">
          <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
            ស្វែងរកតាមប្រភេទ
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#0F2A44] font-['Poppins']">
            ប្រភេទអចលនទ្រព្យ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.type}
              to={`/properties?type=${cat.type}`}
              data-testid={`category-${cat.type}`}
              className={`relative h-[320px] md:h-[400px] overflow-hidden group cursor-pointer ${cat.span}`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0F2A44]/40 group-hover:bg-[#0F2A44]/55 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-medium text-white font-['Poppins'] mb-1">
                  {cat.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">{cat.description}</p>
                <span className="inline-flex items-center gap-2 text-[#C9A227] text-sm font-medium uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                  មើលអចលនទ្រព្យ <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
