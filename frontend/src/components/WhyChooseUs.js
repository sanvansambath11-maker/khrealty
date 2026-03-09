import { ShieldCheck, ListChecks, MapPinned, Headset } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ភ្នាក់ងារអចលនទ្រព្យដែលគួរឱ្យទុកចិត្ត",
    description: "អ្នកជំនាញអចលនទ្រព្យដែលមានអាជ្ញាប័ណ្ណនិងត្រូវបានផ្ទៀងផ្ទាត់ដែលអ្នកអាចពឹងផ្អែកបានសម្រាប់រាល់ប្រតិបត្តិការ។",
  },
  {
    icon: ListChecks,
    title: "ការចុះបញ្ជីដែលត្រូវបានផ្ទៀងផ្ទាត់",
    description: "រាល់អចលនទ្រព្យត្រូវបានត្រួតពិនិត្យ និងផ្ទៀងផ្ទាត់ផ្ទាល់មុនពេលដាក់លក់នៅលើកម្មវិធីរបស់យើង។",
  },
  {
    icon: MapPinned,
    title: "ទីតាំងវិនិយោគល្អបំផុត",
    description: "ចំណេះដឹងជំនាញអំពីតំបន់ដែលកំពុងរីកចម្រើនលឿនបំផុតរបស់ប្រទេសកម្ពុជាសម្រាប់ប្រាក់ចំណេញអតិបរមាលើការវិនិយោគ។",
  },
  {
    icon: Headset,
    title: "ការគាំទ្រប្រកបដោយវិជ្ជាជីវៈ",
    description: "ក្រុមគាំទ្រពិសេសមានជាភាសាអង់គ្លេស និងខ្មែរ ដើម្បីណែនាំអ្នកតាមគ្រប់ជំហាន។",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      data-testid="why-choose-us"
      className="py-16 md:py-24 bg-[#0F2A44]"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
            គុណសម្បត្តិរបស់យើង
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white font-['Poppins']">
            ហេតុអ្វីជ្រើសរើសយើង
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => (
            <div
              key={i}
              data-testid={`feature-${i}`}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-5 border border-[#C9A227]/30 flex items-center justify-center group-hover:bg-[#C9A227]/10 transition-all duration-300">
                <feat.icon className="w-7 h-7 text-[#C9A227]" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-medium text-base font-['Poppins'] mb-2">
                {feat.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
