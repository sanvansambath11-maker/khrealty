import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, X, LogOut, Lock } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyForm = {
  title: "", description: "", price: "", property_type: "villa",
  location: "", city: "Phnom Penh", bedrooms: "0", bathrooms: "0",
  area: "0", images: "", featured: false, status: "available",
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("admin_logged_in") === "true");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  const [properties, setProperties] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState("properties");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await axios.post(`${API}/admin/login`, loginForm);
      sessionStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      toast.success("ចូលប្រើបានជោគជ័យ!");
    } catch (err) {
      toast.error("ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    setLoginForm({ username: "", password: "" });
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const [propRes, contactRes] = await Promise.all([
        axios.get(`${API}/properties`),
        axios.get(`${API}/contacts`),
      ]);
      setProperties(propRes.data);
      setContacts(contactRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (prop) => {
    setEditing(prop.id);
    setForm({
      title: prop.title,
      description: prop.description,
      price: String(prop.price),
      property_type: prop.property_type,
      location: prop.location,
      city: prop.city,
      bedrooms: String(prop.bedrooms),
      bathrooms: String(prop.bathrooms),
      area: String(prop.area),
      images: (prop.images || []).join(", "),
      featured: prop.featured,
      status: prop.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.location) {
      toast.error("សូមបំពេញចន្លោះដែលត្រូវការ (ចំណងជើង, តម្លៃ, ទីតាំង)");
      return;
    }
    const payload = {
      ...form,
      price: parseFloat(form.price),
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };

    try {
      if (editing) {
        await axios.put(`${API}/properties/${editing}`, payload);
        toast.success("បានធ្វើបច្ចុប្បន្នភាពអចលនទ្រព្យ");
      } else {
        await axios.post(`${API}/properties`, payload);
        toast.success("បានបង្កើតអចលនទ្រព្យ");
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error("បរាជ័យក្នុងការរក្សាទុកអចលនទ្រព្យ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបអចលនទ្រព្យនេះមែនទេ?")) return;
    try {
      await axios.delete(`${API}/properties/${id}`);
      toast.success("បានលុបអចលនទ្រព្យ");
      fetchData();
    } catch (err) {
      toast.error("បរាជ័យក្នុងការលុប");
    }
  };

  const seedData = async () => {
    try {
      const res = await axios.post(`${API}/seed`);
      toast.success(res.data.message);
      fetchData();
    } catch (err) {
      toast.error("បរាជ័យក្នុងការបញ្ចូលទិន្នន័យគំរូ");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${API}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const currentImages = form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const newImagesText = [...currentImages, ...uploadedUrls].join(", ");

      setForm({ ...form, images: newImagesText });
      toast.success("បានបញ្ចូលរូបភាពជោគជ័យ");
    } catch (err) {
      console.error(err);
      toast.error("បរាជ័យក្នុងការបញ្ចូលរូបភាព");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

  // ── Login Screen ──
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0F2A44] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A227]/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#C9A227]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-white font-['Poppins']">
              ផ្ទាំងគ្រប់គ្រង
            </h1>
            <p className="text-white/50 mt-1 text-sm">សូមចូលគណនីដើម្បីគ្រប់គ្រងអចលនទ្រព្យ</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">ឈ្មោះអ្នកប្រើប្រាស់</label>
              <Input
                data-testid="login-username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin"
                className="rounded-none bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#C9A227] h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">លេខសម្ងាត់</label>
              <Input
                data-testid="login-password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                className="rounded-none bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#C9A227] h-12"
                required
              />
            </div>
            <button
              data-testid="login-submit-btn"
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#C9A227] text-[#0F2A44] font-semibold text-sm uppercase tracking-wide hover:bg-[#D4B03B] transition-all disabled:opacity-50"
            >
              {loginLoading ? "កំពុងចូល..." : "ចូលប្រើ"}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">© {new Date().getFullYear()} KH Realty Admin</p>
        </div>
      </main>
    );
  }

  // ── Admin Dashboard ──
  return (
    <main data-testid="admin-page" className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#0F2A44] py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-white font-['Poppins']">
              ផ្ទាំងគ្រប់គ្រង
            </h1>
            <p className="text-white/60 mt-1 text-sm">គ្រប់គ្រងអចលនទ្រព្យ និងមើលការទំនាក់ទំនង</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white/80 text-sm hover:bg-white/20 transition-all"
          >
            <LogOut className="w-4 h-4" /> ចាកចេញ
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setTab("properties")}
            data-testid="admin-tab-properties"
            className={`px-5 py-2.5 text-sm font-medium transition-all ${tab === "properties" ? "bg-[#0F2A44] text-white" : "bg-white text-[#0F2A44] hover:bg-gray-50"
              }`}
          >
            អចលនទ្រព្យ ({properties.length})
          </button>
          <button
            onClick={() => setTab("contacts")}
            data-testid="admin-tab-contacts"
            className={`px-5 py-2.5 text-sm font-medium transition-all ${tab === "contacts" ? "bg-[#0F2A44] text-white" : "bg-white text-[#0F2A44] hover:bg-gray-50"
              }`}
          >
            ទំនាក់ទំនង ({contacts.length})
          </button>
        </div>

        {/* Properties Tab */}
        {tab === "properties" && (
          <div>
            <div className="flex gap-3 mb-6">
              <button
                data-testid="add-property-btn"
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] text-[#0F2A44] font-medium text-sm uppercase tracking-wide hover:bg-[#D4B03B] transition-all"
              >
                <Plus className="w-4 h-4" /> បន្ថែមអចលនទ្រព្យ
              </button>
              <button
                data-testid="seed-data-btn"
                onClick={seedData}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#0F2A44] font-medium text-sm hover:border-[#C9A227] transition-all"
              >
                ទិន្នន័យគំរូ
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-400">Loading...</div>
            ) : (
              <div className="bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-sm" data-testid="properties-table">
                  <thead className="bg-[#F5F5F5] text-[#0F2A44]">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">ចំណងជើង</th>
                      <th className="text-left py-3 px-4 font-medium">ប្រភេទ</th>
                      <th className="text-left py-3 px-4 font-medium">ទីក្រុង</th>
                      <th className="text-left py-3 px-4 font-medium">តម្លៃ</th>
                      <th className="text-left py-3 px-4 font-medium">លេចធ្លោ</th>
                      <th className="text-right py-3 px-4 font-medium">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((prop) => (
                      <tr key={prop.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-[#0F2A44]">{prop.title}</td>
                        <td className="py-3 px-4 capitalize text-slate-500">{prop.property_type}</td>
                        <td className="py-3 px-4 text-slate-500">{prop.city}</td>
                        <td className="py-3 px-4 text-[#C9A227] font-medium">{formatPrice(prop.price)}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 ${prop.featured ? "bg-[#C9A227]/10 text-[#C9A227]" : "bg-gray-100 text-gray-400"}`}>
                            {prop.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`/properties/${prop.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 transition-colors"
                              data-testid={`view-property-${prop.id}`}
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                            </a>
                            <button
                              onClick={() => openEdit(prop)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              data-testid={`edit-property-${prop.id}`}
                            >
                              <Pencil className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(prop.id)}
                              className="p-2 hover:bg-red-50 transition-colors"
                              data-testid={`delete-property-${prop.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {properties.length === 0 && (
                  <div className="text-center py-10 text-slate-400">មិនទាន់មានអចលនទ្រព្យនៅឡើយទេ។ សូមចុច "ទិន្នន័យគំរូ" ដើម្បីបន្ថែម។</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {tab === "contacts" && (
          <div className="bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm" data-testid="contacts-table">
              <thead className="bg-[#F5F5F5] text-[#0F2A44]">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">ឈ្មោះ</th>
                  <th className="text-left py-3 px-4 font-medium">ទូរស័ព្ទ</th>
                  <th className="text-left py-3 px-4 font-medium">តេឡេក្រាម</th>
                  <th className="text-left py-3 px-4 font-medium">សារ</th>
                  <th className="text-left py-3 px-4 font-medium">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-t border-gray-50">
                    <td className="py-3 px-4 font-medium text-[#0F2A44]">{c.name}</td>
                    <td className="py-3 px-4 text-slate-500">{c.phone}</td>
                    <td className="py-3 px-4 text-slate-500">{c.telegram || "—"}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{c.message}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <div className="text-center py-10 text-slate-400">No contact submissions yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0F2A44] font-['Poppins']">
              {editing ? "កែប្រែអចលនទ្រព្យ" : "បន្ថែមអចលនទ្រព្យថ្មី"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ចំណងជើង *</label>
              <Input
                data-testid="form-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ការពិពណ៌នា</label>
              <Textarea
                data-testid="form-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="rounded-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">តម្លៃ ($) *</label>
                <Input
                  data-testid="form-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ប្រភេទ</label>
                <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                  <SelectTrigger data-testid="form-type" className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">វីឡា</SelectItem>
                    <SelectItem value="borey">ផ្ទះបុរី</SelectItem>
                    <SelectItem value="condo">ខុនដូ</SelectItem>
                    <SelectItem value="land">ដី</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ទីតាំង *</label>
                <Input
                  data-testid="form-location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ទីក្រុង</label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger data-testid="form-city" className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phnom Penh">ភ្នំពេញ</SelectItem>
                    <SelectItem value="Siem Reap">សៀមរាប</SelectItem>
                    <SelectItem value="Sihanoukville">ព្រះសីហនុ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">បន្ទប់គេង</label>
                <Input
                  data-testid="form-bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">បន្ទប់ទឹក</label>
                <Input
                  data-testid="form-bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ទំហំ (ម²)</label>
                <Input
                  data-testid="form-area"
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="rounded-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F2A44] mb-1 block">រូបភាពអចលនទ្រព្យ (បញ្ជូលរូបភាព)</label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="rounded-none cursor-pointer mb-2"
              />
              <Input
                data-testid="form-images"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="តំណភ្ជាប់រូបភាព (បំបែកដោយសញ្ញាក្បៀស) ឬបញ្ចូលរូបភាពខាងលើ"
                className="rounded-none text-xs"
              />
              {form.images && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.images.split(",").map((url, i) => url.trim() && (
                    <img key={i} src={url.trim()} alt="" className="w-16 h-16 object-cover rounded border" />
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#0F2A44] mb-1 block">ស្ថានភាព</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger data-testid="form-status" className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">មាន</SelectItem>
                    <SelectItem value="sold">លក់ហើយ</SelectItem>
                    <SelectItem value="rented">ជួលហើយ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    data-testid="form-featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A227]"
                  />
                  <span className="text-sm font-medium text-[#0F2A44]">អចលនទ្រព្យលេចធ្លោ</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                data-testid="save-property-btn"
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#C9A227] text-[#0F2A44] font-medium text-sm uppercase tracking-wide hover:bg-[#D4B03B] transition-all"
              >
                {editing ? "ធ្វើបច្ចុប្បន្នភាពអចលនទ្រព្យ" : "បង្កើតអចលនទ្រព្យ"}
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                className="px-6 py-2.5 border border-gray-200 text-slate-500 text-sm hover:border-[#0F2A44] hover:text-[#0F2A44] transition-all"
              >
                បោះបង់
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
