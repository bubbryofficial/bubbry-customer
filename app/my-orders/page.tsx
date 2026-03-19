"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }
.top-bar {
  background: white; padding: 16px 20px; position: sticky; top: 0; z-index: 100;
  border-bottom: 1.5px solid #E4EAFF; display: flex; align-items: center; gap: 12px;
}
.back-btn { width: 38px; height: 38px; background: #EBF1FF; border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: #1A6BFF; }
.page-title { font-size: 18px; font-weight: 800; color: #0D1B3E; }
.content { padding: 16px; max-width: 480px; margin: 0 auto; }
.order-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; margin-bottom: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(26,107,255,0.06); }
.order-header { padding: 14px 16px; border-bottom: 1px solid #F4F6FB; display: flex; align-items: center; justify-content: space-between; }
.order-id { font-size: 12px; color: #8A96B5; font-weight: 600; font-family: monospace; }
.order-date { font-size: 12px; color: #8A96B5; font-weight: 500; }
.order-body { padding: 14px 16px; }
.order-product { font-size: 16px; font-weight: 800; color: #0D1B3E; margin-bottom: 4px; }
.order-meta { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
.order-meta-item { font-size: 13px; color: #4A5880; font-weight: 500; }

/* STATUS TRACKER */
.status-track { margin-top: 4px; }
.track-steps { display: flex; align-items: center; }
.track-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.track-step:not(:last-child)::after {
  content: ''; position: absolute; top: 14px; left: 50%; width: 100%; height: 2px;
  background: #E4EAFF; z-index: 0;
}
.track-step.done:not(:last-child)::after { background: #1A6BFF; }
.track-dot {
  width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid #E4EAFF;
  background: white; display: flex; align-items: center; justify-content: center;
  font-size: 13px; z-index: 1; position: relative;
}
.track-dot.done { border-color: #1A6BFF; background: #1A6BFF; }
.track-dot.current { border-color: #1A6BFF; background: white; box-shadow: 0 0 0 4px rgba(26,107,255,0.15); animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(26,107,255,0.15); } 50% { box-shadow: 0 0 0 8px rgba(26,107,255,0.05); } }
.track-label { font-size: 10px; font-weight: 700; color: #B0BACC; margin-top: 6px; text-align: center; letter-spacing: 0.3px; }
.track-label.done { color: #1A6BFF; }
.track-label.current { color: #1A6BFF; }

.status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.s-pending { background: #FFF8E6; color: #946200; }
.s-ready { background: #E6FAF4; color: #00875A; }
.s-completed { background: #F0F2F8; color: #4A5880; }
.s-cancelled { background: #FFEAEA; color: #C0392B; }

.order-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; background: #EBF1FF; color: #1A6BFF; border-radius: 20px; font-size: 12px; font-weight: 700; }
.delivery-addr { font-size: 13px; color: #4A5880; font-weight: 500; margin-top: 6px; padding: 10px 12px; background: #F4F6FB; border-radius: 10px; }

.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 800; color: #0D1B3E; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: #8A96B5; margin-bottom: 24px; }
.shop-btn { display: inline-block; padding: 14px 28px; background: #1A6BFF; color: white; border-radius: 14px; font-size: 15px; font-weight: 800; text-decoration: none; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

const STATUS_STEPS = ["pending", "ready", "completed"];
const STEP_LABELS = ["Placed", "Ready", "Done"];
const STEP_ICONS = ["✓", "⭐", "✓"];

function StatusTracker({ status }: { status: string }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div className="status-track">
      <div className="track-steps">
        {STATUS_STEPS.map((s, i) => (
          <div key={s} className={`track-step ${i <= idx ? "done" : ""}`}>
            <div className={`track-dot ${i < idx ? "done" : i === idx ? "current" : ""}`}>
              {i < idx ? "✓" : i === idx ? STEP_ICONS[i] : ""}
            </div>
            <div className={`track-label ${i < idx ? "done" : i === idx ? "current" : ""}`}>
              {STEP_LABELS[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function statusPillClass(status: string) {
  if (status === "pending") return "s-pending";
  if (status === "ready") return "s-ready";
  if (status === "completed") return "s-completed";
  return "s-cancelled";
}

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch orders
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("id, quantity, order_type, delivery_address, status, created_at, product_id, shop_id")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) { console.log(error); setLoading(false); return; }
    if (!ordersData || ordersData.length === 0) { setOrders([]); setLoading(false); return; }

    // Fetch product names/prices from shop_products
    const productIds = [...new Set(ordersData.map((o: any) => o.product_id).filter(Boolean))];
    const { data: spData } = productIds.length > 0
      ? await supabase.from("shop_products").select("id, product_id, shop_id, name, price").in("product_id", productIds)
      : { data: [] };

    // Build a map: product_id + shop_id -> shop_products row
    const spMap: any = {};
    (spData || []).forEach((sp: any) => {
      spMap[sp.product_id + "_" + sp.shop_id] = sp;
    });

    // Attach product info to each order
    const enriched = ordersData.map((order: any) => {
      const sp = spMap[order.product_id + "_" + order.shop_id] || {};
      return {
        ...order,
        product_name: sp.name ?? "Product",
        product_price: sp.price ?? 0,
      };
    });

    setOrders(enriched);
    setLoading(false);
  }

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <a href="/customer-dashboard" className="back-btn">←</a>
        <div className="page-title">My Orders 📦</div>
      </div>

      <div className="content">
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#8A96B5", fontWeight: 600 }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-sub">Your order history will appear here</div>
            <a href="/customer-dashboard" className="shop-btn">Start Shopping</a>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">#{order.id.slice(0, 8).toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`status-pill ${statusPillClass(order.status ?? "pending")}`}>
                    {(order.status ?? "pending").charAt(0).toUpperCase() + (order.status ?? "pending").slice(1)}
                  </span>
                </div>
              </div>
              <div className="order-body">
                <div className="order-product">{order.product_name ?? "Product"}</div>
                <div className="order-meta">
                  <span className="order-meta-item">Qty: {order.quantity}</span>
                  <span className="order-meta-item">·</span>
                  <span className="order-meta-item">₹{(order.product_price ?? 0) * order.quantity}</span>
                  <span className="order-type-badge">
                    {order.order_type === "delivery" ? "🛵" : "🏃"} {order.order_type}
                  </span>
                </div>

                {order.order_type === "delivery" && order.delivery_address && (
                  <div className="delivery-addr">📍 {order.delivery_address}</div>
                )}

                <StatusTracker status={order.status ?? "pending"} />
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/customer-dashboard" className="nav-item"><div className="nav-icon">🏠</div>Home</a>
        <a href="/cart" className="nav-item"><div className="nav-icon">🛒</div>Cart</a>
        <a href="/my-orders" className="nav-item active"><div className="nav-icon">📦</div>Orders</a>
      </nav>
    </div>
  );
}
