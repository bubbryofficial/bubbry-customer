"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; }
.header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: white; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.back-btn { width: 36px; height: 36px; background: #EBF1FF; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #1A6BFF; cursor: pointer; border: none; flex-shrink: 0; }
.header-title { font-size: 16px; font-weight: 900; color: #0D1B3E; flex: 1; }
#map { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1; }
.pin-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -100%); z-index: 500; pointer-events: none; font-size: 36px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
.bottom-panel { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: white; border-radius: 20px 20px 0 0; padding: 20px 20px 36px; box-shadow: 0 -8px 32px rgba(0,0,0,0.15); }
.panel-handle { width: 40px; height: 4px; background: #E4EAFF; border-radius: 2px; margin: 0 auto 16px; }
.address-label { font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
.address-text { font-size: 15px; font-weight: 700; color: #0D1B3E; margin-bottom: 4px; line-height: 1.4; min-height: 22px; }
.address-sub { font-size: 12px; color: #8A96B5; font-weight: 500; margin-bottom: 16px; }
.confirm-btn { width: 100%; padding: 15px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
.confirm-btn:hover { background: #1255CC; }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.instr-label { font-size: 11px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
.instr-required { background: #FFF0F0; color: #E53E3E; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
.instr-input { width: 100%; padding: 12px 14px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 14px; font-weight: 500; color: #0D1B3E; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; resize: none; margin-bottom: 14px; box-sizing: border-box; transition: border-color 0.2s; line-height: 1.5; }
.instr-input:focus { border-color: #1A6BFF; }
.instr-input.filled { border-color: #00B37E; background: #F0FBF7; }
.locate-btn { position: fixed; bottom: 180px; right: 16px; z-index: 1000; width: 48px; height: 48px; background: white; border-radius: 50%; border: none; font-size: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.loading-addr { color: #B0BACC; font-style: italic; }
`;

export default function SelectLocationPage() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [address, setAddress] = useState("");
  const [addressSub, setAddressSub] = useState("Move the map to set your delivery location");
  const [lat, setLat] = useState<number>(28.6139);
  const [lng, setLng] = useState<number>(77.2090);
  const [fetching, setFetching] = useState(false);
  const [ready, setReady] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [label, setLabel] = useState("Home");

  useEffect(() => {
    // Load Leaflet dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  function initMap() {
    const L = (window as any).L;
    // Try to get user location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          createMap(pos.coords.latitude, pos.coords.longitude);
        },
        () => createMap(lat, lng)
      );
    } else createMap(lat, lng);
  }

  function createMap(initLat: number, initLng: number) {
    const L = (window as any).L;
    const map = L.map("map", { zoomControl: true }).setView([initLat, initLng], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);
    mapRef.current = map;

    // Move header below to avoid overlap
    map.on("moveend", () => {
      const center = map.getCenter();
      setLat(center.lat);
      setLng(center.lng);
      reverseGeocode(center.lat, center.lng);
    });

    reverseGeocode(initLat, initLng);
    setReady(true);
  }

  async function reverseGeocode(lat: number, lng: number) {
    setFetching(true);
    setAddress("Fetching address...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.address) {
        const a = data.address;
        // Build street-level address
        const line1Parts = [
          a.house_number,
          a.road || a.street || a.pedestrian || a.path,
          a.neighbourhood || a.suburb || a.quarter,
        ].filter(Boolean);
        const line2Parts = [
          a.city || a.town || a.village || a.county,
          a.state_district || a.district,
          a.state,
          a.postcode,
        ].filter(Boolean);
        const fullLine1 = line1Parts.join(", ") || data.display_name.split(", ").slice(0, 2).join(", ");
        const fullLine2 = line2Parts.join(", ");
        setAddress(fullLine1 + (fullLine2 ? ", " + fullLine2 : ""));
        setAddressSub(fullLine2 || "");
      } else if (data.display_name) {
        const parts = data.display_name.split(", ");
        setAddress(parts.slice(0, 4).join(", "));
        setAddressSub(parts.slice(4, 7).join(", "));
      }
    } catch {
      setAddress("Location selected");
      setAddressSub(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
    setFetching(false);
  }

  function locateMe() {
    if (!mapRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 17);
    });
  }

  async function confirmLocation() {
    if (!instructions.trim()) { alert("Please fill in the delivery instructions (house number, landmark, etc.)"); return; }
    const fullAddress = address + " — " + instructions;
    // Save to localStorage immediately
    localStorage.setItem("bubbry_delivery_lat", lat.toString());
    localStorage.setItem("bubbry_delivery_lng", lng.toString());
    localStorage.setItem("bubbry_address", fullAddress);
    localStorage.setItem("bubbry_delivery_instructions", instructions);
    // Save to DB as a new saved address
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        // Check how many addresses already saved
        const { data: existing } = await sb.from("customer_addresses")
          .select("id").eq("customer_id", session.user.id);
        if ((existing?.length || 0) >= 5) {
          alert("You already have 5 saved addresses. Delete one before adding a new one.");
          return;
        }
        await sb.from("customer_addresses").insert({
          customer_id: session.user.id,
          label,
          address: fullAddress,
          lat, lng,
          instructions,
        });
        // Also set as active delivery address (update profile default)
        await sb.from("profiles").update({
          default_address: fullAddress,
          default_lat: lat,
          default_lng: lng,
          default_instructions: instructions,
        }).eq("id", session.user.id);
        // Sync to localStorage so cart uses it immediately
        localStorage.setItem("bubbry_address", fullAddress);
        localStorage.setItem("bubbry_delivery_lat", lat.toString());
        localStorage.setItem("bubbry_delivery_lng", lng.toString());
        localStorage.setItem("bubbry_delivery_instructions", instructions);
      }
    } catch (e) { console.error("Save error:", e); }
    router.back();
  }

  return (
    <div style={{ height: "100vh", overflow: "hidden", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div className="header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <div className="header-title">📍 Set Delivery Location</div>
      </div>

      {/* Map */}
      <div id="map" style={{ marginTop: 0 }} />

      {/* Center pin */}
      <div className="pin-center">📍</div>

      {/* My location button */}
      <button className="locate-btn" onClick={locateMe}>🎯</button>

      {/* Bottom panel */}
      <div className="bottom-panel">
        <div className="panel-handle" />
        <div className="address-label">Detected Address</div>
        <div className={`address-text ${fetching ? "loading-addr" : ""}`}>
          {address ? address.split(",").slice(0,3).join(",") : "Move map to select location"}
        </div>
        {address && address.split(",").length > 3 && (
          <div className="address-sub">{address.split(",").slice(3).join(",")}</div>
        )}
        <div style={{ fontSize: 11, color: "#B0BACC", marginBottom: 14, fontWeight: 600, marginTop: 4 }}>
          📌 {lat.toFixed(5)}, {lng.toFixed(5)}
        </div>

        {/* Address Label */}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {["Home","Work","Other"].map(l => (
            <button key={l} onClick={() => setLabel(l)}
              style={{flex:1,padding:"8px 0",border:label===l?"2px solid #1A6BFF":"1.5px solid #E4EAFF",borderRadius:10,background:label===l?"#EBF1FF":"white",color:label===l?"#1A6BFF":"#8A96B5",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
            </button>
          ))}
        </div>
        {/* Delivery Instructions — required */}
        <div className="instr-label">
          Delivery Instructions
          <span className="instr-required">Required</span>
        </div>
        <textarea
          className={`instr-input ${instructions.trim() ? "filled" : ""}`}
          rows={3}
          placeholder="House/flat no., floor, building name, landmark, colony...&#10;e.g. Flat 204, Sunrise Apartments, Near SBI ATM, Govind Nagar"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />

        <button className="confirm-btn" onClick={confirmLocation} disabled={!ready || fetching || !address}>
          {instructions.trim() ? "✓ Confirm Location & Address" : "Fill delivery instructions to continue"}
        </button>
      </div>
    </div>
  );
}
