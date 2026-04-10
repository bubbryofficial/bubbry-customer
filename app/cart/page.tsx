"use client";
import { supabase } from "../../lib/supabase";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 90px; }
.top-bar {
  background: white; padding: 16px 20px; position: sticky; top: 0; z-index: 100;
  border-bottom: 1.5px solid #E4EAFF; display: flex; align-items: center; gap: 12px;
}
.back-btn {
  width: 38px; height: 38px; background: #EBF1FF; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; text-decoration: none;
  font-size: 18px; color: #1A6BFF;
}
.page-title { font-size: 18px; font-weight: 800; color: #0D1B3E; }
.content { padding: 16px; max-width: 480px; margin: 0 auto; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.card-title { font-size: 13px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; padding: 14px 16px 0; }
.cart-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #F4F6FB; }
.cart-item:last-child { border-bottom: none; }
.item-img { width: 52px; height: 52px; border-radius: 10px; background: #EBF1FF; object-fit: cover; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; overflow: hidden; }
.item-info { flex: 1; }
.item-name { font-size: 14px; font-weight: 700; color: #0D1B3E; margin-bottom: 3px; }
.item-price { font-size: 13px; color: #8A96B5; font-weight: 500; }
.qty-ctrl { display: flex; align-items: center; gap: 0; background: #EBF1FF; border-radius: 10px; overflow: hidden; }
.qty-btn { width: 30px; height: 32px; background: #1A6BFF; border: none; color: white; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.qty-btn:hover { background: #1255CC; }
.addr-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.55); z-index: 600; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(3px); }
.addr-sheet { background: white; border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; max-height: 80vh; overflow-y: auto; }
.addr-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 14px auto 14px; }
.addr-sheet-title { font-size: 16px; font-weight: 900; color: #0D1B3E; padding: 0 20px 14px; border-bottom: 1.5px solid #F4F6FB; }
.addr-option { display: flex; align-items: flex-start; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #F4F6FB; cursor: pointer; }
.addr-option.selected { background: #E6FAF4; }
.addr-opt-icon { font-size: 20px; flex-shrink: 0; }
.addr-opt-label { font-size: 10px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 3px; }
.addr-opt-text { font-size: 14px; font-weight: 700; color: #0D1B3E; line-height: 1.4; }
.add-addr-btn { display: flex; align-items: center; gap: 12px; padding: 14px 20px; color: #1A6BFF; font-size: 14px; font-weight: 800; text-decoration: none; }
.qty-num { width: 28px; text-align: center; font-size: 13px; font-weight: 800; color: #0D1B3E; }
.bill-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; font-size: 14px; color: #4A5880; font-weight: 500; border-bottom: 1px solid #F4F6FB; }
.bill-row:last-child { border-bottom: none; }
.bill-row.total { font-size: 16px; font-weight: 800; color: #0D1B3E; }
.order-type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px 16px; }
.type-option { padding: 14px; border-radius: 12px; border: 2px solid #E4EAFF; background: white; text-align: center; cursor: pointer; transition: all 0.2s; }
.type-option.selected { border-color: #1A6BFF; background: #EBF1FF; }
.type-icon { font-size: 24px; margin-bottom: 4px; }
.type-label { font-size: 13px; font-weight: 700; color: #0D1B3E; }
.type-sub { font-size: 11px; color: #8A96B5; margin-top: 2px; }
.address-input { margin: 0 16px 16px; padding: 13px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 14px; font-weight: 500; color: #0D1B3E; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; width: calc(100% - 32px); transition: all 0.2s; }
.address-input:focus { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.place-btn { position: fixed; bottom: 0; left: 0; right: 0; padding: 16px 20px; background: white; border-top: 1.5px solid #E4EAFF; }
.place-btn button { width: 100%; padding: 16px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; max-width: 480px; display: block; margin: 0 auto; }
.place-btn button:hover:not(:disabled) { background: #1255CC; box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.place-btn button:disabled { opacity: 0.6; cursor: not-allowed; }
.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 800; color: #0D1B3E; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: #8A96B5; margin-bottom: 24px; }
.shop-btn { display: inline-block; padding: 14px 28px; background: #1A6BFF; color: white; border-radius: 14px; font-size: 15px; font-weight: 800; text-decoration: none; }
`;

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [type, setType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [deliveryLat, setDeliveryLat] = useState<number|null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showAddrPicker, setShowAddrPicker] = useState(false);

  async function loadSavedLocation() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Clear stale cache if different user
        const cachedUserId = localStorage.getItem("bubbry_user_id");
        if (cachedUserId && cachedUserId !== session.user.id) {
          localStorage.removeItem("bubbry_address");
          localStorage.removeItem("bubbry_delivery_lat");
          localStorage.removeItem("bubbry_delivery_lng");
          localStorage.removeItem("bubbry_delivery_instructions");
          localStorage.removeItem("bubbry_cart");
          setAddress(""); setDeliveryLat(null); setDeliveryLng(null);
        }
        localStorage.setItem("bubbry_user_id", session.user.id);
        // Load saved addresses
        const { data: addrs } = await supabase.from("customer_addresses").select("id,label,address,lat,lng,instructions").eq("customer_id", session.user.id).order("created_at",{ascending:false});
        setSavedAddresses(addrs || []);
        const { data } = await supabase.from("profiles")
          .select("default_address,default_lat,default_lng,default_instructions")
          .eq("id", session.user.id).single();
        if (data?.default_address) {
          // Profile address is the source of truth — always pre-fill from here
          setAddress(data.default_address);
          if (data.default_lat) setDeliveryLat(data.default_lat);
          if (data.default_lng) setDeliveryLng(data.default_lng);
          // Also sync to localStorage so checkout can read it
          localStorage.setItem("bubbry_address", data.default_address);
          if (data.default_lat) localStorage.setItem("bubbry_delivery_lat", data.default_lat.toString());
          if (data.default_lng) localStorage.setItem("bubbry_delivery_lng", data.default_lng.toString());
          if (data.default_instructions) localStorage.setItem("bubbry_delivery_instructions", data.default_instructions);
          return;
        }
      }
    } catch {}
    // Fallback to localStorage if profile fetch fails
    const savedAddr = localStorage.getItem("bubbry_address");
    const savedLat = localStorage.getItem("bubbry_delivery_lat");
    const savedLng = localStorage.getItem("bubbry_delivery_lng");
    if (savedAddr) setAddress(savedAddr);
    if (savedLat) setDeliveryLat(parseFloat(savedLat));
    if (savedLng) setDeliveryLng(parseFloat(savedLng));
  }

  async function selectSavedAddress(addr: any) {
    setAddress(addr.address);
    setDeliveryLat(addr.lat);
    setDeliveryLng(addr.lng);
    localStorage.setItem("bubbry_address", addr.address);
    localStorage.setItem("bubbry_delivery_lat", addr.lat.toString());
    localStorage.setItem("bubbry_delivery_lng", addr.lng.toString());
    localStorage.setItem("bubbry_delivery_instructions", addr.instructions || "");
    setShowAddrPicker(false);
    // Update profile default to selected address
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("profiles").update({
          default_address: addr.address,
          default_lat: addr.lat,
          default_lng: addr.lng,
          default_instructions: addr.instructions || "",
        }).eq("id", session.user.id);
      }
    } catch {}
  }

  async function removeAddress(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Remove this address?")) return;
    await supabase.from("customer_addresses").delete().eq("id", id);
    setSavedAddresses(prev => prev.filter((a: any) => a.id !== id));
  }

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    if (saved) setCart(JSON.parse(saved));
    loadSavedLocation();
    // Reload when returning from map picker
    const onVisible = () => { if (document.visibilityState === "visible") loadSavedLocation(); };
    window.addEventListener("focus", loadSavedLocation);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", loadSavedLocation);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  function updateCart(id: string, delta: number) {
    let updated: any[];
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = (item.quantity ?? 1) + delta;
    if (newQty <= 0) {
      updated = cart.filter((i) => i.id !== id);
    } else if (newQty > (item.stock ?? 99)) {
      alert(`Only ${item.stock} in stock for ${item.name}`);
      return;
    } else {
      updated = cart.map((i) => i.id === id ? { ...i, quantity: newQty } : i);
    }
    setCart(updated);
    localStorage.setItem("bubbry_cart", JSON.stringify(updated));
  }

  const total = cart.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  const delivery = type === "delivery" ? (total >= 99 ? 0 : 20) : 0;

  async function findBestShop(cart: any[]) {
    // Cart items now have shop_id directly (since customer dashboard uses shop_products.id as item.id)
    // Group items by shop_id directly from cart
    const shopMap: any = {};

    for (const item of cart) {
      const shopId = item.shop_id;
      if (!shopId) continue;
      if (!shopMap[shopId]) {
        shopMap[shopId] = { shop_id: shopId, shop_name: item.shop_name ?? "Shop", items: [], total: 0 };
      }
      shopMap[shopId].items.push(item);
      shopMap[shopId].total += item.price * (item.quantity ?? 1);
    }

    // Pick shop with most items
    let best: any = null;
    Object.values(shopMap).forEach((shop: any) => {
      if (!best || shop.items.length > best.items.length) best = shop;
    });
    return best;
  }

  function goToCheckout() {
    if (type === "delivery" && (!address.trim() || !deliveryLat || !deliveryLng)) {
      alert("Please pin your delivery location on the map first. Tap Change to select or add an address.");
      return;
    }
    localStorage.setItem("bubbry_order_type", type);
    localStorage.setItem("bubbry_address", address);
    window.location.href = "/checkout";
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <a href="/customer-dashboard" className="back-btn">←</a>
        <div className="page-title">Your Cart 🛒</div>
      </div>

      <div className="content">
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">Cart is empty</div>
            <div className="empty-sub">Add products from nearby shops</div>
            <a href="/customer-dashboard" className="shop-btn">Shop Now</a>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="card">
              <div className="card-title">Items ({cart.length})</div>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-img">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "🛍️"}
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">₹{item.price} each</div>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateCart(item.id, -1)}>−</button>
                    <div className="qty-num">{item.quantity ?? 1}</div>
                    <button className="qty-btn" onClick={() => updateCart(item.id, 1)} disabled={(item.quantity??1) >= (item.stock??99)} style={{opacity:(item.quantity??1)>=(item.stock??99)?0.4:1,cursor:(item.quantity??1)>=(item.stock??99)?"not-allowed":"pointer"}}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order type */}
            <div className="card">
              <div className="card-title" style={{ paddingBottom: 10 }}>Order Type</div>
              <div className="order-type-toggle">
                <div className={`type-option ${type === "pickup" ? "selected" : ""}`} onClick={() => setType("pickup")}>
                  <div className="type-icon">🏃</div>
                  <div className="type-label">Pickup</div>
                  <div className="type-sub">Collect from shop</div>
                </div>
                <div className={`type-option ${type === "delivery" ? "selected" : ""}`} onClick={() => setType("delivery")}>
                  <div className="type-icon">🛵</div>
                  <div className="type-label">Delivery</div>
                  <div className="type-sub">{total >= 99 ? "Free delivery!" : "+₹20 delivery fee"}</div>
                </div>
              </div>
              {type === "delivery" && (
                <div style={{padding:"0 16px 12px"}}>
                  <div style={{background: address && deliveryLat ? "#E6FAF4" : "#FFF8E6", border: address && deliveryLat ? "1.5px solid #B8E8D4" : "2px dashed #FFB800", borderRadius:14, padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <span style={{fontSize:22,flexShrink:0}}>📍</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#8A96B5",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>Delivery Location</div>
                        {address && deliveryLat ? (
                          <>
                            <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E",lineHeight:1.4}}>
                              {address.includes("—") ? address.split("—")[1]?.trim() : address.split(",").slice(0,2).join(",")}
                            </div>
                            <div style={{fontSize:11,color:"#4A5880",fontWeight:500,marginTop:2}}>
                              {address.includes("—") ? address.split("—")[0]?.trim() : address.split(",").slice(2).join(",")}
                            </div>
                            <div style={{fontSize:10,color:"#B0BACC",marginTop:3}}>📌 Pinned · {deliveryLat.toFixed(4)}, {deliveryLng?.toFixed(4)}</div>
                          </>
                        ) : (
                          <div style={{fontSize:13,fontWeight:700,color:"#946200"}}>⚠️ Pin location required to order</div>
                        )}
                      </div>
                      <button onClick={() => setShowAddrPicker(true)}
                        style={{background:"#EBF1FF",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:800,color:"#1A6BFF",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                        {address && deliveryLat ? "Change" : "Add →"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill summary */}
            <div className="card">
              <div className="card-title" style={{ paddingBottom: 4 }}>Bill Summary</div>
              <div className="bill-row">
                <span>Item total</span><span>₹{total.toFixed(0)}</span>
              </div>
              {type === "delivery" && (
                <div className="bill-row">
                  <span>Delivery fee {total >= 99 ? <span style={{color:"#00B37E",fontSize:11}}>FREE above ₹99</span> : ""}</span><span style={{textDecoration: total >= 99 ? "line-through" : "none", color: total >= 99 ? "#00B37E" : "inherit"}}>₹{total >= 99 ? 0 : 20}</span>
                </div>
              )}
              <div className="bill-row total">
                <span>Total</span><span>₹{(total + delivery).toFixed(0)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Address Picker Modal */}
      {showAddrPicker && (
        <div className="addr-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddrPicker(false); }}>
          <div className="addr-sheet">
            <div className="addr-handle" />
            <div className="addr-sheet-title">📍 Choose Delivery Address</div>
            {savedAddresses.map((addr: any) => (
              <div key={addr.id} className={`addr-option ${address === addr.address ? "selected" : ""}`}
                onClick={() => selectSavedAddress(addr)}>
                <div className="addr-opt-icon">{addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : "📍"}</div>
                <div style={{flex:1}}>
                  <div className="addr-opt-label">{addr.label || "Saved"}</div>
                  <div className="addr-opt-text">{addr.instructions || addr.address.split(",").slice(0,2).join(",")}</div>
                  <div className="addr-opt-instr" style={{fontSize:11,color:"#8A96B5"}}>{addr.address.split(",").slice(2).join(",")}</div>
                </div>
                {address === addr.address && <span style={{color:"#00B37E",fontSize:16,fontWeight:900}}>✓</span>}
              </div>
            ))}
            <div className={`addr-option ${deliveryLat && address ? "selected" : ""}`}
              onClick={() => setShowAddrPicker(false)}>
              <div className="addr-opt-icon">⭐</div>
              <div style={{flex:1}}>
                <div className="addr-opt-label">Current / Default</div>
                <div className="addr-opt-text" style={{fontSize:13}}>{address || "Not set yet"}</div>
              </div>
              {deliveryLat && address && <span style={{color:"#00B37E",fontSize:16,fontWeight:900}}>✓</span>}
            </div>
            <a href="/select-location" className="add-addr-btn" onClick={() => setShowAddrPicker(false)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",color:"#1A6BFF",fontSize:14,fontWeight:800,textDecoration:"none",borderTop:"1.5px solid #F4F6FB"}}>
              <span style={{width:32,height:32,background:"#EBF1FF",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>+</span>
              Pin a new location on map
            </a>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="place-btn">
          <button onClick={goToCheckout}>
            {`Proceed to Pay • ₹${(total + delivery).toFixed(0)}`}
          </button>
        </div>
      )}
    </div>
  );
}
