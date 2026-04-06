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
.s-out { background: #EBF1FF; color: #1A6BFF; }
.s-cancelled { background: #FFEAEA; color: #C0392B; }

.order-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; background: #EBF1FF; color: #1A6BFF; border-radius: 20px; font-size: 12px; font-weight: 700; }
.delivery-addr { font-size: 13px; color: #4A5880; font-weight: 500; margin-top: 6px; padding: 10px 12px; background: #F4F6FB; border-radius: 10px; }

.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 800; color: #0D1B3E; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: #8A96B5; margin-bottom: 24px; }
.track-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px; background: #EBF1FF; color: #1A6BFF; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 8px; text-decoration: none; }
.lightbox-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.93); z-index: 900; display: flex; align-items: center; justify-content: center; flex-direction: column; }
.lightbox-overlay img { max-width: 96vw; max-height: 80vh; border-radius: 12px; object-fit: contain; }
.lightbox-close-btn { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 22px; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; }
.lightbox-caption { color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 600; margin-top: 10px; }
.call-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.call-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 800; text-decoration: none; }
.call-shop { background: #EBF1FF; color: #1A6BFF; border: 1.5px solid #C5D5FF; }
.call-rider-c { background: #F0FBF7; color: #00875A; border: 1.5px solid #B8E8D4; }
.cancelled-banner { background: #FFF0F0; border: 2px solid #FFCDD2; border-radius: 14px; padding: 14px 16px; margin-top: 10px; }
.cancelled-title { font-size: 15px; font-weight: 900; color: #E53E3E; margin-bottom: 6px; }
.cancelled-text { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.6; margin-bottom: 10px; }
.refund-upi-input { width: 100%; padding: 11px 14px; border: 2px solid #E4EAFF; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; margin-bottom: 8px; box-sizing: border-box; }
.refund-upi-input:focus { border-color: #1A6BFF; }
.btn-save-upi { padding: 10px 20px; background: #1A6BFF; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; }
.fraud-alert { background: #0D1B3E; border-radius: 14px; padding: 14px 16px; margin-top: 10px; }
.fraud-alert-title { font-size: 14px; font-weight: 900; color: #FF6B6B; margin-bottom: 6px; }
.fraud-alert-text { font-size: 12px; color: rgba(255,255,255,0.75); font-weight: 500; line-height: 1.6; }
.otp-banner { background: linear-gradient(135deg, #1A6BFF, #4D8FFF); border-radius: 14px; padding: 14px 16px; margin-top: 10px; display: flex; align-items: center; gap: 12px; }
.otp-code { font-size: 28px; font-weight: 900; color: white; letter-spacing: 6px; font-family: monospace; }
.otp-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.otp-hint { font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 500; }
.track-btn-live { background: linear-gradient(135deg,#1A6BFF,#4D8FFF); color: white; animation: pulse-btn 2s infinite; }
@keyframes pulse-btn { 0%,100%{box-shadow:0 0 0 0 rgba(26,107,255,0.4)} 50%{box-shadow:0 0 0 8px rgba(26,107,255,0)} }
.shop-btn { display: inline-block; padding: 14px 28px; background: #1A6BFF; color: white; border-radius: 14px; font-size: 15px; font-weight: 800; text-decoration: none; }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: white; border-top: 1.5px solid #E4EAFF; display: flex; align-items: center; box-shadow: 0 -4px 20px rgba(26,107,255,0.07); z-index: 100; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 0; text-decoration: none; color: #B0BACC; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; transition: color 0.15s; }
.nav-item.active { color: #1A6BFF; }
.nav-icon { font-size: 22px; line-height: 1; }
`;

const STATUS_STEPS_DELIVERY = ["pending", "ready", "out_for_delivery", "completed"];
const STEP_LABELS_DELIVERY = ["Placed", "Ready", "Out for Delivery", "Delivered"];
const STEP_ICONS_DELIVERY = ["✓", "⭐", "🛵", "✓"];
const STATUS_STEPS_PICKUP = ["pending", "ready", "completed"];
const STEP_LABELS_PICKUP = ["Placed", "Ready", "Picked Up"];
const STEP_ICONS_PICKUP = ["✓", "⭐", "✓"];

function StatusTracker({ status, orderType }: { status: string; orderType?: string }) {
  const isDelivery = orderType === "delivery";
  const STEPS = isDelivery ? STATUS_STEPS_DELIVERY : STATUS_STEPS_PICKUP;
  const LABELS = isDelivery ? STEP_LABELS_DELIVERY : STEP_LABELS_PICKUP;
  const ICONS = isDelivery ? STEP_ICONS_DELIVERY : STEP_ICONS_PICKUP;
  const idx = STEPS.indexOf(status);
  return (
    <div className="status-track">
      {isDelivery && status === "out_for_delivery" && (
        <div style={{background:"#EBF1FF",borderRadius:8,padding:"6px 10px",marginBottom:10,fontSize:12,fontWeight:700,color:"#1A6BFF",display:"flex",alignItems:"center",gap:6}}>
          🛵 Your order is on the way!
        </div>
      )}
      <div className="track-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`track-step ${i <= idx ? "done" : ""}`}>
            <div className={`track-dot ${i < idx ? "done" : i === idx ? "current" : ""}`}>
              {i < idx ? "✓" : i === idx ? ICONS[i] : ""}
            </div>
            <div className={`track-label ${i < idx ? "done" : i === idx ? "current" : ""}`}>
              {LABELS[i]}
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
  if (status === "out_for_delivery") return "s-out";
  if (status === "completed") return "s-completed";
  return "s-cancelled";
}

function PostDeliveryHelp({ shopPhone, shopName }: { shopPhone: string|null; shopName: string }) {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!issue.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY || ""}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are Bubbry support. Help customers resolve delivery issues. Be concise, empathetic, and helpful. Suggest calling the shop if needed." },
            { role: "user", content: issue }
          ],
          max_tokens: 200
        })
      });
      const data = await res.json();
      setReply(data.choices?.[0]?.message?.content || "Please contact the shop directly for help.");
    } catch { setReply("Sorry, couldn't connect. Please call the shop directly."); }
    setLoading(false);
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{width:"100%",padding:"10px 14px",background:"#FFF8E6",border:"1.5px solid #FFD88A",borderRadius:10,fontSize:13,fontWeight:700,color:"#946200",cursor:"pointer",fontFamily:"inherit",marginTop:6,display:"flex",alignItems:"center",gap:8}}>
      ⚠️ Issue with this order?
    </button>
  );

  return (
    <div style={{background:"#F4F6FB",borderRadius:12,padding:14,marginTop:6,border:"1.5px solid #E4EAFF"}}>
      <div style={{fontSize:14,fontWeight:800,color:"#0D1B3E",marginBottom:8}}>⚠️ What's the issue?</div>
      <textarea rows={3} placeholder="Describe your issue — e.g. wrong item, damaged product, missing item..."
        value={issue} onChange={e => setIssue(e.target.value)}
        style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E4EAFF",borderRadius:10,fontSize:13,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box",marginBottom:8}} />
      <button onClick={askAI} disabled={loading || !issue.trim()}
        style={{width:"100%",padding:"10px 14px",background:"#1A6BFF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:8,opacity:loading?0.6:1}}>
        {loading ? "Getting help..." : "🤖 Get Help from AI"}
      </button>
      {reply && (
        <div style={{background:"white",border:"1.5px solid #E4EAFF",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#0D1B3E",lineHeight:1.6,marginBottom:8}}>
          {reply}
        </div>
      )}
      {shopPhone && (
        <a href={`tel:${shopPhone}`}
          style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#EBF1FF",border:"1.5px solid #C5D5FF",borderRadius:10,color:"#1A6BFF",fontSize:13,fontWeight:800,textDecoration:"none"}}>
          📞 Call {shopName} for Resolution
        </a>
      )}
      <button onClick={() => { setOpen(false); setIssue(""); setReply(""); }}
        style={{width:"100%",padding:"8px 0",background:"none",border:"none",color:"#8A96B5",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:6}}>
        Dismiss
      </button>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundOrderId, setRefundOrderId] = useState<string|null>(null);
  const [refundUpi, setRefundUpi] = useState("");
  const [savingUpi, setSavingUpi] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string|null>(null);

  useEffect(() => {
    let initialized = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!initialized && session?.user) {
        initialized = true;
        fetchOrders(session.user.id);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialized && session?.user) {
        initialized = true;
        fetchOrders(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Realtime: auto-refresh on any order change + fast poll
  useEffect(() => {
    const rt = supabase.channel("customer-orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) fetchOrders(session.user.id);
        });
      }).subscribe();
    // Poll every 8s — catches missed realtime events
    const poll = setInterval(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) fetchOrders(session.user.id);
      });
    }, 8000);
    return () => { supabase.removeChannel(rt); clearInterval(poll); };
  }, []);

  async function fetchOrders(userId: string) {
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("id, group_id, quantity, order_type, delivery_address, status, created_at, product_id, shop_id, delivery_otp, payment_method, amount_paid, amount_cash, cancellation_reason, cancelled_by, cancellation_proof, refund_upi, refund_screenshot, rider_id")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });

      if (error) { console.error("Orders fetch error:", error); setLoading(false); return; }
      if (!ordersData || ordersData.length === 0) { setOrders([]); setLoading(false); return; }

      // Fetch product names from shop_products
      const productIds = [...new Set(ordersData.map((o: any) => o.product_id).filter(Boolean))];
      const { data: spData } = productIds.length > 0
        ? await supabase.from("shop_products").select("id, product_id, shop_id, name, price").in("product_id", productIds)
        : { data: [] };

      // Fetch shop names
      const shopIds = [...new Set(ordersData.map((o: any) => o.shop_id).filter(Boolean))];
      const { data: shopData } = shopIds.length > 0
        ? await supabase.from("profiles").select("id, shop_name, name, phone").in("id", shopIds)
        : { data: [] };

      const spMap: any = {};
      (spData || []).forEach((sp: any) => { spMap[sp.product_id + "_" + sp.shop_id] = sp; });

      const shopMap: any = {};
      const shopPhoneMap: any = {};
      (shopData || []).forEach((s: any) => {
        shopMap[s.id] = s.shop_name || s.name || "Shop";
        shopPhoneMap[s.id] = s.phone || null;
      });

      const STATUS_ORDER = ["pending", "ready", "out_for_delivery", "completed"];

      // Group by group_id — old orders without group_id each get their own group
      const groupMap: Record<string, any> = {};
      for (const order of ordersData) {
        const key = order.group_id || order.id;
        const sp = spMap[order.product_id + "_" + order.shop_id] || {};
        const productName = sp.name || "Product";
        const productPrice = sp.price || 0;

        if (!groupMap[key]) {
          groupMap[key] = {
            group_id: key,
            id: order.id,
            shop_id: order.shop_id,
            shop_name: shopMap[order.shop_id] || "Shop",
            order_type: order.order_type,
            delivery_address: order.delivery_address,
            status: order.status || "pending",
            created_at: order.created_at,
            delivery_otp: order.delivery_otp || null,
            payment_method: order.payment_method || "upi",
            amount_paid: order.amount_paid || 0,
            amount_cash: order.amount_cash || 0,
            cancellation_reason: order.cancellation_reason || null,
            cancelled_by: order.cancelled_by || null,
            cancellation_proof: order.cancellation_proof || null,
            refund_upi: order.refund_upi || null,
            refund_screenshot: order.refund_screenshot || null,
            rider_id: order.rider_id || null,
            items: [],
            total: 0,
          };
        }

        // Add item to group
        groupMap[key].items.push({
          id: order.id,
          product_name: productName,
          quantity: order.quantity || 1,
          price: productPrice,
        });
        groupMap[key].total += productPrice * (order.quantity || 1);
        // Keep otp from any row that has it
        if (order.delivery_otp && !groupMap[key].delivery_otp) groupMap[key].delivery_otp = order.delivery_otp;

        // Use highest-progress status in the group
        const curIdx = STATUS_ORDER.indexOf(groupMap[key].status);
        const newIdx = STATUS_ORDER.indexOf(order.status);
        if (newIdx > curIdx) groupMap[key].status = order.status;
      }

      // Fetch rider phones
      const riderIds2 = [...new Set(Object.values(groupMap).map((g:any) => g.rider_id).filter(Boolean))];
      const { data: riderPhones } = riderIds2.length > 0
        ? await supabase.from("riders").select("id, name, phone").in("id", riderIds2)
        : { data: [] };
      const riderPhoneMap: any = {};
      (riderPhones || []).forEach((r: any) => { riderPhoneMap[r.id] = { phone: r.phone, name: r.name }; });

      // Sort groups by most recent order
      const grouped = Object.values(groupMap).map((g:any) => ({
        ...g,
        shop_phone: shopPhoneMap[g.shop_id] || null,
        rider_phone: g.rider_id ? riderPhoneMap[g.rider_id]?.phone || null : null,
        rider_name: g.rider_id ? riderPhoneMap[g.rider_id]?.name || null : null,
      })).sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(grouped);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
    setLoading(false);
  }

  async function saveRefundUpi(groupId: string) {
    if (!refundUpi.trim()) { alert("Enter your UPI ID"); return; }
    setSavingUpi(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const group = orders.find((g: any) => g.group_id === groupId);
      const ids = group?.all_ids || [group?.id];
      for (const id of ids) {
        await supabase.from("orders").update({ refund_upi: refundUpi.trim() }).eq("id", id);
      }
      alert("UPI saved. The shopkeeper will send refund to: " + refundUpi);
      setRefundOrderId(null); setRefundUpi("");
      fetchOrders(session.user.id);
    }
    setSavingUpi(false);
  }

  return (
    <>
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
          orders.map((group: any) => (
            <div key={group.group_id} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">#{group.id.slice(0, 8).toUpperCase()}</div>
                  <div style={{fontSize:12,color:"#8A96B5",fontWeight:600,marginTop:2}}>🏪 {group.shop_name}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <span className={`status-pill ${statusPillClass(group.status ?? "pending")}`}>
                    {group.status === "out_for_delivery" ? "🛵 Out for Delivery" : (group.status ?? "pending").charAt(0).toUpperCase() + (group.status ?? "pending").slice(1)}
                  </span>
                  <span className="order-type-badge" style={{fontSize:11}}>
                    {group.order_type === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}
                  </span>
                </div>
              </div>
              <div className="order-body">
                {group.items.map((item: any, idx: number) => (
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:idx < group.items.length-1?"1px solid #F4F6FB":"none"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:"#0D1B3E"}}>{item.product_name}</div>
                      <div style={{fontSize:12,color:"#8A96B5",fontWeight:500}}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{fontSize:14,fontWeight:800,color:"#1A6BFF"}}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,marginTop:4,borderTop:"1.5px solid #E4EAFF",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#4A5880"}}>{group.items.length} item{group.items.length!==1?"s":""}</span>
                  <span style={{fontSize:15,fontWeight:900,color:"#0D1B3E"}}>₹{group.total}</span>
                </div>
                {group.order_type === "delivery" && group.delivery_address && (
                  <div className="delivery-addr">📍 {group.delivery_address}</div>
                )}
                {/* Call Buttons — only on active orders */}
                {group.status !== "completed" && group.status !== "cancelled" &&
                 (group.shop_phone || (group.status === "out_for_delivery" && group.rider_phone)) && (
                  <div className="call-row">
                    {group.shop_phone && (
                      <a href={`tel:${group.shop_phone}`} className="call-btn call-shop">
                        📞 Call Shop
                      </a>
                    )}
                    {group.status === "out_for_delivery" && group.rider_phone && (
                      <a href={`tel:${group.rider_phone}`} className="call-btn call-rider-c">
                        🛵 Call Rider
                        {group.rider_name && <span style={{fontWeight:500,fontSize:11,marginLeft:2}}>({group.rider_name})</span>}
                      </a>
                    )}
                  </div>
                )}
                <StatusTracker status={group.status ?? "pending"} orderType={group.order_type} />
                {/* Post-delivery issue reporting */}
                {group.status === "completed" && (
                  <PostDeliveryHelp shopPhone={group.shop_phone} shopName={group.shop_name} />
                )}
                {/* Cancelled Order */}
                {group.status === "cancelled" && (
                  <div>
                    {group.cancellation_reason === "fraud" ? (
                      <div className="fraud-alert">
                        <div className="fraud-alert-title">🚨 Order Cancelled — Fraud Reported</div>
                        <div className="fraud-alert-text">
                          The shopkeeper has reported a fraud concern with your payment. Bubbry team is investigating.<br/><br/>
                          <strong style={{color:"#FF6B6B"}}>Policy:</strong> If you are found guilty, you must pay double the order amount (₹{(group.amount_paid + group.amount_cash) * 2}) to the shopkeeper.<br/>
                          Repeated fraud may result in account suspension and police involvement.<br/><br/>
                          Our team will contact you within 24 hours.
                        </div>
                        {group.cancellation_proof && (
                          <button onClick={() => setLightboxImg(group.cancellation_proof)}
                            style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"white",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:6}}>
                            📸 View Shopkeeper Evidence
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="cancelled-banner">
                        <div className="cancelled-title">
                          {group.cancelled_by === "shop" ? "🏪 Order Cancelled by Shop" : "✕ Order Cancelled"}
                        </div>
                        <div className="cancelled-text">
                          {group.cancellation_reason === "unavailable"
                            ? "The shopkeeper cancelled because the product is unavailable. You are eligible for a full refund."
                            : "The shopkeeper cancelled this order. You are eligible for a full refund."}
                          <br/>Amount to be refunded: <strong>₹{group.amount_paid}</strong>{group.amount_cash > 0 ? <span style={{fontSize:11,color:"#8A96B5"}}> (cash of ₹{group.amount_cash} was not charged)</span> : ""}
                        </div>
                        {group.refund_screenshot ? (
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"#00875A",marginBottom:6}}>✅ Shopkeeper sent refund proof</div>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                              <button onClick={() => setLightboxImg(group.refund_screenshot)}
                                style={{background:"#E6FAF4",border:"1.5px solid #B8E8D4",color:"#00875A",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                                📸 View Refund Screenshot
                              </button>
                              {group.shop_phone && (
                                <a href={`tel:${group.shop_phone}`}
                                  style={{background:"#FFF0F0",border:"1.5px solid #FFCDD2",color:"#E53E3E",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4}}>
                                  📞 Not received? Call Shop
                                </a>
                              )}
                            </div>
                          </div>
                        ) : group.refund_upi ? (
                          <div style={{fontSize:12,fontWeight:700,color:"#1A6BFF"}}>
                            ✓ Your UPI saved: {group.refund_upi}<br/>
                            <span style={{color:"#8A96B5",fontWeight:500}}>Waiting for shopkeeper to send refund...</span>
                          </div>
                        ) : (
                          <div>
                            <div style={{fontSize:12,fontWeight:800,color:"#0D1B3E",marginBottom:6}}>Enter your UPI ID to receive refund:</div>
                            <input className="refund-upi-input" placeholder="yourname@paytm / 9876543210@upi"
                              value={refundOrderId === group.group_id ? refundUpi : ""}
                              onChange={e => { setRefundOrderId(group.group_id); setRefundUpi(e.target.value); }}/>
                            <button className="btn-save-upi" disabled={savingUpi}
                              onClick={() => saveRefundUpi(group.group_id)}>
                              {savingUpi ? "Saving..." : "Save UPI →"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery OTP */}
                {group.status === "out_for_delivery" && group.order_type === "delivery" && group.delivery_otp && (
                  <div className="otp-banner">
                    <div style={{flex:1}}>
                      <div className="otp-label">🔐 Delivery OTP — Share with rider</div>
                      <div className="otp-code">{group.delivery_otp}</div>
                      <div className="otp-hint">The rider needs this code before marking delivered</div>
                    </div>
                    <button onClick={() => { navigator.clipboard?.writeText(group.delivery_otp); alert("OTP copied!"); }}
                      style={{background:"rgba(255,255,255,0.25)",border:"none",color:"white",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                      Copy
                    </button>
                  </div>
                )}
                {/* Pickup OTP — show when order is ready for pickup */}
                {group.order_type !== "delivery" && group.status === "ready" && group.delivery_otp && (
                  <div className="otp-banner" style={{background:"linear-gradient(135deg,#00875A,#00B37E)"}}>
                    <div style={{flex:1}}>
                      <div className="otp-label">🏪 Pickup OTP — Show to shopkeeper</div>
                      <div className="otp-code">{group.delivery_otp}</div>
                      <div className="otp-hint">Show this to the shopkeeper when collecting your order</div>
                    </div>
                    <button onClick={() => { navigator.clipboard?.writeText(group.delivery_otp); alert("OTP copied!"); }}
                      style={{background:"rgba(255,255,255,0.25)",border:"none",color:"white",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                      Copy
                    </button>
                  </div>
                )}
                {/* Track buttons */}
                {group.status === "out_for_delivery" && group.order_type === "delivery" && (
                  <a href={`/track?order=${group.id}&role=customer`} className="track-btn track-btn-live">
                    🛵 Track Live Delivery →
                  </a>
                )}
                {group.order_type !== "delivery" && group.status === "ready" && (
                  <a href={`/track?order=${group.id}&role=customer&type=pickup`} className="track-btn" style={{background:"#00B37E",color:"white"}}>
                    🏃 Navigate to Shop →
                  </a>
                )}
                {(group.status === "pending" || (group.status === "ready" && group.order_type === "delivery")) && (
                  <a href={`/track?order=${group.id}&role=customer`} className="track-btn">
                    📍 Track Order on Map
                  </a>
                )}
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

      {/* Photo Lightbox */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close-btn" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Delivery proof" onClick={e => e.stopPropagation()} />
          <div className="lightbox-caption">Tap anywhere to close</div>
        </div>
      )}
    </div>
    </>
  );
}
