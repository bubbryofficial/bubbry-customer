"use client";
import { supabase } from "../../lib/supabase";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; }
.page { min-height: 100vh; background: #F4F6FB; padding-bottom: 120px; }
.top-bar { background: #1A6BFF; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(26,107,255,0.25); }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; cursor: pointer; border: none; }
.page-title { font-size: 18px; font-weight: 900; color: white; }
.content { padding: 16px; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.card { background: white; border-radius: 18px; border: 1.5px solid #E4EAFF; overflow: hidden; box-shadow: 0 2px 12px rgba(26,107,255,0.06); }
.card-header { padding: 16px 16px 12px; border-bottom: 1.5px solid #F4F6FB; }
.card-title { font-size: 13px; font-weight: 800; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; }
.bill-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 16px; font-size: 14px; color: #4A5880; font-weight: 500; border-bottom: 1px solid #F4F6FB; }
.bill-row:last-child { border-bottom: none; }
.bill-row.total { font-size: 17px; font-weight: 900; color: #0D1B3E; padding: 14px 16px; }
.bill-row.highlight { color: #1A6BFF; font-weight: 700; }

/* Payment method cards */
.method-option { display: flex; align-items: center; gap: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; border-bottom: 1.5px solid #F4F6FB; }
.method-option:last-child { border-bottom: none; }
.method-option.selected { background: #EBF1FF; }
.method-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #E4EAFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.method-radio.checked { border-color: #1A6BFF; background: #1A6BFF; }
.method-radio.checked::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: white; }
.method-icon { font-size: 28px; flex-shrink: 0; }
.method-info { flex: 1; }
.method-label { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.method-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }
.method-badge { background: #E6FAF4; color: #00875A; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; margin-top: 4px; display: inline-block; }
.method-badge.orange { background: #FFF8E6; color: #946200; }

/* UPI Section */
.upi-qr { width: 100%; border-radius: 12px; border: 1.5px solid #E4EAFF; display: block; margin-top: 10px; }
.qr-placeholder { background: #F4F6FB; border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 32px; text-align: center; margin-top: 10px; }
.amount-chip { background: #1A6BFF; color: white; font-size: 20px; font-weight: 900; padding: 12px 20px; border-radius: 14px; text-align: center; margin: 12px 16px 0; }

/* COD breakdown */
.cod-breakdown { margin: 0 16px 16px; background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 14px; }
.cod-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #0D1B3E; margin-bottom: 8px; }
.cod-row:last-child { margin-bottom: 0; padding-top: 8px; border-top: 1px solid #FFD966; font-size: 14px; font-weight: 900; }
.cod-note { font-size: 11px; color: #946200; font-weight: 600; margin-top: 8px; line-height: 1.5; }

/* Screenshot upload */
.upload-zone { margin: 0 16px 16px; border: 2px dashed #E4EAFF; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #F4F6FB; }
.upload-zone:hover { border-color: #1A6BFF; background: #EBF1FF; }
.upload-zone.has-file { border-color: #00B37E; border-style: solid; background: #E6FAF4; }
.upload-preview { width: 100%; height: 140px; object-fit: cover; border-radius: 10px; display: block; }

/* Place order */
.place-bar { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1.5px solid #E4EAFF; padding: 14px 20px; box-shadow: 0 -4px 20px rgba(26,107,255,0.1); }
.place-btn { width: 100%; max-width: 480px; margin: 0 auto; display: block; padding: 16px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 900; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.place-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.3); }
.place-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.place-btn.green { background: #00B37E; }
.place-btn.green:hover:not(:disabled) { background: #009068; }

/* Shop info */
.shop-info-row { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
.shop-avatar { width: 40px; height: 40px; background: #EBF1FF; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.shop-name-text { font-size: 15px; font-weight: 800; color: #0D1B3E; }
.shop-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-top: 2px; }

.step-row { display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 13px; color: #4A5880; font-weight: 600; border-bottom: 1px solid #F4F6FB; }
.step-row:last-child { border-bottom: none; }
.step-num { width: 22px; height: 22px; border-radius: 50%; background: #1A6BFF; color: white; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");
  const [shopUpi, setShopUpi] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopId, setShopId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [deliveryLat, setDeliveryLat] = useState<number|null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number|null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bubbry_cart");
    const savedType = localStorage.getItem("bubbry_order_type") || "pickup";
    const savedAddress = localStorage.getItem("bubbry_address") || "";
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const uid = session.user.id;

          // Check for open fraud dispute against this customer — blocks ordering
          const { data: openDispute } = await supabase
            .from("disputes")
            .select("id")
            .eq("customer_id", uid)
            .eq("status", "open")
            .eq("reason", "fraud_customer")
            .limit(1)
            .maybeSingle();

          if (openDispute) {
            window.location.href = "/customer-dashboard?restricted=1";
            return;
          }

          const { data } = await supabase.from("profiles")
            .select("default_lat,default_lng,default_address,default_instructions,banned")
            .eq("id", uid).single();

          if (data?.banned) {
            await supabase.auth.signOut();
            window.location.href = "/login?banned=1";
            return;
          }

          if (data?.default_lat) { setDeliveryLat(data.default_lat); localStorage.setItem("bubbry_delivery_lat", data.default_lat.toString()); }
          if (data?.default_lng) { setDeliveryLng(data.default_lng); localStorage.setItem("bubbry_delivery_lng", data.default_lng.toString()); }
          if (data?.default_instructions) { setDeliveryInstructions(data.default_instructions); localStorage.setItem("bubbry_delivery_instructions", data.default_instructions); }
          if (data?.default_address) { setAddress(data.default_address); }
        }
      } catch {
        const savedLat = localStorage.getItem("bubbry_delivery_lat");
        const savedLng = localStorage.getItem("bubbry_delivery_lng");
        const savedInstr = localStorage.getItem("bubbry_delivery_instructions");
        if (savedLat) setDeliveryLat(parseFloat(savedLat));
        if (savedLng) setDeliveryLng(parseFloat(savedLng));
        if (savedInstr) setDeliveryInstructions(savedInstr);
        if (savedAddress) setAddress(savedAddress);
      }
    })();
    if (saved) {
      const cartData = JSON.parse(saved);
      setCart(cartData);
      setOrderType(savedType);
      setAddress(savedAddress);
      // Load shop UPI from the shop in cart
      if (cartData.length > 0) {
        const sid = cartData[0].shop_id;
        setShopId(sid);
        setShopName(cartData[0].shop_name || "Shop");
        loadShopUpi(sid);
      }
    }
  }, []);

  async function loadShopUpi(sid: string) {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("upi_id, shop_name, name")
      .eq("id", sid)
      .single();
    if (data) {
      setShopUpi(data.upi_id || "");
      setShopName(data.shop_name || data.name || "Shop");
    }
    setLoading(false);
  }

  const itemTotal = cart.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);
  const delivery = orderType === "delivery" ? (itemTotal >= 99 ? 0 : 20) : 0;
  const grandTotal = itemTotal + delivery;
  const upiAdvance = Math.ceil(grandTotal * 0.2); // 20% for COD
  const cashAmount = grandTotal - upiAdvance;

  function openUpiPicker(amount: number) {
    // upi:// scheme — on Android this triggers the system app chooser showing all UPI apps
    // On iOS it opens whichever app is registered as default UPI handler
    const upiUrl = `upi://pay?pa=${shopUpi}&pn=${encodeURIComponent(shopName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Bubbry Order")}`;
    window.location.href = upiUrl;
  }

  async function placeOrder() {
    if (orderType === "delivery" && (!address.trim() || !deliveryLat || !deliveryLng)) {
      alert("Please pin your delivery location on the map first. Tap 'Change' to open the map.");
      return;
    }
    if (!screenshotFile) {
      alert("Please upload your payment screenshot to place the order.");
      return;
    }
    setPlacing(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
      setPlacing(false);
      return;
    }

    // Hard gate — check for open fraud dispute at order submission time
    const { data: openDispute } = await supabase
      .from("disputes")
      .select("id")
      .eq("customer_id", user.id)
      .eq("status", "open")
      .eq("reason", "fraud_customer")
      .limit(1)
      .maybeSingle();

    if (openDispute) {
      setPlacing(false);
      alert("⚠️ Your account is temporarily restricted.\n\nA payment dispute is pending review against your account. You cannot place new orders until it is resolved.\n\nOur team will contact you within 24 hours.");
      window.location.href = "/customer-dashboard?restricted=1";
      return;
    }

    const { data: profileCheck } = await supabase.from("profiles")
      .select("banned").eq("id", user.id).single();
    if (profileCheck?.banned) {
      await supabase.auth.signOut();
      window.location.href = "/login?banned=1";
      return;
    }

    // Upload payment screenshot if provided
    let paymentProofUrl = null;
    if (screenshotFile) {
      const path = `payments/${user.id}_${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, screenshotFile, { upsert: true, contentType: screenshotFile.type || "image/jpeg" });
      if (upErr) {
        alert("Payment screenshot upload failed: " + upErr.message + "\n\nPlease make sure the product-images storage bucket exists in Supabase.");
        setPlacing(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      paymentProofUrl = urlData.publicUrl;
    }

    // Generate a single group_id for all items in this order
    const groupId = crypto.randomUUID();
    let anyFailed = false;
    for (const item of cart) {
      const { error } = await supabase.from("orders").insert({
        group_id: groupId,
        // For loose products: product_id is null, use loose_product_id to track shop_products row
        product_id: item.is_loose ? null : item.product_id,
        loose_product_id: item.is_loose ? (item.id || item.product_id) : null,
        loose_product_name: item.is_loose ? item.name : null,
        loose_unit: item.is_loose ? (item.loose_unit || "kg") : null,
        loose_qty: item.is_loose ? (item.customQty || item.quantity || 1) : null,
        shop_id: item.shop_id,
        customer_id: user.id,
        quantity: item.is_loose ? 1 : (item.quantity ?? 1),
        order_type: orderType,
        delivery_address: orderType === "delivery" ? address : null,
        delivery_instructions: orderType === "delivery" ? deliveryInstructions : null,
        delivery_lat: orderType === "delivery" ? deliveryLat : null,
        delivery_lng: orderType === "delivery" ? deliveryLng : null,
        status: "pending",
        payment_method: paymentMethod,
        payment_proof: paymentProofUrl,
        // For loose products, price = the amount customer entered
        amount_paid: paymentMethod === "upi" ? grandTotal : upiAdvance,
        amount_cash: paymentMethod === "cod" ? cashAmount : 0,
      });
      if (error) {
        alert("Order failed: " + error.message);
        anyFailed = true;
        break;
      }
    }

    if (!anyFailed) {
      localStorage.removeItem("bubbry_cart");
      localStorage.removeItem("bubbry_order_type");
      // Keep address in localStorage and profile for next order
      // Save to profile
      if (orderType === "delivery" && deliveryLat && deliveryLng) {
        supabase.from("profiles").update({
          default_address: address,
          default_lat: deliveryLat,
          default_lng: deliveryLng,
          default_instructions: deliveryInstructions,
        }).eq("id", user.id);
      }
      router.push("/order-success");
    }
    setPlacing(false);
  }

  // Screenshot is ALWAYS required — order cannot be placed without it
  const screenshotRequired = !!shopUpi; // only required if shop has UPI set up
  const hasLocation = orderType !== "delivery" || (deliveryLat !== null && deliveryLng !== null && address.trim());
  const canPlace = !placing && screenshotFile !== null && hasLocation;

  return (
    <div className="page">
      <style>{CSS}</style>

      <div className="top-bar">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <div className="page-title">Checkout</div>
      </div>

      <div className="content">

        {/* Shop info */}
        <div className="card">
          <div className="shop-info-row">
            <div className="shop-avatar">🏪</div>
            <div>
              <div className="shop-name-text">{shopName}</div>
              <div className="shop-sub">{cart.length} item{cart.length !== 1 ? "s" : ""} · {orderType === "delivery" ? "Delivery" : "Pickup"}</div>
            </div>
          </div>
        </div>

        {/* Bill summary */}
        <div className="card">
          <div className="card-header"><div className="card-title">Bill Summary</div></div>
          <div className="bill-row"><span>Items ({cart.length})</span><span>₹{itemTotal}</span></div>
          {orderType === "delivery" && <div className="bill-row"><span>Delivery fee</span><span>₹{delivery}</span></div>}
          <div className="bill-row total"><span>Total to pay</span><span>₹{grandTotal}</span></div>
        </div>

        {/* Payment method */}
        <div className="card">
          <div className="card-header"><div className="card-title">Payment Method</div></div>

          <div className={`method-option ${paymentMethod === "upi" ? "selected" : ""}`} onClick={() => setPaymentMethod("upi")}>
            <div className={`method-radio ${paymentMethod === "upi" ? "checked" : ""}`} />
            <div className="method-icon">📲</div>
            <div className="method-info">
              <div className="method-label">UPI Payment</div>
              <div className="method-sub">Pay full amount via UPI</div>
              <div className="method-badge">Instant · Recommended</div>
            </div>
          </div>

          <div className={`method-option ${paymentMethod === "cod" ? "selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
            <div className={`method-radio ${paymentMethod === "cod" ? "checked" : ""}`} />
            <div className="method-icon">💵</div>
            <div className="method-info">
              <div className="method-label">Cash on Delivery</div>
              <div className="method-sub">20% UPI advance + rest in cash</div>
              <div className="method-badge orange">Advance required</div>
            </div>
          </div>
        </div>

        {/* UPI Payment details */}
        {paymentMethod === "upi" && (
          <div className="card">
            <div className="card-header"><div className="card-title">Pay via UPI</div></div>

            {loading ? (
              <div style={{ padding: 24, textAlign: "center", color: "#8A96B5" }}>Loading shop UPI...</div>
            ) : shopUpi ? (
              <>
                {/* Amount chip */}
                <div className="amount-chip">₹{grandTotal} to pay</div>

                {/* Open UPI app picker */}
                <div style={{ padding: "0 16px 16px" }}>
                  <button
                    onClick={() => openUpiPicker(grandTotal)}
                    style={{ width: "100%", padding: "16px", background: "#1A6BFF", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    📲 Pay ₹{grandTotal} via UPI
                  </button>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12, fontSize: 22 }}>
                    <span title="Google Pay">🇬</span>
                    <span title="PhonePe">📱</span>
                    <span title="Paytm">💰</span>
                    <span title="BHIM">🏛️</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#B0BACC", textAlign: "center", marginTop: 6, fontWeight: 500 }}>
                    Your phone will show all available UPI apps
                  </div>
                </div>

                {/* Steps */}
                <div style={{ borderTop: "1.5px solid #F4F6FB" }}>
                  <div style={{ padding: "12px 16px 8px", fontSize: 12, fontWeight: 700, color: "#8A96B5", textTransform: "uppercase", letterSpacing: "0.6px" }}>How to pay</div>
                  {["Open any UPI app (GPay, PhonePe, Paytm)", `Send ₹${grandTotal} to ${shopUpi}`, "Take a screenshot of the payment", "Upload the screenshot below"].map((s, i) => (
                    <div key={i} className="step-row">
                      <div className="step-num">{i + 1}</div>
                      {s}
                    </div>
                  ))}
                </div>

                {/* Screenshot upload */}
                <div style={{ padding: "12px 16px 4px", fontSize: 12, fontWeight: 700, color: "#8A96B5", textTransform: "uppercase", letterSpacing: "0.6px" }}>Upload Payment Screenshot <span style={{color:"#E53E3E"}}>*Required</span></div>
                {!screenshotFile && <div style={{margin:"0 16px 8px",background:"#FFF0F0",border:"1.5px solid #FFCDD2",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,color:"#E53E3E"}}>⚠️ You must upload the payment screenshot before placing the order</div>}
                <div
                  className={`upload-zone ${screenshotPreview ? "has-file" : ""}`}
                  onClick={() => document.getElementById("ss-input")?.click()}
                >
                  {screenshotPreview
                    ? <img src={screenshotPreview} alt="Payment screenshot" className="upload-preview" />
                    : <>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#4A5880" }}>Tap to upload screenshot</div>
                        <div style={{ fontSize: 12, color: "#B0BACC", marginTop: 4 }}>Your payment confirmation screenshot</div>
                      </>
                  }
                </div>
                <input id="ss-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setScreenshotFile(f);
                  const r = new FileReader();
                  r.onload = () => setScreenshotPreview(r.result as string);
                  r.readAsDataURL(f);
                }} />
                {screenshotPreview && (
                  <div style={{ padding: "0 16px 16px" }}>
                    <button onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); document.getElementById("ss-input")?.click(); }}
                      style={{ width: "100%", padding: 10, background: "white", border: "1.5px solid #E4EAFF", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#4A5880", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      🔄 Retake Screenshot
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: 20, textAlign: "center", color: "#8A96B5", fontSize: 13 }}>
                This shop hasn't set up UPI yet. Please use Cash on Delivery.
              </div>
            )}
          </div>
        )}

        {/* COD details */}
        {paymentMethod === "cod" && (
          <div className="card">
            <div className="card-header"><div className="card-title">Cash on Delivery Breakdown</div></div>
            <div className="cod-breakdown">
              <div className="cod-row">
                <span>📲 UPI Advance (20%)</span>
                <span>₹{upiAdvance}</span>
              </div>
              <div className="cod-row">
                <span>💵 Cash at delivery</span>
                <span>₹{cashAmount}</span>
              </div>
              <div className="cod-row">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <div className="cod-note">
                ⚠️ Pay ₹{upiAdvance} via UPI now to confirm your order. Remaining ₹{cashAmount} to be paid in cash at the time of {orderType === "delivery" ? "delivery" : "pickup"}.
              </div>
            </div>

            {shopUpi ? (
              <>
                <div style={{ padding: "0 16px 16px" }}>
                  <button
                    onClick={() => openUpiPicker(upiAdvance)}
                    style={{ width: "100%", padding: "16px", background: "#FF9500", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    📲 Pay ₹{upiAdvance} Advance via UPI
                  </button>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12, fontSize: 22 }}>
                    <span title="Google Pay">🇬</span>
                    <span title="PhonePe">📱</span>
                    <span title="Paytm">💰</span>
                    <span title="BHIM">🏛️</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#B0BACC", textAlign: "center", marginTop: 6, fontWeight: 500 }}>
                    Your phone will show all available UPI apps
                  </div>
                </div>

                {/* Screenshot for COD advance */}
                <div style={{ padding: "0 16px 4px", fontSize: 12, fontWeight: 700, color: "#8A96B5", textTransform: "uppercase", letterSpacing: "0.6px" }}>Upload Advance Payment Screenshot <span style={{color:"#E53E3E"}}>*Required</span></div>
                {!screenshotFile && <div style={{margin:"0 16px 8px",background:"#FFF0F0",border:"1.5px solid #FFCDD2",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,color:"#E53E3E"}}>⚠️ Upload the UPI advance payment screenshot to confirm your order</div>}
                <div
                  className={`upload-zone ${screenshotPreview ? "has-file" : ""}`}
                  onClick={() => document.getElementById("ss-input")?.click()}
                >
                  {screenshotPreview
                    ? <img src={screenshotPreview} alt="Payment screenshot" className="upload-preview" />
                    : <>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#4A5880" }}>Upload advance payment screenshot</div>
                      </>
                  }
                </div>
                <input id="ss-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setScreenshotFile(f);
                  const r = new FileReader();
                  r.onload = () => setScreenshotPreview(r.result as string);
                  r.readAsDataURL(f);
                }} />
                {screenshotPreview && (
                  <div style={{ padding: "0 16px 16px" }}>
                    <button onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                      style={{ width: "100%", padding: 10, background: "white", border: "1.5px solid #E4EAFF", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#4A5880", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      🔄 Retake
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: "0 16px 16px", fontSize: 13, color: "#8A96B5", textAlign: "center" }}>
                Shop hasn't set up UPI. Pay full amount in cash.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Place order button */}
      <div className="place-bar">
        <button
          className={`place-btn ${!screenshotFile ? "" : paymentMethod === "cod" ? "green" : ""}`}
          onClick={placeOrder}
          disabled={!canPlace}
        >
          {placing ? "Placing order..." :
            paymentMethod === "upi"
              ? screenshotFile ? `✓ Confirm Order · ₹${grandTotal}` : `Upload Screenshot to Place Order`
              : `✓ Place COD Order · ₹${grandTotal}`
          }
        </button>
      </div>
    </div>
  );
}
