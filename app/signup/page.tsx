"use client";
import { supabase } from "../../lib/supabase";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.auth-input { width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E; background: white; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.auth-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.auth-btn { width: 100%; padding: 16px; background: #1A6BFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-top: 8px; }
.auth-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
.auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-btn.secondary { background: white; color: #1A6BFF; border: 2px solid #1A6BFF; }
.auth-btn.secondary:hover:not(:disabled) { background: #EBF1FF; transform: none; box-shadow: none; }
.field-label { display: block; font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
.phone-row { display: flex; gap: 8px; }
.phone-prefix { padding: 14px 12px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 15px; font-weight: 700; color: #0D1B3E; background: #F4F6FB; white-space: nowrap; }
.otp-input { width: 100%; padding: 16px; border: 2px solid #E4EAFF; border-radius: 12px; font-size: 22px; font-weight: 800; color: #0D1B3E; text-align: center; letter-spacing: 6px; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: all 0.2s; }
.otp-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
.step-dots { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 12px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.35); transition: all 0.3s; }
.dot.active { background: white; width: 24px; border-radius: 4px; }
.dot.done { background: rgba(255,255,255,0.7); }
.resend-btn { background: none; border: none; color: #1A6BFF; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 0; }
.resend-btn:disabled { color: #B0BACC; cursor: not-allowed; }
.consent-box { background: #F4F6FB; border: 1.5px solid #E4EAFF; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
.consent-check-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.consent-checkbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #E4EAFF; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all 0.2s; }
.consent-checkbox.checked { background: #1A6BFF; border-color: #1A6BFF; }
.consent-text { font-size: 12px; color: #4A5880; font-weight: 500; line-height: 1.6; }
.consent-text a { color: #1A6BFF; font-weight: 700; text-decoration: none; }
.consent-otp-note { font-size: 11px; color: #8A96B5; font-weight: 600; text-align: center; margin-top: 10px; line-height: 1.5; }
.legal-links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 12px; }
.legal-link { font-size: 12px; color: #1A6BFF; font-weight: 700; text-decoration: none; }
`;

type Step = "details" | "phone" | "otp" | "done";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const fullPhone = "+91" + phone.replace(/\D/g, "");
  const stepNum = step === "details" ? 1 : step === "phone" ? 2 : step === "otp" ? 3 : 3;

  function startTimer() {
    setResendTimer(30);
    const iv = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  }

  async function sendOtp() {
    if (phone.replace(/\D/g, "").length < 10) { alert("Enter a valid 10-digit phone number"); return; }
    setLoading(true);
        // Block duplicate customer role
    const { data: existingProfiles } = await supabase
      .from("profiles").select("id, role").eq("phone", fullPhone);
    const alreadyCustomer = (existingProfiles || []).find((p: any) => p.role === "customer");
    if (alreadyCustomer) {
      alert("A customer account already exists with this number. Please log in instead.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) { alert("Could not send OTP: " + error.message); setLoading(false); return; }
    setLoading(false); startTimer(); setStep("otp");
  }

  async function verifyOtp() {
    if (otp.length < 4) { alert("Enter the OTP"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    if (error) { alert("Invalid OTP: " + error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { alert("Verification failed"); setLoading(false); return; }
    await supabase.auth.updateUser({ email, password });
    const { error: pe } = await supabase.from("profiles").upsert({
      id: user.id, name: fullName, email, phone: fullPhone, role: "customer",
      is_live: false, offers_delivery: false, offers_pickup: true,
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      consent_ip: "",
    });
    if (pe) { alert("Profile error: " + pe.message); setLoading(false); return; }
    setLoading(false);
    router.push("/customer-dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #EBF1FF 0%, #F4F6FB 60%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ background: "#1A6BFF", height: 180, borderBottomLeftRadius: "50% 40px", borderBottomRightRadius: "50% 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 24, marginBottom: -20, boxShadow: "0 8px 30px rgba(26,107,255,0.3)" }}>
        <div style={{ fontSize: 32, marginBottom: 2 }}>🫧</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>Join Bubbry</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4, marginBottom: 12 }}>Shop from local stores near you</div>
        <div className="step-dots">
          {[1,2,3].map(i => <div key={i} className={`dot ${i === stepNum ? "active" : i < stepNum ? "done" : ""}`} />)}
        </div>
      </div>
      <div style={{ padding: "32px 24px 60px", maxWidth: 420, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(26,107,255,0.1)", border: "1.5px solid #E4EAFF" }}>
          {step === "details" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 20 }}>Your Details</div>
            <div style={{ marginBottom: 14 }}><label className="field-label">Full Name</label><input className="auth-input" placeholder="Rahul Sharma" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
            <div style={{ marginBottom: 14 }}><label className="field-label">Email</label><input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div style={{ marginBottom: 20 }}><label className="field-label">Password</label><input type="password" className="auth-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="auth-btn" onClick={() => { if (!fullName||!email||password.length<6){alert("Fill all fields");return;} setStep("phone"); }}>Next →</button>
          </>}
          {step === "phone" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 6 }}>Verify Phone</div>
            <div style={{ fontSize: 13, color: "#8A96B5", marginBottom: 20 }}>We'll send you a one-time code</div>
            <div style={{ marginBottom: 20 }}><label className="field-label">Phone Number</label>
              <div className="phone-row"><div className="phone-prefix">🇮🇳 +91</div><input className="auth-input" placeholder="9876543210" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))} style={{ flex: 1 }} /></div>
            </div>
            {/* Legal Consent */}
            <div className="consent-box">
              <div className="consent-check-row" onClick={() => setConsentChecked(!consentChecked)}>
                <div className={`consent-checkbox ${consentChecked ? "checked" : ""}`}>
                  {consentChecked && <span style={{color:"white",fontSize:13,fontWeight:900}}>✓</span>}
                </div>
                <div className="consent-text">
                  I have read and agree to the <a href="/terms" target="_blank">Terms & Conditions</a>, <a href="/privacy" target="_blank">Privacy Policy</a>, and <a href="/refund-policy" target="_blank">Refund Policy</a> of Bubbry. I understand that verifying my OTP constitutes my legally binding electronic signature and consent under the Information Technology Act, 2000.
                </div>
              </div>
              <div className="legal-links">
                <a href="/terms" target="_blank" className="legal-link">📄 Terms & Conditions</a>
                <a href="/privacy" target="_blank" className="legal-link">🔒 Privacy Policy</a>
                <a href="/refund-policy" target="_blank" className="legal-link">↩️ Refund Policy</a>
              </div>
            </div>

            <button className="auth-btn" onClick={sendOtp} disabled={loading || !consentChecked} style={{opacity: consentChecked ? 1 : 0.5}}>{loading ? "Sending OTP..." : "Send OTP & Agree →"}</button>
            {!consentChecked && <div style={{textAlign:"center",fontSize:11,color:"#E53E3E",fontWeight:600,marginTop:8}}>Please read and accept the terms above to continue</div>}
            <button className="auth-btn secondary" style={{ marginTop: 10 }} onClick={() => setStep("details")}>← Back</button>
          </>}
          {step === "otp" && <>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0D1B3E", marginBottom: 6 }}>Enter OTP</div>
            <div style={{ fontSize: 13, color: "#8A96B5", marginBottom: 12 }}>Sent to +91 {phone}</div>
            <div style={{ background:"#E6FAF4", border:"1.5px solid #B8E8D4", borderRadius:10, padding:"10px 12px", marginBottom:16, fontSize:12, color:"#00875A", fontWeight:600 }}>
              ✓ By verifying this OTP, you digitally sign and agree to Bubbry&apos;s Terms & Conditions, Privacy Policy, and Refund Policy
            </div>
            <div style={{ marginBottom: 20 }}><input className="otp-input" placeholder="------" type="number" value={otp} onChange={e => setOtp(e.target.value.slice(0,6))} /></div>
            <button className="auth-btn" onClick={verifyOtp} disabled={loading||otp.length<4}>{loading ? "Verifying..." : "Verify & Continue →"}</button>
            <div style={{ textAlign: "center", marginTop: 14 }}><button className="resend-btn" onClick={sendOtp} disabled={resendTimer>0||loading}>{resendTimer>0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</button></div>
            <button className="auth-btn secondary" style={{ marginTop: 10 }} onClick={() => { setStep("phone"); setOtp(""); }}>← Change Number</button>
          </>}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#8A96B5", fontWeight: 500 }}>
          Already have an account? <a href="/login" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Login</a>
        </p>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#B0BACC", fontWeight: 500 }}>
          Are you a shopkeeper? <a href="https://shop.bubbry.in/signup" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Open Bubbry Shop →</a>
        </p>
      </div>
    </div>
  );
}
