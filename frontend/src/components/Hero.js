import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1706583733600-08e942012484?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBsdXh1cnklMjB2aWxsYSUyMGNhbWJvZGlhJTIwZXh0ZXJpb3J8ZW58MHx8fHwxNzczMDM2Njc4fDA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Luxury villa in Cambodia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F2A44]/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 w-full">
        <div className="max-w-2xl">
          <p
            className="text-[#C9A227] font-medium text-sm tracking-[0.2em] uppercase mb-4 font-['Inter']"
            data-testid="hero-label"
          >
            អចលនទ្រព្យលំដាប់ខ្ពស់នៅកម្ពុជា
          </p>
          <h1
            className="text-4xl md:text-6xl font-light tracking-tight leading-tight text-white font-['Poppins'] mb-6 flex flex-col gap-4"
            data-testid="hero-title"
          >
            ស្វែងរកផ្ទះក្នុងក្ដីស្រមៃរបស់អ្នក
            <span>
              នៅកម្ពុជា
            </span>
          </h1>
          <p
            className="text-lg text-white/80 leading-relaxed mb-3 font-['Inter']"
            data-testid="hero-subtitle"
          >
            ទិញ ជួល ឬ វិនិយោគលើអចលនទ្រព្យ
          </p>
          <p className="text-sm text-white/60 tracking-widest uppercase font-['Inter'] mb-10">
            ភ្នំពេញ &bull; សៀមរាប &bull; ព្រះសីហនុ
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/properties"
              data-testid="hero-browse-btn"
              className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0F2A44] hover:bg-[#D4B03B] px-8 py-4 font-medium tracking-wide uppercase text-sm transition-all duration-300"
            >
              រុករកអចលនទ្រព្យ
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="#contact"
              data-testid="hero-contact-btn"
              className="inline-flex items-center gap-2 bg-transparent border border-white/60 text-white hover:bg-white hover:text-[#0F2A44] px-8 py-4 font-medium tracking-wide uppercase text-sm transition-all duration-300"
            >
              ទាក់ទងភ្នាក់ងារ
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
