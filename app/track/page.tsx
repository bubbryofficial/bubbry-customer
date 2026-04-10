"use client";
import { supabase } from "../../lib/supabase";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; }
#map { position: fixed; inset: 0; z-index: 1; }
.top-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: #1A6BFF; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(26,107,255,0.3); }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 10px; color: white; font-size: 18px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; }
.top-title { font-size: 16px; font-weight: 900; color: white; flex: 1; }
.live-pill { background: #E53E3E; color: white; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.live-pill::before { content:''; width:6px; height:6px; border-radius:50%; background:white; animation:blink 1s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.bottom-card { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: white; border-radius: 20px 20px 0 0; padding: 16px 20px 40px; box-shadow: 0 -8px 32px rgba(0,0,0,0.15); }
.handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 0 auto 14px; }
.status-row { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 12px; margin-bottom: 14px; }
.status-row.pending { background: #FFF8E6; }
.status-row.ready { background: #EBF1FF; }
.status-row.out { background: #FFF0F0; }
.status-row.done { background: #E6FAF4; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-pending { background: #FFB800; }
.dot-ready { background: #1A6BFF; }
.dot-out { background: #E53E3E; animation: blink 1s infinite; }
.dot-done { background: #00B37E; }
.status-text { font-size: 13px; font-weight: 800; color: #0D1B3E; flex: 1; }
.dist-badge { font-size: 11px; font-weight: 800; color: #E53E3E; background: #FFF0F0; padding: 4px 8px; border-radius: 8px; white-space: nowrap; }
.legend { display: flex; flex-direction: column; gap: 8px; }
.leg { display: flex; align-items: flex-start; gap: 10px; }
.leg-icon { font-size: 18px; width: 28px; text-align: center; flex-shrink: 0; margin-top: 1px; }
.leg-label { font-size: 10px; font-weight: 800; color: #B0BACC; text-transform: uppercase; letter-spacing: 0.4px; }
.leg-val { font-size: 13px; font-weight: 700; color: #0D1B3E; line-height: 1.4; margin-top: 1px; }
.leg-val.live { color: #1A6BFF; }
.leg-val.wait { color: #8A96B5; }
.leg-val.warn { color: #E53E3E; font-size: 12px; }
.fit-btn { position: fixed; bottom: 220px; right: 16px; z-index: 1000; width: 46px; height: 46px; background: white; border-radius: 50%; border: none; font-size: 18px; box-shadow: 0 4px 14px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; }
`;

function mkIcon(emoji: string, size = 30) {
  return `<div style="font-size:${size}px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3));line-height:1">${emoji}</div>`;
}
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000, r = (d: number) => d * Math.PI / 180;
  const a = Math.sin(r(lat2-lat1)/2)**2 + Math.cos(r(lat1))*Math.cos(r(lat2))*Math.sin(r(lng2-lng1)/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function TrackPage() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const role = params.get("role") || "customer"; // customer | shop | rider
  const trackType = params.get("type") || ""; // "pickup" for customer navigating to shop

  const mapRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const customerMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const lastRouteOriginRef = useRef<{lat:number,lng:number}|null>(null); // skip redraw if rider hasn't moved much
  const watchRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const shopRef = useRef<any>(null); // always-current shop for GPS callbacks
  const orderRef = useRef<any>(null); // always-current order for GPS callbacks
  const deliveryPosRef = useRef<{lat:number,lng:number}|null>(null); // always-current delivery coords
  const hasAutoFitted = useRef<boolean>(false); // only auto-fit once — don't fight user's manual zoom

  const [order, setOrder] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [riderPos, setRiderPos] = useState<{lat:number, lng:number}|null>(null);
  const [customerPos, setCustomerPos] = useState<{lat:number,lng:number}|null>(null);
  const [riderDist, setRiderDist] = useState<number|null>(null);
  const [shopDist, setShopDist] = useState<number|null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [shopPhone, setShopPhone] = useState<string|null>(null);
  const [riderPhone, setRiderPhone] = useState<string|null>(null);

  useEffect(() => {
    initMap();
    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      try { mapRef.current?.remove(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !orderId) return;
    loadData();
    if (trackType === "pickup") {
      startCustomerGPS();
    }

    // Poll order + rider position every 2s — single reliable loop, no broadcast dependency
    const poll = setInterval(async () => {
      if (!orderId) return;
      const { data } = await supabase.from("orders")
        .select("id,status,order_type,delivery_lat,delivery_lng,delivery_address,delivery_instructions,rider_id,rider_lat,rider_lng")
        .eq("id", orderId).single();
      if (!data) return;

      // Update order ref + state
      const u = { ...(orderRef.current || {}), ...data };
      orderRef.current = u;
      setOrder(u);

      // Update delivery pos ref if coords now available
      if (data.delivery_lat && data.delivery_lng && !deliveryPosRef.current) {
        deliveryPosRef.current = { lat: data.delivery_lat, lng: data.delivery_lng };
      }

      // Show rider from orders.rider_lat/rider_lng (written by rider app on every GPS fix)
      if (data.rider_lat && data.rider_lng) {
        setRiderPos({ lat: data.rider_lat, lng: data.rider_lng });
        return; // got it from orders table — done
      }

      // Fallback: try riders.last_lat/last_lng if orders columns not populated yet
      if (data.rider_id) {
        const { data: rd } = await supabase.from("riders")
          .select("last_lat, last_lng").eq("id", data.rider_id).single();
        if (rd?.last_lat && rd?.last_lng) {
          setRiderPos({ lat: rd.last_lat, lng: rd.last_lng });
        }
      }
    }, 2000);

    // Also subscribe to realtime broadcast as bonus (instant when it works)
    const riderId = orderRef.current?.rider_id;
    if (riderId) subscribeRider(riderId);
    // Re-subscribe once loadData finishes and we have the rider_id
    const subTimer = setTimeout(() => {
      const rid = orderRef.current?.rider_id;
      if (rid) subscribeRider(rid);
    }, 3000);

    return () => { clearInterval(poll); clearTimeout(subTimer); if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [mapLoaded]);

  // Rider GPS tracking effect
  useEffect(() => {
    if (!riderPos || !mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng([riderPos.lat, riderPos.lng]);
    } else {
      const ic = L.divIcon({ html: mkIcon("🛵", 30), iconSize:[32,32], iconAnchor:[16,32], className:"" });
      riderMarkerRef.current = L.marker([riderPos.lat, riderPos.lng], { icon: ic, zIndexOffset: 2000 })
        .addTo(mapRef.current).bindPopup("🛵 Rider — On the way");
    }
    // Use deliveryPosRef first (set as soon as delivery pin is placed), fall back to orderRef
    const dp = deliveryPosRef.current;
    const ord = orderRef.current;
    const dLat = dp?.lat ?? ord?.delivery_lat;
    const dLng = dp?.lng ?? ord?.delivery_lng;
    if (dLat && dLng) {
      setRiderDist(haversine(riderPos.lat, riderPos.lng, dLat, dLng));
      drawRoute(riderPos.lat, riderPos.lng, dLat, dLng);
    }
    // Only auto-fit on the very first rider position — never override user's manual zoom/pan after that
    if (!hasAutoFitted.current) {
      hasAutoFitted.current = true;
      fitAll();
    }
  }, [riderPos]);

  // Customer GPS effect (pickup mode) - uses shopRef for always-current shop
  useEffect(() => {
    if (!customerPos || !mapRef.current || trackType !== "pickup") return;
    const L = (window as any).L;
    if (!L) return;
    const sh = shopRef.current;
    // Place/update customer marker
    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerPos.lat, customerPos.lng]);
    } else {
      const ic = L.divIcon({
        html: `<div style="font-size:30px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3))">🏃</div>`,
        iconSize:[32,32], iconAnchor:[16,32], className:""
      });
      customerMarkerRef.current = L.marker([customerPos.lat, customerPos.lng], { icon: ic, zIndexOffset: 2000 })
        .addTo(mapRef.current).bindPopup("🏃 You — heading to shop");
    }
    // Draw route + distance to shop
    if (sh?.latitude && sh?.longitude) {
      setShopDist(haversine(customerPos.lat, customerPos.lng, sh.latitude, sh.longitude));
      drawRoute(customerPos.lat, customerPos.lng, sh.latitude, sh.longitude);
      // Fit map to show both
      try {
        if (!hasAutoFitted.current) {
          hasAutoFitted.current = true;
          mapRef.current.fitBounds(
            [[customerPos.lat, customerPos.lng], [sh.latitude, sh.longitude]],
            { padding: [80, 80], maxZoom: 17 }
          );
        }
      } catch {}
    } else {
      // Shop not loaded yet — just center on customer
      mapRef.current.setView([customerPos.lat, customerPos.lng], 16);
    }
  }, [customerPos]);

  // When shop loads in pickup mode, immediately draw route if we already have customer pos
  useEffect(() => {
    if (trackType !== "pickup" || !shop?.latitude || !customerPos) return;
    shopRef.current = shop;
    setShopDist(haversine(customerPos.lat, customerPos.lng, shop.latitude, shop.longitude));
    drawRoute(customerPos.lat, customerPos.lng, shop.latitude, shop.longitude);
    try {
      mapRef.current?.fitBounds(
        [[customerPos.lat, customerPos.lng], [shop.latitude, shop.longitude]],
        { padding: [80, 80] }
      );
    } catch {}
  }, [shop]);

  async function loadData() {
    const { data: ord } = await supabase.from("orders")
      .select("id, status, order_type, delivery_address, delivery_instructions, delivery_lat, delivery_lng, shop_id, rider_id, customer_id")
      .eq("id", orderId!).single();
    if (!ord) return;
    setOrder(ord);
    orderRef.current = ord;

    const { data: sh } = await supabase.from("profiles")
      .select("id, shop_name, name, latitude, longitude, phone").eq("id", ord.shop_id).single();
    setShop(sh);
    shopRef.current = sh;

    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Always place shop pin
    if (sh?.latitude && sh?.longitude) {
      const ic = L.divIcon({ html: mkIcon("🏪", 32), iconSize:[36,36], iconAnchor:[18,36], className:"" });
      L.marker([sh.latitude, sh.longitude], { icon: ic })
        .addTo(mapRef.current)
        .bindPopup(`<b>🏪 ${sh.shop_name || sh.name}</b><br><small style="color:#8A96B5">Shop location</small>`);
      mapRef.current.setView([sh.latitude, sh.longitude], 15);
    }

    // PICKUP ORDER: only show shop pin — no delivery pin, no rider tracking
    // Customer live GPS is started separately and handled by customerPos effect
    if (ord.order_type !== "delivery") {
      return; // skip delivery pin and rider subscription
    }

    // DELIVERY ORDER: show customer delivery pin + subscribe to rider
    let custLat = ord.delivery_lat;
    let custLng = ord.delivery_lng;
    let custAddr = ord.delivery_instructions || ord.delivery_address || "";

    if ((!custLat || !custLng) && ord.customer_id) {
      const { data: cp } = await supabase.from("profiles")
        .select("default_lat, default_lng, default_address, default_instructions")
        .eq("id", ord.customer_id).single();
      if (cp?.default_lat && cp?.default_lng) {
        custLat = cp.default_lat;
        custLng = cp.default_lng;
        custAddr = cp.default_instructions || cp.default_address || custAddr;
        await supabase.from("orders").update({ delivery_lat: custLat, delivery_lng: custLng, delivery_instructions: custAddr }).eq("id", ord.id);
      }
    }

    if (custLat && custLng) {
      deliveryPosRef.current = { lat: custLat, lng: custLng }; // store for riderPos effect
      const ic = L.divIcon({ html: mkIcon("📍", 36), iconSize:[36,36], iconAnchor:[18,36], className:"" });
      L.marker([custLat, custLng], { icon: ic })
        .addTo(mapRef.current)
        .bindPopup(`<div style="font-family:inherit;min-width:180px"><b>📍 Delivery Location</b>${custAddr ? `<div style="color:#1A6BFF;font-weight:700;font-size:12px;margin-top:4px">${custAddr}</div>` : ""}</div>`)
        .openPopup();
      setOrder((prev: any) => ({ ...prev, delivery_lat: custLat, delivery_lng: custLng }));
      if (sh?.latitude && sh?.longitude) {
        try { mapRef.current.fitBounds([[sh.latitude,sh.longitude],[custLat,custLng]], { padding:[80,80] }); } catch {}
      }
    }

    // Subscribe to broadcast channel now that we have rider_id
    if (ord.order_type === "delivery" && ord.rider_id) {
      subscribeRider(ord.rider_id);
    }

    // Fetch shop phone
    if (sh?.phone) setShopPhone(sh.phone);

    // Fetch rider phone
    if (ord.rider_id) {
      const { data: rider } = await supabase.from("riders").select("phone").eq("id", ord.rider_id).single();
      if (rider?.phone) setRiderPhone(rider.phone);
    }
  }

  function startCustomerGPS() {
    if (!navigator.geolocation) {
      alert("GPS not supported on this device");
      return;
    }
    // Create broadcast channel so shopkeeper can see customer moving
    const ch = supabase.channel(`customer-pickup-${orderId}`)
      .on("broadcast", { event: "pos" }, () => {})
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          watchRef.current = navigator.geolocation.watchPosition(
            pos => {
              const { latitude: lat, longitude: lng } = pos.coords;
              setCustomerPos({ lat, lng });
              // Broadcast to shopkeeper
              ch.send({ type: "broadcast", event: "pos", payload: { lat, lng } });
              // Center map on first fix if no shop yet
              if (!shopRef.current?.latitude && mapRef.current) {
                mapRef.current.setView([lat, lng], 16);
              }
            },
            err => console.error("GPS error:", err.message),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
          );
        }
      });
  }

  function subscribeRider(riderId?: string) {
    if (channelRef.current) { try { supabase.removeChannel(channelRef.current); } catch {} channelRef.current = null; }
    if (!riderId) return;

    // Listen to both order-specific and idle channels — whichever the rider is broadcasting on
    const ch = supabase.channel(`track-rider-${riderId}-${orderId}`)
      .on("broadcast", { event: "pos" }, (payload: any) => {
        if (payload?.payload?.lat) setRiderPos({ lat: payload.payload.lat, lng: payload.payload.lng });
      })
      .subscribe();
    channelRef.current = ch;

    supabase.channel(`track-idle-${riderId}`)
      .on("broadcast", { event: "pos" }, (payload: any) => {
        if (payload?.payload?.lat) setRiderPos({ lat: payload.payload.lat, lng: payload.payload.lng });
      })
      .subscribe();
  }

  async function drawRoute(rLat: number, rLng: number, dLat: number, dLng: number) {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    // Only redraw if rider has moved >30m since last draw — prevents blinking on every poll
    const last = lastRouteOriginRef.current;
    if (last && haversine(last.lat, last.lng, rLat, rLng) < 30) return;
    lastRouteOriginRef.current = { lat: rLat, lng: rLng };
    // Remove old line only right before drawing the new one (not before the async fetch)
    const drawNew = (layer: any) => {
      if (routeLineRef.current) { try { routeLineRef.current.remove(); } catch {} routeLineRef.current = null; }
      routeLineRef.current = layer;
      layer.addTo(mapRef.current);
    };
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${rLng},${rLat};${dLng},${dLat}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.code === "Ok" && data.routes?.[0]?.geometry) {
        drawNew(L.geoJSON(data.routes[0].geometry, { style: { color: "#1A6BFF", weight: 5, opacity: 0.9 } }));
        return;
      }
    } catch {}
    drawNew(L.polyline([[rLat, rLng], [dLat, dLng]], { color: "#1A6BFF", weight: 4, opacity: 0.7, dashArray: "8,6" }));
  }

  function fitAll() {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;
    const pts: number[][] = [];
    if (riderPos) pts.push([riderPos.lat, riderPos.lng]);
    if (shop?.latitude && shop?.longitude) pts.push([shop.latitude, shop.longitude]);
    const dp = deliveryPosRef.current;
    const dLat = dp?.lat ?? order?.delivery_lat;
    const dLng = dp?.lng ?? order?.delivery_lng;
    if (dLat && dLng) pts.push([dLat, dLng]);
    // Bottom card covers ~220px — pad bottom so markers don't hide under it
    const bottomPad = 230;
    if (pts.length >= 2) {
      try { mapRef.current.fitBounds(pts, { paddingTopLeft:[60,80], paddingBottomRight:[60, bottomPad] }); } catch {}
    } else if (pts.length === 1) {
      // Single point — offset centre upward so it shows in the visible map area above the card
      try {
        mapRef.current.setView(pts[0], 16);
        const pxOffset = mapRef.current.latLngToContainerPoint(pts[0]);
        const mapH = mapRef.current.getSize().y;
        const visibleMidY = (mapH - bottomPad) / 2;
        const dy = pxOffset.y - visibleMidY;
        if (Math.abs(dy) > 30) {
          const newCenter = mapRef.current.containerPointToLatLng([pxOffset.x, visibleMidY]);
          mapRef.current.setView(newCenter, 16, { animate: false });
        }
      } catch {}
    }
  }

  function initMap() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map("map", { zoomControl: true }).setView([29.2183, 79.5130], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution:"© OpenStreetMap", maxZoom:19 }).addTo(map);
      mapRef.current = map;
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }

  const isOut = order?.status === "out_for_delivery";
  const isDone = order?.status === "completed";

  const statusLabel = !order ? "Loading..."
    : order.status === "pending" ? "⏳ Waiting for shop to accept"
    : order.status === "ready" && trackType === "pickup" ? "✅ Order ready — Head to the shop!"
    : order.status === "ready" ? "✅ Order ready — preparing dispatch"
    : isOut ? "🛵 Rider is on the way!"
    : isDone ? (order?.order_type !== "delivery" ? "✅ Picked Up" : "✅ Delivered")
    : "⏳ Processing";

  const statusClass = isOut ? "out" : isDone ? "done" : order?.status === "ready" ? "ready" : "pending";
  const dotClass = isOut ? "dot-out" : isDone ? "dot-done" : order?.status === "ready" ? "dot-ready" : "dot-pending";

  const roleTitle = trackType === "pickup" ? "🏃 Navigate to Shop"
    : role === "customer" ? "📍 Track Your Order"
    : role === "shop" ? "🏪 Live Order Tracking"
    : "🛵 Delivery Tracking";

  return (
    <div style={{ height:"100vh", overflow:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div id="map" />

      <div className="top-bar">
        <button className="back-btn" onClick={() => history.back()}>←</button>
        <div className="top-title">{roleTitle}</div>
        {isOut && riderPos && <div className="live-pill">LIVE</div>}
      </div>

      <button className="fit-btn" onClick={fitAll}>🗺️</button>

      <div className="bottom-card">
        <div className="handle" />

        {order && (
          <div className={`status-row ${statusClass}`}>
            <div className={`status-dot ${dotClass}`} />
            <div className="status-text">{statusLabel}</div>
            {riderDist !== null && isOut && (
              <div className="dist-badge">
                {riderDist < 1000 ? `${riderDist}m` : `${(riderDist/1000).toFixed(1)}km`} away
              </div>
            )}
          </div>
        )}

        <div className="legend">
          <div className="leg">
            <div className="leg-icon">🏪</div>
            <div>
              <div className="leg-label">Shop — Fixed Location</div>
              <div className="leg-val">{shop?.shop_name || shop?.name || "Loading..."}</div>
            </div>
          </div>
          {trackType === "pickup" ? (
            <>
              <div className="leg">
                <div className="leg-icon">🏃</div>
                <div>
                  <div className="leg-label">Your Location — Live GPS</div>
                  <div className={`leg-val ${customerPos ? "live" : "wait"}`}>
                    {customerPos ? "📡 Navigating to shop" : "Getting your location..."}
                  </div>
                </div>
              </div>
              {shopDist !== null && (
                <div style={{background:"#E6FAF4",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>🏁</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#8A96B5"}}>Distance to Shop</div>
                    <div style={{fontSize:16,fontWeight:900,color:"#00875A"}}>
                      {shopDist < 1000 ? `${shopDist}m` : `${(shopDist/1000).toFixed(1)}km`}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="leg">
                <div className="leg-icon">📍</div>
                <div>
                  <div className="leg-label">Customer Delivery Location — Fixed</div>
                  <div className="leg-val" style={{fontSize:12,lineHeight:1.5}}>
                    {order?.delivery_instructions
                      ? <><span style={{fontWeight:900,color:"#1A6BFF"}}>{order.delivery_instructions}</span><br/><span style={{color:"#8A96B5",fontSize:11}}>{order.delivery_address}</span></>
                      : order?.delivery_address || (order?.order_type === "pickup" ? "Pickup from shop" : "—")}
                  </div>
                </div>
              </div>
              <div className="leg">
                <div className="leg-icon">🛵</div>
                <div>
                  <div className="leg-label">Rider — Live GPS</div>
                  <div className={`leg-val ${riderPos ? "live" : "wait"}`}>
                    {!isOut && !isDone ? "Rider will appear when order is dispatched"
                      : isDone ? "✅ Delivered"
                      : riderPos ? "📡 Live location updating"
                      : "Connecting to rider..."}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Call buttons on track page */}
          {(shopPhone || riderPhone) && (
            <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
              {shopPhone && (
                <a href={`tel:${shopPhone}`}
                  style={{display:"flex",alignItems:"center",gap:6,background:"#EBF4FF",border:"1.5px solid #1A6BFF",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:700,color:"#1A6BFF",textDecoration:"none",flex:1,justifyContent:"center"}}>
                  📞 Call Shop
                </a>
              )}
              {riderPhone && (
                <a href={`tel:${riderPhone}`}
                  style={{display:"flex",alignItems:"center",gap:6,background:"#F0FFF4",border:"1.5px solid #38A169",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:700,color:"#38A169",textDecoration:"none",flex:1,justifyContent:"center"}}>
                  🛵 Call Rider
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackPageWrapper() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:"center",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Loading map...</div>}>
      <TrackPage />
    </Suspense>
  );
}
