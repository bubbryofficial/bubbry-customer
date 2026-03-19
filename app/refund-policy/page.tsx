"use client";
const DATE = "18 March 2026";
const EMAIL = "support@bubbry.in";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.top-bar { background: #1A6BFF; padding: 16px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100; }
.back-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.18); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 18px; color: white; }
.title { font-size: 18px; font-weight: 900; color: white; }
.page { max-width: 720px; margin: 0 auto; padding: 28px 20px 60px; font-family: 'Plus Jakarta Sans', sans-serif; }
h1 { font-size: 22px; font-weight: 900; color: #0D1B3E; margin-bottom: 6px; }
h2 { font-size: 16px; font-weight: 800; color: #0D1B3E; margin: 0 0 10px; padding-left: 12px; border-left: 4px solid #1A6BFF; }
p { font-size: 14px; color: #4A5880; font-weight: 500; line-height: 1.75; margin-bottom: 12px; }
ul { padding-left: 20px; margin-bottom: 12px; }
li { font-size: 14px; color: #4A5880; line-height: 1.75; margin-bottom: 6px; font-weight: 500; }
.card { background: white; border-radius: 16px; border: 1.5px solid #E4EAFF; padding: 20px; margin-bottom: 16px; }
.warning { background: #FFF8E6; border: 1.5px solid #FFB800; border-radius: 12px; padding: 14px; margin: 12px 0; }
.warning p { color: #946200; font-weight: 600; margin: 0; }
.last-updated { font-size: 12px; color: #8A96B5; font-weight: 600; margin-bottom: 24px; background: white; border-radius: 10px; padding: 10px 14px; border: 1.5px solid #E4EAFF; }
.dark-card { background: #0D1B3E; border-radius: 16px; padding: 20px; margin-top: 24px; }
`;
export default function RefundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{CSS}</style>
      <div className="top-bar">
        <a href="javascript:history.back()" className="back-btn">←</a>
        <div className="title">Refund Policy</div>
      </div>
      <div className="page">
        <h1>Refund &amp; Cancellation Policy</h1>
        <div className="last-updated">Last updated: {DATE}</div>
        <div className="warning"><p>⚠️ Please read carefully before placing an order. Placing an order indicates your acceptance of this policy.</p></div>
        <div className="card">
          <h2>1. Order Cancellation</h2>
          <ul>
            <li>Orders can be cancelled <strong>only before the Seller accepts</strong> the order</li>
            <li>Once a Seller marks the order as "Ready", cancellation is not possible</li>
            <li>To cancel, contact the Seller directly via the app within 5 minutes of placing the order</li>
            <li>Bubbry does not guarantee cancellations — it is at the Seller's discretion</li>
          </ul>
        </div>
        <div className="card">
          <h2>2. Refund Eligibility</h2>
          <p>Refunds may be considered only in the following cases:</p>
          <ul>
            <li>Wrong product delivered (different from what was ordered)</li>
            <li>Significantly damaged product (must be reported within 2 hours of delivery)</li>
            <li>Product is expired or past its use-by date at the time of delivery</li>
            <li>Order paid for but never fulfilled by the Seller</li>
          </ul>
          <div className="warning"><p>⚠️ Perishable items (milk, bread, vegetables, cooked food) are NON-REFUNDABLE once delivered, except in cases of clear quality defects reported immediately.</p></div>
        </div>
        <div className="card">
          <h2>3. How Refunds Work</h2>
          <ul>
            <li>Refunds are processed by the <strong>Seller directly</strong>, not by Bubbry</li>
            <li>Bubbry facilitates the claim but cannot compel Sellers to issue refunds</li>
            <li>Refunds are returned to the original payment method within 5-7 business days (subject to Seller approval)</li>
            <li>For UPI payments, refunds go back to the same UPI ID used for payment</li>
            <li>For COD advance payments, the 20% advance is refundable only if the Seller fails to fulfill the order</li>
          </ul>
        </div>
        <div className="card">
          <h2>4. Non-Refundable Cases</h2>
          <ul>
            <li>Change of mind after order is accepted</li>
            <li>Perishable or consumable items (food, dairy, medicines)</li>
            <li>Products returned without prior approval from the Seller</li>
            <li>Delay in delivery due to customer unavailability</li>
            <li>Incorrect delivery address provided by customer</li>
            <li>Product damaged by customer after delivery</li>
          </ul>
        </div>
        <div className="card">
          <h2>5. How to Raise a Refund Request</h2>
          <ul>
            <li>Contact the Seller directly through the app within 2 hours of delivery</li>
            <li>Provide photo evidence of the issue</li>
            <li>If Seller is unresponsive, email {EMAIL} with your order ID and evidence</li>
            <li>Bubbry will attempt to mediate but cannot guarantee resolution</li>
          </ul>
        </div>
        <div className="dark-card">
          <h2 style={{color:"white",borderColor:"rgba(255,255,255,0.3)"}}>Contact Support</h2>
          <p style={{color:"rgba(255,255,255,0.7)",marginTop:8}}>Email: <a href={"mailto:"+EMAIL} style={{color:"#60A5FA"}}>{EMAIL}</a></p>
          <p style={{color:"rgba(255,255,255,0.7)"}}>Response time: Within 24 business hours</p>
        </div>
      </div>
    </div>
  );
}
