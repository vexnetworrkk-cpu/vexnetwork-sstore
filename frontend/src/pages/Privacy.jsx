import React from 'react';

const Privacy = () => {
  return (
    <div className="container animate-fade-up" style={{ padding: '4rem 0', maxWidth: '800px', minHeight: '60vh' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
        
        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
          <p>When you visit the VexNetwork store or purchase a package, we may collect certain information, including:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Your Minecraft Username and UUID.</li>
            <li>Your Real Name, Email Address, and Contact Number (during checkout).</li>
            <li>Your IP Address and standard web log information.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>To process your transactions and deliver purchased digital goods.</li>
            <li>To prevent fraudulent transactions and chargebacks.</li>
            <li>To identify you securely on our Minecraft servers.</li>
            <li>To communicate with you regarding your purchase or support requests.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>3. Data Security and Sharing</h2>
          <p>We implement strict security measures to maintain the safety of your personal information. We do not sell, trade, or rent your personal identification information to others. We securely transmit your payment data to our trusted payment processors (e.g., Razorpay, Stripe); we do not store your raw credit card numbers on our servers.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>4. Cookies</h2>
          <p>Our website may use "cookies" to enhance your user experience, such as keeping you logged into the store with your Minecraft username and retaining your shopping cart contents.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us through our official Discord server.</p>
        </section>

      </div>
    </div>
  );
};

export default Privacy;
