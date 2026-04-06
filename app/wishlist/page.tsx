"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.top-bar { background: #1A6BFF; padding: 14px 16px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.page-title { font-size: 17px; font-weight: 900; color: white; flex: 1; }
.page { padding: 12px 16px 100px; }
.tab-row { display: flex; background: white; border-radius: 14px; padding: 4px; margin-bottom: 14px; border: 1.5px solid #E4EAFF; }
.tab { flex: 1; padding: 10px; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; background: none; color: #8A96B5; transition: all 0.2s; }
.tab.active { background: #1A6BFF; color: white; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.product-card { background: white; border-radius: 14px; overflow: hidden; border: 1.5px solid #E4EAFF; position: relative; }
.product-img { width: 100%; height: 130px; object-fit: cover; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 40px; }
.product-info { padding: 10px 12px 12px; }
.product-name { font-size: 13px; font-weight: 800; color: #0D1B3E; margin-bottom: 2px; line-height: 1.3; }
.product-size { font-size: 11px; color: #8A96B5; font-weight: 500; margin-bottom: 6px; }
.product-price { font-size: 15px; font-weight: 900; color: #1A6BFF; }
.product-shop { font-size: 11px; color: #8A96B5; font-weight: 600; margin-top: 3px; }
.remove-btn { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; background: rgba(255,255,255,0.9); border-radius: 50%; border: none; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.add-cart-btn { width: 100%; padding: 9px; background: #1A6BFF; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: inherit; margin-top: 8px; }
.shop-card { background: white; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; border: 1.5px solid #E4EAFF; display: flex; align-items: center; gap: 12px; }
.shop-img { width: 52px; height: 52px; border-radius: 12px; object-fit: cover; background: #EBF1FF; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.shop-name { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.shop-meta { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.shop-live { display: inline-block; background: #E6FAF4; color: #00875A; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-top: 4px; }
.shop-offline { display: inline-block; background: #F4F6FB; color: #8A96B5; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-top: 4px; }
.unbook-btn { margin-left: auto; padding: 7px 12px; background: #FFF0F0; border: 1.5px solid #FFCDD2; border-radius: 8px; font-size: 12px; font-weight: 700; color: #E53E3E; cursor: pointer; font-family: inherit; flex-shrink: 0; }
.empty { text-align: center; padding: 60px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: #8A96B5; line-height: 1.5; }
.go-shop-btn { display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1A6BFF; color: white; border-radius: 12px; font-size: 14px; font-weight: 800; text-decoration: none; }
`;

export default function WishlistPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"products"|"shops">("products");
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopSelectorItem, setShopSelectorItem] = useState<any>(null);
  const [cartShopId, setCartShopId] = useState<string>("");
  const [userLat, setUserLat] = useState<number|null>(null);
  const [userLng, setUserLng] = useState<number|null>(null);

  // Haversine distance in km
  function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  useEffect(() => {
    // Get user location first, then load data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          loadData(pos.coords.latitude, pos.coords.longitude);
        },
        () => loadData(null, null) // no location — still load, just skip distance filter
      );
    } else {
      loadData(null, null);
    }
    const cart = JSON.parse(localStorage.getItem("bubbry_cart") || "[]");
    if (cart.length > 0 && cart[0].shop_id) setCartShopId(cart[0].shop_id);
  }, []);

  async function loadData(lat: number|null, lng: number|null) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { router.replace("/login"); return; }
    const uid = session.user.id;

    // Load wishlist — get IDs first, then enrich
    const { data: wRaw } = await supabase.from("wishlists")
      .select("id, product_id, shop_id, added_at")
      .eq("customer_id", uid)
      .order("added_at", { ascending: false });

    if (wRaw && wRaw.length > 0) {
      const productIds = [...new Set(wRaw.map((w:any) => w.product_id))];
      const shopIds = [...new Set(wRaw.map((w:any) => w.shop_id))];
      const [mpRes, spRes, shopRes] = await Promise.all([
        supabase.from("master_products").select("id, name, size, image_url, category").in("id", productIds),
        supabase.from("shop_products").select("product_id, shop_id, price, stock, name").in("product_id", productIds).in("shop_id", shopIds),
        supabase.from("profiles").select("id, shop_name, name, is_live").in("id", shopIds),
      ]);
      const mpMap: any = {}; (mpRes.data||[]).forEach((m:any) => { mpMap[m.id] = m; });
      const spKey = (pid:string, sid:string) => pid+"_"+sid;
      const spMap: any = {}; (spRes.data||[]).forEach((s:any) => { spMap[spKey(s.product_id, s.shop_id)] = s; });
      const shopMap: any = {}; (shopRes.data||[]).forEach((s:any) => { shopMap[s.id] = s; });

      // Get shops for ALL products — only LIVE shops with location data
      const allSpRes = await supabase.from("shop_products")
        .select("product_id, shop_id, price, stock, name")
        .in("product_id", productIds)
        .gt("stock", 0); // only in-stock options

      const allShopIds = [...new Set((allSpRes.data||[]).map((s:any)=>s.shop_id))];
      const { data: allShopsData } = await supabase.from("profiles")
        .select("id, shop_name, name, is_live, latitude, longitude")
        .in("id", allShopIds)
        .eq("is_live", true); // only live shops

      const MAX_KM = 2;
      const allShopsMap: any = {};
      (allShopsData||[]).forEach((s:any) => {
        // If user location available, only include shops within 2km
        if (lat && lng && s.latitude && s.longitude) {
          const dist = haversine(lat, lng, s.latitude, s.longitude);
          if (dist > MAX_KM) return; // skip shops too far
          s._dist = dist;
        } else {
          s._dist = 0;
        }
        allShopsMap[s.id] = s;
      });

      const allSpByProduct: any = {};
      (allSpRes.data || []).forEach((sp: any) => {
        if (!allShopsMap[sp.shop_id]) return; // skip non-live or out-of-range shops
        if (!allSpByProduct[sp.product_id]) allSpByProduct[sp.product_id] = [];
        allSpByProduct[sp.product_id].push(sp);
      });

      setWishlist(wRaw.map((w:any) => ({
        ...w,
        master_products: mpMap[w.product_id] || null,
        shop_products: spMap[spKey(w.product_id, w.shop_id)] || null,
        profiles: shopMap[w.shop_id] || null,
        allShopOptions: (allSpByProduct[w.product_id] || [])
          .map((sp:any) => ({
            ...sp,
            shop_name: allShopsMap[sp.shop_id]?.shop_name || allShopsMap[sp.shop_id]?.name || "Shop",
            dist: allShopsMap[sp.shop_id]?._dist ?? 0,
          }))
          .sort((a:any, b:any) => a.dist - b.dist), // nearest first
      })));
    } else {
      setWishlist([]);
    }

    // Load bookmarked shops — get IDs then profile data
    const { data: bRaw } = await supabase.from("shop_bookmarks")
      .select("id, shop_id, added_at")
      .eq("customer_id", uid)
      .order("added_at", { ascending: false });

    if (bRaw && bRaw.length > 0) {
      const bShopIds = bRaw.map((b:any) => b.shop_id);
      const { data: bShops } = await supabase.from("profiles")
        .select("id, shop_name, name, shopfront_image, is_live, offers_delivery")
        .in("id", bShopIds);
      const bShopMap: any = {}; (bShops||[]).forEach((s:any) => { bShopMap[s.id] = s; });
      setBookmarks(bRaw.map((b:any) => ({ ...b, profiles: bShopMap[b.shop_id] || null })));
    } else {
      setBookmarks([]);
    }
    setLoading(false);
  }

  async function removeWishlist(id: string) {
    await supabase.from("wishlists").delete().eq("id", id);
    setWishlist(prev => prev.filter(w => w.id !== id));
  }

  async function removeBookmark(id: string) {
    await supabase.from("shop_bookmarks").delete().eq("id", id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }

  function addToCartFromShop(item: any, shopOpt: any) {
    const mp = item.master_products;
    const cartItem = {
      id: shopOpt.id || item.id,
      product_id: item.product_id,
      shop_id: shopOpt.shop_id,
      name: shopOpt.name || mp?.name || "Product",
      price: shopOpt.price || 0,
      quantity: 1,
      image_url: mp?.image_url || "",
      shop_name: shopOpt.shop_name || "Shop",
    };
    const existing = JSON.parse(localStorage.getItem("bubbry_cart") || "[]");
    if (existing.length > 0 && existing[0].shop_id !== cartItem.shop_id) {
      if (!confirm("Your cart has items from another shop. Clear cart and add this?")) return;
      localStorage.setItem("bubbry_cart", JSON.stringify([cartItem]));
      setCartShopId(cartItem.shop_id);
    } else {
      const found = existing.find((c: any) => c.product_id === cartItem.product_id && c.shop_id === cartItem.shop_id);
      if (found) found.quantity++;
      else existing.push(cartItem);
      localStorage.setItem("bubbry_cart", JSON.stringify(existing));
      setCartShopId(cartItem.shop_id);
    }
    setShopSelectorItem(null);
    alert("✓ Added to cart!");
  }

  function handleAddToCart(item: any) {
    const inStockOptions = (item.allShopOptions || []).filter((s:any) => (s.stock??0) > 0);
    if (inStockOptions.length === 0) { alert("This product is out of stock at all shops."); return; }
    if (inStockOptions.length === 1) {
      addToCartFromShop(item, inStockOptions[0]);
    } else {
      // Multiple shops — show selector
      setShopSelectorItem(item);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <div className="page-title">❤️ Wishlist & Bookmarks</div>
      </div>

      <div className="page">
        <div className="tab-row">
          <button className={`tab ${tab==="products"?"active":""}`} onClick={() => setTab("products")}>
            ❤️ Wishlist ({wishlist.length})
          </button>
          <button className={`tab ${tab==="shops"?"active":""}`} onClick={() => setTab("shops")}>
            🔖 Shops ({bookmarks.length})
          </button>
        </div>

        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#8A96B5" }}>Loading...</div>

        : tab === "products" ? (
          wishlist.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">❤️</div>
              <div className="empty-title">No wishlist items yet</div>
              <div className="empty-sub">Tap the ❤️ on any product to save it for later</div>
              <a href="/customer-dashboard" className="go-shop-btn">Browse Products →</a>
            </div>
          ) : (
            <div className="product-grid">
              {wishlist.map((item: any) => {
                const mp = item.master_products;
                const sp = item.shop_products;
                const shop = item.profiles;
                return (
                  <div key={item.id} className="product-card">
                    <button className="remove-btn" onClick={() => removeWishlist(item.id)}>✕</button>
                    {mp?.image_url
                      ? <img src={mp.image_url} className="product-img" alt={mp.name} style={{height:130}} />
                      : <div className="product-img">📦</div>}
                    <div className="product-info">
                      <div className="product-name">{sp?.name || mp?.name}</div>
                      <div className="product-size">{mp?.size}</div>
                      <div className="product-price">₹{sp?.price || "—"}</div>
                      <div className="product-shop">🏪 {shop?.shop_name || shop?.name}</div>
                      {sp?.stock > 0 ? (
                        <button className="add-cart-btn" onClick={() => handleAddToCart(item)} style={{background: (item.shop_products?.stock??0)===0&&(item.allShopOptions||[]).some((s:any)=>(s.stock??0)>0)?"#8A96B5":"#1A6BFF"}}>+ Add to Cart</button>
                      ) : (
                        <div style={{ fontSize: 11, color: "#E53E3E", fontWeight: 700, marginTop: 6 }}>Out of stock</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          bookmarks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔖</div>
              <div className="empty-title">No bookmarked shops</div>
              <div className="empty-sub">Tap the 🔖 on any shop to save it here</div>
              <a href="/customer-dashboard" className="go-shop-btn">Browse Shops →</a>
            </div>
          ) : (
            <div>
              {bookmarks.map((item: any) => {
                const shop = item.profiles;
                return (
                  <div key={item.id} className="shop-card" onClick={() => window.location.href = `/customer-dashboard?shop=${item.shop_id}`} style={{cursor:"pointer"}}>
                    {shop?.shopfront_image
                      ? <img src={shop.shopfront_image} className="shop-img" alt={shop.shop_name} style={{width:52,height:52}} />
                      : <div className="shop-img">🏪</div>}
                    <div style={{ flex: 1 }}>
                      <div className="shop-name">{shop?.shop_name || shop?.name}</div>
                      <div className="shop-meta">{shop?.offers_delivery ? "🛵 Delivery available" : "🏃 Pickup only"}</div>
                      <span className={shop?.is_live ? "shop-live" : "shop-offline"}>
                        {shop?.is_live ? "● Live now" : "○ Offline"}
                      </span>
                    </div>
                    <button className="unbook-btn" onClick={() => removeBookmark(item.id)}>Remove</button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
      {/* Shop Selector Modal */}
      {shopSelectorItem && (
        <div style={{position:"fixed",inset:0,background:"rgba(13,27,62,0.6)",zIndex:900,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setShopSelectorItem(null);}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:"0 0 40px"}}>
            <div style={{width:40,height:4,background:"#E4EAFF",borderRadius:2,margin:"14px auto 14px"}}/>
            <div style={{padding:"0 20px 14px",borderBottom:"1.5px solid #F4F6FB"}}>
              <div style={{fontSize:16,fontWeight:900,color:"#0D1B3E"}}>🏪 Choose a Nearby Shop</div>
              <div style={{fontSize:11,color:"#8A96B5",marginTop:3}}>Only live shops near you are shown</div>
              <div style={{fontSize:12,color:"#8A96B5",marginTop:4}}>{shopSelectorItem.master_products?.name || "Product"}</div>
            </div>
            {(shopSelectorItem.allShopOptions||[]).filter((s:any)=>(s.stock??0)>0).length === 0 ? (
              <div style={{padding:"24px 20px",textAlign:"center",color:"#8A96B5"}}>
                <div style={{fontSize:32,marginBottom:8}}>🏪</div>
                <div style={{fontSize:14,fontWeight:700,color:"#0D1B3E",marginBottom:4}}>No live shops nearby</div>
                <div style={{fontSize:12}}>No live shops within 2km have this in stock right now.</div>
              </div>
            ) : (shopSelectorItem.allShopOptions||[]).filter((s:any)=>(s.stock??0)>0).map((opt:any) => (
              <div key={opt.shop_id} onClick={() => addToCartFromShop(shopSelectorItem, opt)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:"1px solid #F4F6FB",cursor:"pointer"}}>
                <div style={{width:40,height:40,background:"#EBF1FF",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏪</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E"}}>{opt.shop_name}</div>
                  <div style={{fontSize:12,color:"#8A96B5",fontWeight:500}}>₹{opt.price} · {opt.stock} in stock{opt.dist > 0 ? ` · 📍 ${opt.dist < 1 ? Math.round(opt.dist*1000)+"m" : opt.dist.toFixed(1)+"km"}` : ""}</div>
                </div>
                <div style={{fontSize:12,fontWeight:800,color:"#1A6BFF"}}>Add →</div>
              </div>
            ))}
            <button onClick={() => setShopSelectorItem(null)} style={{width:"100%",padding:"12px",background:"none",border:"none",color:"#8A96B5",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:6}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
