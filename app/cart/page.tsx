"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function updateCart(id: string, delta: number) {
    let updated: any[];
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = (item.quantity ?? 1) + delta;
    if (newQty <= 0) {
      updated = cart.filter((i) => i.id !== id);
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
    if (type === "delivery" && !address.trim()) { alert("Enter delivery address"); return; }
    // Save order type and address so checkout page can read them
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
                    <button className="qty-btn" onClick={() => updateCart(item.id, 1)}>+</button>
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
                <input
                  className="address-input"
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
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
