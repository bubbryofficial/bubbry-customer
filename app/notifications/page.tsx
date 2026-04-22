"use client";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.top-bar { background: #1A6BFF; padding: 14px 16px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.page-title { font-size: 17px; font-weight: 900; color: white; flex: 1; }
.clear-btn { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8); background: none; border: none; cursor: pointer; padding: 6px 10px; }
.page { padding: 12px 16px 100px; max-width: 480px; margin: 0 auto; }
.notif-card { background: white; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; border: 1.5px solid #E4EAFF; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; transition: all 0.15s; }
.notif-card.unread { border-color: #1A6BFF; background: #F0F5FF; }
.notif-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,107,255,0.1); }
.notif-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.icon-order { background: #EBF1FF; }
.icon-delivery { background: #FFF8E6; }
.icon-promo { background: #F0FBF7; }
.icon-alert { background: #FFF0F0; }
.notif-body { flex: 1; min-width: 0; }
.notif-title { font-size: 14px; font-weight: 800; color: #0D1B3E; margin-bottom: 3px; }
.notif-text { font-size: 12px; color: #8A96B5; font-weight: 500; line-height: 1.5; }
.notif-time { font-size: 10px; color: #B0BACC; font-weight: 600; margin-top: 4px; }
.unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #1A6BFF; flex-shrink: 0; margin-top: 4px; }
.empty { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-title { font-size: 18px; font-weight: 800; color: #0D1B3E; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: #8A96B5; }
.filter-row { display: flex; gap: 8px; margin-bottom: 14px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
.filter-chip { flex-shrink: 0; padding: 6px 14px; border-radius: 20px; border: 1.5px solid #E4EAFF; background: white; font-size: 12px; font-weight: 700; color: #8A96B5; cursor: pointer; font-family: inherit; }
.filter-chip.active { background: #0D1B3E; color: white; border-color: #0D1B3E; }
.badge { display: inline-flex; align-items: center; justify-content: center; background: #E53E3E; color: white; font-size: 10px; font-weight: 900; border-radius: 10px; padding: 1px 6px; margin-left: 6px; }
`;

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

const TYPE_ICONS: any = {
  order_placed: { icon: "🛒", cls: "icon-order" },
  order_ready: { icon: "⭐", cls: "icon-order" },
  out_for_delivery: { icon: "🛵", cls: "icon-delivery" },
  order_delivered: { icon: "✅", cls: "icon-delivery" },
  order_cancelled: { icon: "✕", cls: "icon-alert" },
  promo: { icon: "🎁", cls: "icon-promo" },
  refund: { icon: "💸", cls: "icon-promo" },
  fraud_alert: { icon: "🚨", cls: "icon-alert" },
  default: { icon: "🔔", cls: "icon-order" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
    // Realtime: new notifications
    const ch = supabase.channel("customer-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (p: any) => {
        setNotifs(prev => [p.new, ...prev]);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function loadNotifs() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { router.replace("/login"); return; }
    const { data } = await supabase.from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifs(data || []);
    setLoading(false);
    // Mark all as read
    await supabase.from("notifications").update({ read: true })
      .eq("user_id", session.user.id).eq("read", false);
  }

  async function clearAll() {
    if (!confirm("Clear all notifications?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("notifications").delete().eq("user_id", session.user.id);
      setNotifs([]);
    }
  }

  function handleClick(n: any) {
    if (n.link) router.push(n.link);
  }

  const filtered = filter === "all" ? notifs
    : filter === "orders" ? notifs.filter(n => ["order_placed","order_ready","out_for_delivery","order_delivered","order_cancelled"].includes(n.type))
    : filter === "promo" ? notifs.filter(n => ["promo","refund"].includes(n.type))
    : notifs.filter(n => n.type === "fraud_alert");

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <button className="back-btn" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/customer-dashboard"); }}>←</button>
        <div className="page-title">
          🔔 Notifications
          {notifs.filter(n => !n.read).length > 0 && <span className="badge">{notifs.filter(n => !n.read).length}</span>}
        </div>
        {notifs.length > 0 && <button className="clear-btn" onClick={clearAll}>Clear all</button>}
      </div>

      <div className="page">
        <div className="filter-row">
          {[["all","All"],["orders","Orders"],["promo","Promos"],["alerts","Alerts"]].map(([v,l]) => (
            <button key={v} className={`filter-chip ${filter===v?"active":""}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#8A96B5" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔔</div>
            <div className="empty-title">No notifications yet</div>
            <div className="empty-sub">We'll notify you about your orders, offers and more</div>
          </div>
        ) : filtered.map((n: any) => {
          const { icon, cls } = TYPE_ICONS[n.type] || TYPE_ICONS.default;
          return (
            <div key={n.id} className={`notif-card ${!n.read ? "unread" : ""}`} onClick={() => handleClick(n)}>
              <div className={`notif-icon ${cls}`}>{icon}</div>
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                <div className="notif-text">{n.body}</div>
                <div className="notif-time">{timeAgo(n.created_at)}</div>
              </div>
              {!n.read && <div className="unread-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
