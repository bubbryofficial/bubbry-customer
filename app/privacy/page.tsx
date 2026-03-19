"use client";
const COMPANY = "Bubbry Technologies Private Limited";
const EMAIL = "privacy@bubbry.in";
const DATE = "18 March 2026";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.top-bar { background: #1A6BFF; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; }
.title { font-size: 18px; font-weight: 900; color: white; }
.page { max-width: 720px; margin: 0 auto; padding: 28px 20px 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
.last-updated { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 24px; background: white; border-radius: 10px; padding: 10px 14px; border: 1.5px solid #E4EAFF; }
h1 { font-size: 22px; font-weight: 900; color: #0D1B3E; margin-bottom: 6px; }
h2 { font-size: 16px; font-weight: 800; color: #0D1B3E; margin: 0 0 10px; padding-left: 12px; border-left: 4px solid #1A6BFF; }
p { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 12px; }
ul { padding-left: 20px; margin-bottom: 12px; }
li { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 6px; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(26,107,255,0.05); }
.info-box { background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; padding: 14px 16px; margin: 12px 0; }
.dark-card { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
`;
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Privacy Policy</div>
      </div>
      <div className="page">
        <h1>Privacy Policy</h1>
        <div className="last-updated">Last updated: {DATE} · Compliant with IT Act 2000 & PDPB 2023</div>
        <div className="card">
          <h2>1. Information We Collect</h2>
          <p>We collect the following when you use Bubbry:</p>
          <ul>
            <li><strong>Identity:</strong> Full name, phone number, email address</li>
            <li><strong>Location:</strong> GPS coordinates to find nearby shops (only when app is open)</li>
            <li><strong>Order Data:</strong> Products ordered, delivery addresses, order history</li>
            <li><strong>Payment Screenshots:</strong> Stored securely — we never store UPI PIN or bank passwords</li>
            <li><strong>Device Data:</strong> Device type, OS, IP address, app version</li>
          </ul>
        </div>
        <div className="card">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To process and fulfill your orders</li>
            <li>To send OTP and order notifications via SMS</li>
            <li>To show you nearby shops and products</li>
            <li>To improve the Platform</li>
            <li>To prevent fraud and ensure safety</li>
            <li>To comply with legal obligations</li>
          </ul>
          <div className="info-box"><p style={{color:"#0D1B3E",fontWeight:600,margin:0}}>🔒 We do NOT sell your personal data to advertisers or third parties.</p></div>
        </div>
        <div className="card">
          <h2>3. Data Sharing</h2>
          <p>We only share your data with:</p>
          <ul>
            <li><strong>Sellers:</strong> Name, phone, delivery address for order fulfillment</li>
            <li><strong>Supabase:</strong> Secure cloud database provider</li>
            <li><strong>Twilio:</strong> OTP delivery via SMS</li>
            <li><strong>Law Enforcement:</strong> Only when required by Indian law or court order</li>
          </ul>
        </div>
        <div className="card">
          <h2>4. Data Retention & Deletion</h2>
          <ul>
            <li>Personal data deleted within 30 days of account closure</li>
            <li>Order records retained 7 years for tax/legal compliance</li>
            <li>Request deletion anytime by emailing {EMAIL}</li>
          </ul>
        </div>
        <div className="card">
          <h2>5. Your Rights</h2>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion (right to be forgotten)</li>
            <li>Withdraw consent by deleting your account</li>
            <li>File a complaint with India's Data Protection Board</li>
          </ul>
        </div>
        <div className="card">
          <h2>6. Security Measures</h2>
          <p>We use SSL/TLS encryption, secure database access controls, and OTP-based authentication. No internet system is 100% secure — we cannot guarantee absolute security but take all reasonable precautions.</p>
        </div>
        <div className="dark-card">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.3)"}}>Data Protection Officer</h2>
          <p style={{color:"rgba(255,255,255,0.7)",marginTop:8}}>{COMPANY}</p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Email: <a href={"mailto:"+EMAIL} style={{color:"#60A5FA"}}>{EMAIL}</a></p>
        </div>
      </div>
    </div>
  );
}
