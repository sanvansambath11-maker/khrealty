import { useState } from "react";
import { Phone, Send, Mail, MapPin } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", telegram: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("សូមបំពេញគ្រប់ចន្លោះដែលត្រូវការ");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, form);
      toast.success("សារបានផ្ញើដោយជោគជ័យ! យើងនឹងទាក់ទងទៅអ្នកក្នុងពេលឆាប់ៗនេះ។");
      setForm({ name: "", phone: "", telegram: "", message: "" });
    } catch (err) {
      toast.error("បរាជ័យក្នុងការផ្ញើសារ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-16 md:py-24 bg-[#F5F5F5]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-12">
          <p className="text-[#C9A227] text-sm font-medium tracking-[0.2em] uppercase mb-2">
            ទំនាក់ទំនងមកយើង
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#0F2A44] font-['Poppins']">
            ទាក់ទងមកយើង
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0F2A44] mb-1.5">
                  ឈ្មោះ <span className="text-red-500">*</span>
                </label>
                <Input
                  data-testid="contact-name"
                  placeholder="ឈ្មោះពេញរបស់អ្នក"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 rounded-none border-[#E2E8F0] focus:border-[#C9A227] focus-visible:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F2A44] mb-1.5">
                  ទូរស័ព្ទ <span className="text-red-500">*</span>
                </label>
                <Input
                  data-testid="contact-phone"
                  placeholder="+855 12 345 678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-12 rounded-none border-[#E2E8F0] focus:border-[#C9A227] focus-visible:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F2A44] mb-1.5">
                  តេឡេក្រាម
                </label>
                <Input
                  data-testid="contact-telegram"
                  placeholder="@your_telegram"
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  className="h-12 rounded-none border-[#E2E8F0] focus:border-[#C9A227] focus-visible:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F2A44] mb-1.5">
                  សារ <span className="text-red-500">*</span>
                </label>
                <Textarea
                  data-testid="contact-message"
                  placeholder="ប្រាប់យើងពីតម្រូវការអចលនទ្រព្យរបស់អ្នក..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="rounded-none border-[#E2E8F0] focus:border-[#C9A227] focus-visible:ring-[#C9A227]"
                />
              </div>
              <button
                type="submit"
                data-testid="contact-submit-btn"
                disabled={submitting}
                className="w-full h-12 bg-[#C9A227] text-[#0F2A44] hover:bg-[#D4B03B] font-medium tracking-wide uppercase text-sm transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "កំពុងបញ្ជូន..." : "បញ្ជូនសារ"}
              </button>
            </form>
          </div>

          {/* Info + Map */}
          <div className="space-y-8">
            {/* Office Info */}
            <div className="bg-white p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-medium text-[#0F2A44] font-['Poppins']">
                ព័ត៌មានការិយាល័យ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A227] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-sm text-[#0F2A44]">អាសយដ្ឋាន</p>
                    <p className="text-sm text-slate-500">#123, Street 2004, Sangkat Kakab, Khan Por Sen Chey, Phnom Penh, Cambodia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C9A227] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-sm text-[#0F2A44]">ទូរស័ព្ទ</p>
                    <p className="text-sm text-slate-500">+855 12 345 678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-[#C9A227] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-sm text-[#0F2A44]">តេឡេក្រាម</p>
                    <p className="text-sm text-slate-500">@khrealty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C9A227] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-sm text-[#0F2A44]">អ៊ីមែល</p>
                    <p className="text-sm text-slate-500">info@khrealty.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white shadow-sm overflow-hidden" data-testid="office-map">
              <iframe
                title="KH Realty Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125152.47706498168!2d104.84785!3d11.556374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
