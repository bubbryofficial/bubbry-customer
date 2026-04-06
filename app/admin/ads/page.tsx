"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const ADMIN_PASSWORD = "bubbry-admin-2024";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.header { background: #0D1B3E; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
.hdr-title { font-size: 18px; font-weight: 900; color: white; }
.hdr-badge { background: #1A6BFF; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
.page { max-width: 640px; margin: 0 auto; padding: 20px 16px 80px; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.card-title { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 14px; }
.lbl { font-size: 11px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
.inp { width: 100%; padding: 11px 14px; border: 1.5px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 500; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; margin-bottom: 12px; box-sizing: border-box; transition: border-color 0.2s; }
.inp:focus { border-color: #1A6BFF; }
.sel { width: 100%; padding: 11px 14px; border: 1.5px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-weight: 600; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; margin-bottom: 12px; background: white; }
.btn-p { width: 100%; padding: 13px; background: #1A6BFF; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.btn-p:hover:not(:disabled) { background: #1255CC; }
.btn-p:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sm { padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; border: 1.5px solid; transition: all 0.15s; }
.btn-active { background: #E6FAF4; color: #00875A; border-color: #B8E8D4; }
.btn-pause { background: #FFF8E6; color: #946200; border-color: #FFD966; }
.btn-del { background: #FFF0F0; color: #E53E3E; border-color: #FFCDD2; }
.btn-renew { background: #1A6BFF; color: white; border-color: #1A6BFF; }
.ad-row { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F4F6FB; }
.ad-row:last-child { border-bottom: none; }
.ad-icon { width: 52px; height: 52px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.ad-name { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 3px; }
.ad-meta { font-size: 11px; color: #8A96B5; font-weight: 600; margin-bottom: 8px; line-height: 1.6; }
.chip { display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 5px; margin-right: 4px; }
.chip-hero { background: #EBF1FF; color: #1A6BFF; }
.chip-shop { background: #FFF8E6; color: #946200; }
.chip-prod { background: #E6FAF4; color: #00875A; }
.chip-expired { background: #FFF0F0; color: #E53E3E; }
.chip-expiring { background: #FFF8E6; color: #946200; }
.btns { display: flex; gap: 6px; flex-wrap: wrap; }
.pricing-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F4F6FB; font-size: 13px; font-weight: 600; color: #0D1B3E; }
.pricing-row:last-child { border-bottom: none; }
.pricing-price { color: #00875A; font-weight: 800; }
.empty { text-align: center; padding: 32px; color: #8A96B5; font-size: 13px; }
/* Shop search dropdown */
.shop-search-wrap { position: relative; margin-bottom: 12px; }
.shop-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1.5px solid #E4EAFF; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; max-height: 200px; overflow-y: auto; }
.shop-opt { padding: 10px 14px; cursor: pointer; font-size: 13px; font-weight: 600; color: #0D1B3E; border-bottom: 1px solid #F4F6FB; transition: background 0.1s; }
.shop-opt:last-child { border-bottom: none; }
.shop-opt:hover { background: #EBF1FF; color: #1A6BFF; }
.shop-selected { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #E6FAF4; border: 1.5px solid #B8E8D4; border-radius: 10px; margin-bottom: 12px; cursor: pointer; }
.shop-selected-name { font-size: 14px; font-weight: 800; color: #00875A; flex: 1; }
.shop-clear { font-size: 12px; color: #8A96B5; font-weight: 700; background: none; border: none; cursor: pointer; }
/* Renew modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.5); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: white; border-radius: 20px; padding: 24px; width: 100%; max-width: 380px; }
.modal-title { font-size: 18px; font-weight: 900; color: #0D1B3E; margin-bottom: 6px; }
.modal-sub { font-size: 13px; color: #8A96B5; font-weight: 500; margin-bottom: 20px; }
.expired-banner { background: #FFF0F0; border: 1.5px solid #FFCDD2; border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #E53E3E; }
`;

const SLOTS = [
  { value: "hero_banner", label: "🎯 Hero Banner — ₹1,499/mo" },
  { value: "featured_shop", label: "🏆 Featured Shop — ₹999/mo" },
  { value: "sponsored_product", label: "📌 Sponsored Product — ₹499/mo" },
];

export default function AdsAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [ads, setAds] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    shop_id: "", shop_name: "", slot: "hero_banner",
    title: "", subtitle: "", cta: "Shop Now",
    bg_color: "#1A6BFF", emoji: "🛒", link_category: "", paid_until: ""
  });
  const [shopSearch, setShopSearch] = useState("");
  const [showShopDrop, setShowShopDrop] = useState(false);
  const [renewAd, setRenewAd] = useState<any>(null);
  const [renewDate, setRenewDate] = useState("");
  const shopRef = useRef<HTMLDivElement>(null);
  // Sponsored product selection
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]); // max 3

  useEffect(() => {
    if (authed) { loadAds(); loadShops(); loadCategories(); }
  }, [authed]);

  // Close shop dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShowShopDrop(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function loadAds() {
    const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    setAds(data || []);
  }
  async function loadShops() {
    const { data } = await supabase.from("profiles").select("id,shop_name,name").eq("role", "shopkeeper");
    setShops(data || []);
  }
  async function loadCategories() {
    // Load from categories table first
    const { data: catData } = await supabase.from("categories").select("name").order("sort_order");
    if (catData && catData.length > 0) {
      setCategories(catData.map((c: any) => c.name));
      return;
    }
    // Fallback: distinct categories from master_products
    const { data: mpData } = await supabase.from("master_products").select("category");
    const cats = [...new Set((mpData || []).map((r: any) => r.category).filter(Boolean))].sort();
    setCategories(cats as string[]);
  }

  async function createAd() {
    if (!form.title) { alert("Enter ad title"); return; }
    if (form.slot === "sponsored_product" && selectedProducts.length === 0) {
      alert("Please select at least 1 product to sponsor");
      return;
    }
    setSaving(true);
    const productIds = selectedProducts.map((p:any) => p.product_id);
    const { error } = await supabase.from("ads").insert({
      ...form,
      sponsored_product_ids: productIds.length > 0 ? productIds : null,
      active: true, created_at: new Date().toISOString()
    });
    if (error) alert("Error: " + error.message);
    else {
      alert("✓ Ad created!");
      loadAds();
      setForm({ shop_id: "", shop_name: "", slot: "hero_banner", title: "", subtitle: "", cta: "Shop Now", bg_color: "#1A6BFF", emoji: "🛒", link_category: "", paid_until: "" });
      setShopSearch("");
      setSelectedProducts([]);
      setShopProducts([]);
      setProductSearch("");
    }
    setSaving(false);
  }

  async function toggleAd(id: string, active: boolean) {
    await supabase.from("ads").update({ active: !active }).eq("id", id);
    loadAds();
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad permanently?")) return;
    await supabase.from("ads").delete().eq("id", id);
    loadAds();
  }

  async function renewAdFn() {
    if (!renewDate) { alert("Select a renewal date"); return; }
    await supabase.from("ads").update({ paid_until: renewDate, active: true }).eq("id", renewAd.id);
    setRenewAd(null);
    setRenewDate("");
    loadAds();
    alert("✓ Ad renewed successfully!");
  }

  function isExpired(ad: any) {
    if (!ad.paid_until) return false;
    return new Date(ad.paid_until) < new Date();
  }
  function isExpiringSoon(ad: any) {
    if (!ad.paid_until) return false;
    const daysLeft = (new Date(ad.paid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysLeft >= 0 && daysLeft <= 3;
  }

  const filteredShops = shops.filter(s =>
    (s.shop_name || s.name || "").toLowerCase().includes(shopSearch.toLowerCase())
  );

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{CSS}</style>
      <div className="card" style={{ maxWidth: 360, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#0D1B3E" }}>Bubbry Ads Manager</div>
          <div style={{ fontSize: 13, color: "#8A96B5", marginTop: 4 }}>Admin access only</div>
        </div>
        <input className="inp" type="password" placeholder="Admin password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password"))} />
        <button className="btn-p" onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password")}>Enter</button>
      </div>
    </div>
  );

  const expiredAds = ads.filter(isExpired);
  const expiringSoon = ads.filter(a => isExpiringSoon(a) && !isExpired(a));

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div className="header">
        <div className="hdr-title">💰 Ads Manager</div>
        <div className="hdr-badge">{ads.filter(a => a.active && !isExpired(a)).length} Active</div>
      </div>

      <div className="page">

        {/* Expiry alerts */}
        {(expiredAds.length > 0 || expiringSoon.length > 0) && (
          <div className="card" style={{ borderColor: expiredAds.length > 0 ? "#FFCDD2" : "#FFD966" }}>
            <div className="card-title">
              {expiredAds.length > 0 ? "⚠️ Expired Ads" : "⏰ Expiring Soon"}
            </div>
            {[...expiredAds, ...expiringSoon].map(ad => (
              <div key={ad.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #F4F6FB" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0D1B3E" }}>{ad.title}</div>
                  <div style={{ fontSize: 12, color: isExpired(ad) ? "#E53E3E" : "#946200", fontWeight: 600, marginTop: 2 }}>
                    {isExpired(ad)
                      ? `Expired on ${new Date(ad.paid_until).toLocaleDateString("en-IN")}`
                      : `Expires ${new Date(ad.paid_until).toLocaleDateString("en-IN")}`}
                  </div>
                </div>
                <button className="btn-sm btn-renew" onClick={() => { setRenewAd(ad); setRenewDate(""); }}>
                  🔄 Renew
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="card">
          <div className="card-title">💳 Ad Slot Pricing</div>
          {[["🎯 Hero Banner", "Top of homepage, full width", "₹1,499/mo"],
            ["🏆 Featured Shop", "#1 in Shops Nearby list", "₹999/mo"],
            ["📌 Sponsored Product", "Pinned in category feed", "₹499/mo"]].map(([n, d, p]) => (
            <div key={n} className="pricing-row">
              <div><div style={{ fontWeight: 800 }}>{n}</div><div style={{ fontSize: 11, color: "#8A96B5", marginTop: 2 }}>{d}</div></div>
              <div className="pricing-price">{p}</div>
            </div>
          ))}
        </div>

        {/* Create Ad */}
        <div className="card">
          <div className="card-title">➕ Create New Ad</div>

          <label className="lbl">Ad Slot</label>
          <select className="sel" value={form.slot} onChange={e => {
            const slot = e.target.value;
            setForm(f => ({ ...f, slot }));
            setSelectedProducts([]);
            if (slot === "sponsored_product" && form.shop_id) {
              supabase.from("shop_products").select("id,product_id,name,price,stock").eq("shop_id",form.shop_id).gt("stock",0).order("name").then(({data})=>setShopProducts(data||[]));
            }
          }}>
            {SLOTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Shop Search */}
          <label className="lbl">Shop</label>
          {form.shop_id ? (
            <div className="shop-selected">
              <span style={{ fontSize: 18 }}>🏪</span>
              <div className="shop-selected-name">✓ {form.shop_name}</div>
              <button className="shop-clear" onClick={() => { setForm(f => ({ ...f, shop_id: "", shop_name: "" })); setShopSearch(""); }}>✕ Clear</button>
            </div>
          ) : (
            <div className="shop-search-wrap" ref={shopRef}>
              <input
                className="inp"
                style={{ marginBottom: 0 }}
                placeholder="🔍 Search shop by name..."
                value={shopSearch}
                onChange={e => { setShopSearch(e.target.value); setShowShopDrop(true); }}
                onFocus={() => setShowShopDrop(true)}
              />
              {showShopDrop && filteredShops.length > 0 && (
                <div className="shop-dropdown">
                  <div className="shop-opt" style={{ color: "#8A96B5" }}
                    onClick={() => { setForm(f => ({ ...f, shop_id: "", shop_name: "" })); setShopSearch(""); setShowShopDrop(false); }}>
                    — No specific shop (global ad) —
                  </div>
                  {filteredShops.map(s => (
                    <div key={s.id} className="shop-opt" onClick={() => {
                      const name = s.shop_name || s.name;
                      setForm(f => ({ ...f, shop_id: s.id, shop_name: name, title: f.title || name }));
                      setShopSearch(name);
                      setShowShopDrop(false);
                      setSelectedProducts([]);
                      // Load shop products for sponsored product slot
                      if (form.slot === "sponsored_product") {
                        supabase.from("shop_products").select("id,product_id,name,price,stock").eq("shop_id",s.id).gt("stock",0).order("name").then(({data})=>setShopProducts(data||[]));
                      }
                    }}>
                      🏪 {s.shop_name || s.name}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginBottom: 12 }} />
            </div>
          )}

          {/* Sponsored Product selector — only for sponsored_product slot */}
          {form.slot === "sponsored_product" && form.shop_id && (
            <div style={{marginBottom:16}}>
              <label className="lbl">
                Select Products to Sponsor
                <span style={{marginLeft:6,fontSize:10,fontWeight:800,background:"#EBF1FF",color:"#1A6BFF",borderRadius:5,padding:"2px 6px"}}>Up to 3</span>
              </label>
              {selectedProducts.length > 0 && (
                <div className="selected-prods">
                  {selectedProducts.map((p:any) => (
                    <div key={p.product_id} className="selected-prod-chip">
                      {p.name?.slice(0,18)}{p.name?.length > 18 ? "..." : ""}
                      <button onClick={() => setSelectedProducts(prev => prev.filter((x:any) => x.product_id !== p.product_id))}
                        style={{background:"none",border:"none",color:"#1A6BFF",cursor:"pointer",padding:0,fontSize:14,fontWeight:900}}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="prod-search-wrap">
                <input className="inp" style={{marginBottom:4}} placeholder="🔍 Search products..."
                  value={productSearch} onChange={e => setProductSearch(e.target.value)} />
              </div>
              <div className="prod-grid" style={{maxHeight:240,overflowY:"auto"}}>
                {shopProducts
                  .filter((p:any) => !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase()))
                  .slice(0,30)
                  .map((p:any) => {
                    const isSelected = selectedProducts.some((x:any) => x.product_id === p.product_id);
                    const maxReached = selectedProducts.length >= 3 && !isSelected;
                    return (
                      <div key={p.product_id} className={`prod-row ${isSelected?"selected":""} ${maxReached?"disabled":""}`}
                        onClick={() => {
                          if (maxReached) { alert("Maximum 3 products per sponsored ad"); return; }
                          if (isSelected) setSelectedProducts(prev => prev.filter((x:any) => x.product_id !== p.product_id));
                          else setSelectedProducts(prev => [...prev, p]);
                        }}>
                        <div className="prod-img" style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:"#EBF1FF"}}>📦</div>
                        <div className="prod-name">{p.name}</div>
                        <div>
                          <div className="prod-price">₹{p.price}</div>
                          <div style={{fontSize:10,color:"#8A96B5",fontWeight:600}}>Stock: {p.stock}</div>
                        </div>
                        <div className={`prod-check ${isSelected?"on":""}`}>{isSelected?"✓":""}</div>
                      </div>
                    );
                  })}
                {shopProducts.length === 0 && (
                  <div style={{textAlign:"center",padding:20,color:"#8A96B5",fontSize:13}}>No products found for this shop</div>
                )}
              </div>
            </div>
          )}

          <label className="lbl">Ad Title *</label>
          <input className="inp" placeholder="e.g. Fresh Dairy Delivered Fast" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

          <label className="lbl">Subtitle</label>
          <input className="inp" placeholder="e.g. From Sharma General Store" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label className="lbl">CTA Button Text</label>
              <input className="inp" placeholder="Shop Now" value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} />
            </div>
            <div>
              <label className="lbl">Emoji</label>
              <input className="inp" placeholder="🛒" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label className="lbl">Background Color</label>
              <input className="inp" type="color" value={form.bg_color} onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))} style={{ height: 44, padding: 4 }} />
            </div>
            <div>
              <label className="lbl">Link to Category</label>
              <select className="sel" value={form.link_category} onChange={e => setForm(f => ({ ...f, link_category: e.target.value }))}>
                <option value="">— No category link —</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <label className="lbl">Paid Until Date *</label>
          <input className="inp" type="date" value={form.paid_until}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setForm(f => ({ ...f, paid_until: e.target.value }))} />

          <button className="btn-p" onClick={createAd} disabled={saving || !form.title || !form.paid_until}>
            {saving ? "Creating..." : "✓ Create Ad"}
          </button>
        </div>

        {/* All Ads */}
        <div className="card">
          <div className="card-title">📋 All Ads ({ads.length})</div>
          {ads.length === 0 && <div className="empty">No ads yet</div>}
          {ads.map(ad => (
            <div key={ad.id} className="ad-row">
              <div className="ad-icon" style={{ background: ad.bg_color || "#EBF1FF" }}>{ad.emoji || "📢"}</div>
              <div style={{ flex: 1 }}>
                <div className="ad-name">{ad.title}</div>
                <div className="ad-meta">
                  <span className={`chip ${ad.slot === "hero_banner" ? "chip-hero" : ad.slot === "featured_shop" ? "chip-shop" : "chip-prod"}`}>
                    {ad.slot?.replace(/_/g, " ")}
                  </span>
                  {isExpired(ad) && <span className="chip chip-expired">⚠ Expired</span>}
                  {isExpiringSoon(ad) && !isExpired(ad) && <span className="chip chip-expiring">⏰ Expiring</span>}
                  <br />
                  {ad.shop_name && `🏪 ${ad.shop_name}`}
                  {ad.link_category && ` · 🗂 ${ad.link_category}`}
                  <br />
                  {ad.paid_until && `Until ${new Date(ad.paid_until).toLocaleDateString("en-IN")}`}
                </div>
                <div className="btns">
                  <button className={`btn-sm ${ad.active && !isExpired(ad) ? "btn-active" : "btn-pause"}`}
                    onClick={() => toggleAd(ad.id, ad.active)}>
                    {ad.active && !isExpired(ad) ? "✓ Active" : "⏸ Paused"}
                  </button>
                  <button className="btn-sm btn-renew" onClick={() => { setRenewAd(ad); setRenewDate(""); }}>
                    🔄 Renew
                  </button>
                  <button className="btn-sm btn-del" onClick={() => deleteAd(ad.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renew Modal */}
      {renewAd && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setRenewAd(null); }}>
          <div className="modal-box">
            <div className="modal-title">🔄 Renew Ad</div>
            <div className="modal-sub">Select a new expiry date for "{renewAd.title}"</div>

            {isExpired(renewAd) && (
              <div className="expired-banner">
                ⚠️ This ad expired on {new Date(renewAd.paid_until).toLocaleDateString("en-IN")}
              </div>
            )}

            <label className="lbl">New Paid Until Date</label>
            <input className="inp" type="date"
              min={new Date().toISOString().split("T")[0]}
              value={renewDate}
              onChange={e => setRenewDate(e.target.value)} />

            {/* Quick date presets */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[["1 Month", 30], ["3 Months", 90], ["6 Months", 180], ["1 Year", 365]].map(([label, days]) => (
                <button key={label} style={{ padding: "6px 12px", background: "#EBF1FF", color: "#1A6BFF", border: "1.5px solid #C5D5FF", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + Number(days));
                    setRenewDate(d.toISOString().split("T")[0]);
                  }}>
                  +{label}
                </button>
              ))}
            </div>

            <button className="btn-p" onClick={renewAdFn} disabled={!renewDate}>
              ✓ Confirm Renewal{renewDate ? ` — Until ${new Date(renewDate).toLocaleDateString("en-IN")}` : ""}
            </button>
            <button style={{ width: "100%", padding: 12, background: "none", border: "none", color: "#8A96B5", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}
              onClick={() => setRenewAd(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
