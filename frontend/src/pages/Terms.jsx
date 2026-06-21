import React from 'react';

const Terms = () => {
  return (
    <div className="container animate-fade-up" style={{ padding: '4rem 0', maxWidth: '800px', minHeight: '60vh' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms & Conditions</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
        
        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using the VexNetwork store and server, you agree to be bound by these Terms and Conditions. If you do not agree to all of the terms and conditions, you are prohibited from using our services.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>2. Server Rules</h2>
          <p>You agree to follow all rules set forth by VexNetwork administrators while playing on the server. Failure to comply may result in a temporary or permanent ban. Any purchases made do not exempt you from server rules.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>3. Purchases and Virtual Items</h2>
          <p>All items purchased in this store are virtual digital goods. You are purchasing a license to use these virtual items within the VexNetwork server. These items have no real-world value and cannot be exchanged for real currency.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>4. Refund Policy</h2>
          <p>All sales are strictly final. Because you are purchasing digital goods that are delivered instantly upon successful payment, we do not offer refunds, chargebacks, or exchanges under any circumstances. Attempting to forcefully chargeback or dispute a payment will result in a permanent, unappealable ban from all VexNetwork services.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>5. Mojang AB Disclaimer</h2>
          <p>VexNetwork is NOT affiliated with, endorsed by, or supported by Mojang AB, Microsoft, or Notch. We are an independent server network.</p>
        </section>

        <section>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>6. Modifications</h2>
          <p>VexNetwork reserves the right to revise these terms at any time without notice. By using this website and server, you agree to be bound by the current version of these Terms and Conditions.</p>
        </section>

      </div>
    </div>
  );
};

export default Terms;
