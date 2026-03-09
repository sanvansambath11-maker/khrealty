import { Link } from "react-router-dom";
import { Phone, Send, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-[#0F2A44] text-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#C9A227] flex items-center justify-center">
                <span className="text-[#0F2A44] font-bold text-lg font-['Poppins']">KH</span>
              </div>
              <div>
                <span className="text-white font-semibold text-lg font-['Poppins']">KH Realty</span>
                <span className="block text-[10px] text-white/50 tracking-widest uppercase">អចលនទ្រព្យកម្ពុជា</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              ដៃគូអចលនទ្រព្យលំដាប់ខ្ពស់ដែលគួរឱ្យទុកចិត្តរបស់អ្នកនៅកម្ពុជា។យើងជួយអ្នកស្វែងរក ទិញ និងវិនិយោគលើអចលនទ្រព្យល្អបំផុត។
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-[#C9A227] mb-4">តំណភ្ជាប់រហ័ស</h4>
            <ul className="space-y-2.5">
              {[
                { label: "ទំព័រដើម", path: "/" },
                { label: "អចលនទ្រព្យ", path: "/properties" },
                { label: "អំពីយើង", path: "/#why-choose-us" },
                { label: "ទំនាក់ទំនង", path: "/#contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-white/60 hover:text-[#C9A227] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-[#C9A227] mb-4">ប្រភេទអចលនទ្រព្យ</h4>
            <ul className="space-y-2.5">
              {[
                { label: "ផ្ទះបុរី", type: "borey" },
                { label: "ខុនដូ", type: "condo" },
                { label: "វីឡា", type: "villa" },
                { label: "ដីលក់", type: "land" },
              ].map((item) => (
                <li key={item.type}>
                  <Link
                    to={`/properties?type=${item.type}`}
                    className="text-white/60 hover:text-[#C9A227] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-[#C9A227] mb-4">ព័ត៌មានទំនាក់ទំនង</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A227] mt-0.5 shrink-0" strokeWidth={1.5} />
                ភ្នំពេញ, កម្ពុជា
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                +855 12 345 678
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Send className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                @khrealty
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                info@khrealty.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} KH Realty. រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 hover:text-[#C9A227] text-xs transition-colors">គោលការណ៍​ឯកជនភាព</a>
            <a href="#" className="text-white/40 hover:text-[#C9A227] text-xs transition-colors">លក្ខខណ្ឌនៃសេវាកម្ម</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
