"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();
  const [count, setCount] = useState(5);
  useEffect(() => {
    const iv = setInterval(() => setCount(c => { if (c <= 1) { clearInterval(iv); router.push("/my-orders"); return 0; } return c - 1; }), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #EBF1FF 0%, #F4F6FB 60%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 24, padding: 40, textAlign: "center", boxShadow: "0 8px 40px rgba(26,107,255,0.12)", border: "1.5px solid #E4EAFF", maxWidth: 380, width: "100%" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Order Placed!</div>
        <div style={{ fontSize: 14, color: "#8A96B5", fontWeight: 500, marginBottom: 8, lineHeight: 1.6 }}>
          Your order has been sent to the shop. The shopkeeper will confirm it shortly.
        </div>
        <div style={{ fontSize: 13, color: "#B0BACC", marginBottom: 28 }}>Redirecting in {count}s...</div>
        <a href="/my-orders" style={{ display: "block", padding: "14px", background: "#1A6BFF", color: "white", borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
          Track My Orders →
        </a>
      </div>
    </div>
  );
}
