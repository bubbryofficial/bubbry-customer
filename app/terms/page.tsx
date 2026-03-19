"use client";
const COMPANY = "Bubbry Technologies Private Limited";
const APP = "Bubbry";
const EMAIL = "legal@bubbry.in";
const DATE = "18 March 2026";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F6FB; color: #0D1B3E; }
.top-bar { background: #1A6BFF; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; flex-shrink: 0; }
.title { font-size: 18px; font-weight: 900; color: white; }
.page { max-width: 720px; margin: 0 auto; padding: 28px 20px 60px; }
.last-updated { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 24px; background: white; border-radius: 10px; padding: 10px 14px; border: 1.5px solid #E4EAFF; }
h1 { font-size: 22px; font-weight: 900; color: #0D1B3E; margin-bottom: 6px; }
h2 { font-size: 16px; font-weight: 800; color: #0D1B3E; margin: 28px 0 10px; padding-left: 12px; border-left: 4px solid #1A6BFF; }
p { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 12px; }
ul { padding-left: 20px; margin-bottom: 12px; }
li { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 6px; }
.highlight-box { background: #EBF1FF; border: 1.5px solid #C5D5FF; border-radius: 12px; padding: 14px 16px; margin: 16px 0; }
.highlight-box p { color: #0D1B3E; font-weight: 600; margin: 0; }
.warning-box { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 14px 16px; margin: 16px 0; }
.warning-box p { color: #946200; font-weight: 600; margin: 0; }
.section-card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(26,107,255,0.05); }
.contact-card { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
.contact-card p { color: rgba(255,255,255,0.7); }
.contact-card a { color: #60A5FA; }
strong { color: #0D1B3E; font-weight: 700; }
`;

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Terms & Conditions</div>
      </div>
      <div className="page">
        <h1>Terms and Conditions</h1>
        <div className="last-updated">Last updated: {DATE} · Effective immediately upon account creation</div>

        <div className="warning-box">
          <p>⚠️ IMPORTANT: By creating an account and verifying your phone number via OTP, you confirm that you have read, understood, and agreed to these Terms and Conditions. This constitutes a legally binding agreement between you and {COMPANY}.</p>
        </div>

        <div className="section-card">
          <h2>1. Acceptance of Terms</h2>
          <p>These Terms and Conditions ("Terms") govern your access to and use of the {APP} mobile application and website (collectively, the "Platform") operated by <strong>{COMPANY}</strong> ("Company", "we", "us", or "our"), a company incorporated under the laws of India.</p>
          <p>By completing OTP verification during signup, you acknowledge that:</p>
          <ul>
            <li>You are at least 18 years of age or have parental/guardian consent</li>
            <li>You have the legal capacity to enter into binding contracts</li>
            <li>You accept these Terms in full, without modification</li>
            <li>Your OTP verification serves as your electronic signature under the Information Technology Act, 2000</li>
          </ul>
          <div className="highlight-box">
            <p>📱 Your phone OTP verification is your legally valid digital consent under the Indian Information Technology Act, 2000 and the Electronic Signatures Rules, 2015. This is equivalent to a physical signature.</p>
          </div>
        </div>

        <div className="section-card">
          <h2>2. Nature of the Platform</h2>
          <p>{APP} is a <strong>hyperlocal commerce marketplace platform</strong> that connects customers with local shopkeepers ("Sellers") in their vicinity. The Company acts solely as a technology intermediary and does NOT:</p>
          <ul>
            <li>Own, store, handle, inspect, or control any products listed on the Platform</li>
            <li>Guarantee the quality, authenticity, safety, or fitness of any product</li>
            <li>Employ or control the Sellers or their delivery personnel</li>
            <li>Guarantee delivery timelines or order fulfillment</li>
            <li>Act as a party to any transaction between Customer and Seller</li>
          </ul>
          <p>All transactions are directly between you (Customer) and the Seller. {APP} facilitates the connection only.</p>
        </div>

        <div className="section-card">
          <h2>3. Limitation of Liability</h2>
          <div className="warning-box">
            <p>⚠️ READ CAREFULLY: These limitations significantly affect your legal rights.</p>
          </div>
          <p>To the maximum extent permitted by applicable law, <strong>{COMPANY} shall NOT be liable</strong> for:</p>
          <ul>
            <li>Any loss, damage, injury, or illness caused by products purchased through the Platform</li>
            <li>Delayed, wrong, damaged, or undelivered orders</li>
            <li>Product quality issues, expiry, or adulteration</li>
            <li>Fraudulent activity by any Seller on the Platform</li>
            <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of data, profits, goodwill, or business opportunities</li>
            <li>Technical failures, server downtime, or app errors</li>
            <li>Unauthorized access to your account due to your negligence</li>
            <li>Actions or omissions of third-party payment processors (UPI apps, banks)</li>
            <li>Force majeure events including natural disasters, pandemics, strikes, or government actions</li>
          </ul>
          <p>Our maximum aggregate liability to you for any cause shall not exceed the amount paid by you for the specific transaction giving rise to the claim, in the preceding 30 days.</p>
        </div>

        <div className="section-card">
          <h2>4. Payment Terms</h2>
          <p>All payments are processed directly to the Seller's UPI account. By making a payment:</p>
          <ul>
            <li>You confirm the payment details are correct before proceeding</li>
            <li>You acknowledge that UPI transactions are governed by NPCI and your bank's terms</li>
            <li>The Company does not hold, process, or have access to any funds you transfer</li>
            <li>Payment disputes must be resolved directly with the Seller and/or your bank</li>
            <li>The 20% advance for Cash on Delivery orders is non-refundable if you fail to collect the order</li>
            <li>Refunds (if applicable) are at the sole discretion of the Seller</li>
          </ul>
          <div className="highlight-box">
            <p>💳 {APP} does not collect or process payments. All money goes directly to the Seller. We have no control over and no liability for payment disputes.</p>
          </div>
        </div>

        <div className="section-card">
          <h2>5. Refund and Cancellation Policy</h2>
          <p>Refund and cancellation are subject to our <a href="/refund-policy" style={{color:"#1A6BFF",fontWeight:700}}>Refund Policy</a>. Key points:</p>
          <ul>
            <li>Orders once placed and confirmed by the Seller cannot be cancelled by the customer</li>
            <li>Refunds for defective or wrong products must be claimed within 24 hours of receipt</li>
            <li>Refunds are processed by the Seller, not by {APP}</li>
            <li>The Company has no obligation to facilitate or enforce refunds</li>
            <li>Perishable goods (dairy, food items) are non-refundable once delivered</li>
          </ul>
        </div>

        <div className="section-card">
          <h2>6. User Obligations</h2>
          <p>As a user of the Platform, you agree to:</p>
          <ul>
            <li>Provide accurate and truthful information during registration</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Not use the Platform for any unlawful, fraudulent, or abusive purpose</li>
            <li>Not place false or malicious orders</li>
            <li>Not attempt to harm, disrupt, or reverse-engineer the Platform</li>
            <li>Comply with all applicable laws including the Consumer Protection Act, 2019</li>
            <li>Not misuse the review or rating system</li>
          </ul>
        </div>

        <div className="section-card">
          <h2>7. Intellectual Property</h2>
          <p>All content on the Platform including but not limited to the name "Bubbry", logos, designs, software, text, and graphics are the exclusive property of {COMPANY} and are protected under the Copyright Act, 1957 and Trade Marks Act, 1999.</p>
          <p>You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
        </div>

        <div className="section-card">
          <h2>8. Governing Law and Dispute Resolution</h2>
          <p>These Terms are governed by the laws of <strong>India</strong>. Any disputes shall be:</p>
          <ul>
            <li>First attempted to be resolved amicably through written notice to {EMAIL}</li>
            <li>If unresolved within 30 days, submitted to <strong>binding arbitration</strong> under the Arbitration and Conciliation Act, 1996</li>
            <li>The seat of arbitration shall be <strong>Haldwani, Uttarakhand, India</strong></li>
            <li>The arbitration shall be conducted in English</li>
            <li>Subject to the above, courts in <strong>Haldwani, Uttarakhand</strong> shall have exclusive jurisdiction</li>
          </ul>
          <div className="warning-box">
            <p>⚠️ By accepting these Terms, you waive your right to participate in class action lawsuits or class-wide arbitration against the Company.</p>
          </div>
        </div>

        <div className="section-card">
          <h2>9. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless {COMPANY}, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
          <ul>
            <li>Your use of the Platform</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Any false or fraudulent information provided by you</li>
          </ul>
        </div>

        <div className="section-card">
          <h2>10. Modifications to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after notification of changes constitutes your acceptance of the revised Terms. We will notify you via SMS or in-app notification for material changes.</p>
        </div>

        <div className="section-card">
          <h2>11. Termination</h2>
          <p>We reserve the right to suspend or terminate your account at our sole discretion without notice for violation of these Terms, fraudulent activity, or any conduct detrimental to other users or the Platform.</p>
        </div>

        <div className="section-card">
          <h2>12. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable, that provision shall be modified to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.</p>
        </div>

        <div className="contact-card">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.2)"}}>Contact — Legal</h2>
          <p>For legal matters, notices, or grievances:</p>
          <p style={{marginTop:8}}><strong style={{color:"white"}}>{COMPANY}</strong></p>
          <p>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p>Grievance Officer: Available at <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p style={{marginTop:8,fontSize:12}}>Response time: Within 48 business hours</p>
        </div>
      </div>
    </div>
  );
}
