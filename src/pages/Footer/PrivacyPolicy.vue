<template>
  <section class="privacy-policy-page">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: January 2025</p>
      </header>

      <div class="content">
        <p>
          Infinity-Booking is committed to protecting your privacy and personal data. This policy explains how we collect, use, and safeguard your information when you use our platform as a customer or service provider in Ethiopia and beyond.
        </p>

        <section class="policy-section">
          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information to deliver and improve our services:</p>
          <ul>
            <li><strong>Personal details:</strong> Name, email address, phone number, and location (e.g., Mekelle, Addis Ababa)</li>
            <li><strong>Account information:</strong> Profile photo, service category, bio, pricing, and verification documents</li>
            <li><strong>Booking data:</strong> Session history, payment records, messages, and reviews</li>
            <li><strong>Technical data:</strong> IP address, browser type, device information, and usage logs</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>Your data is used strictly for the following purposes:</p>
          <ul>
            <li>To enable bookings between customers and providers</li>
            <li>To process payments and payouts (e.g., via Telebirr or CBE Birr)</li>
            <li>To verify your identity and service credentials</li>
            <li>To send service-related notifications (e.g., booking confirmations, reminders)</li>
            <li>To improve platform performance, security, and user experience</li>
            <li>To comply with legal obligations under Ethiopian law</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. Data Protection</h2>
          <p>
            We implement industry-standard security measures, including encryption, access controls, and regular audits, to protect your data against unauthorized access, loss, or misuse. All data is stored securely within compliant cloud infrastructure.
          </p>
        </section>

        <section class="policy-section">
          <h2>4. Sharing of Information</h2>
          <p>
            We do <strong>not sell or rent</strong> your personal data. Information may only be shared in the following cases:
          </p>
          <ul>
            <li>With trusted third-party service providers (e.g., payment processors, cloud hosting) who assist in platform operations</li>
            <li>When required by law, regulation, or legal process in Ethiopia or your jurisdiction</li>
            <li>With your explicit consent for specific purposes</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>5. Your Rights</h2>
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul>
            <li>Access, correct, or update your personal information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent (where processing is based on consent)</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p>
            To exercise these rights, log in to your account or contact us directly.
          </p>
        </section>

        <section class="policy-section">
          <h2>6. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Officer:
          </p>
          <div class="contact-info">
            <p>📧 <strong>hello@infinitybooking.com</strong></p>
            <p>📍 Addis Ababa, Ethiopia</p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
// Pure presentational component — no logic needed
</script>

<style scoped>
.privacy-policy-page {
  background: #0f172a;
  color: #e2e8f0;
  padding: 3rem 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.last-updated {
  font-size: 0.9375rem;
  color: #94a3b8;
  margin: 0;
}

.content {
  color: #cbd5e1;
}

.content p {
  margin: 1rem 0;
  font-size: 1rem;
}

.policy-section {
  margin: 2.5rem 0;
}

.policy-section h2 {
  font-size: 1.5rem;
  color: #c7d2fe;
  margin: 1.5rem 0 1rem;
  font-weight: 600;
}

ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.625rem;
  position: relative;
}

li::before {
  content: '•';
  color: #818cf8;
  font-weight: bold;
  position: absolute;
  left: -1.25rem;
}

strong {
  color: #e0e7ff;
}

.contact-info {
  background: rgba(30, 41, 59, 0.5);
  padding: 1.25rem;
  border-radius: 12px;
  border-left: 3px solid #4f46e5;
  margin-top: 1rem;
}

/* Mobile */
@media (max-width: 640px) {
  .privacy-policy-page {
    padding: 2rem 1rem;
  }
  .page-header h1 {
    font-size: 1.875rem;
  }
  .policy-section {
    margin: 2rem 0;
  }
}
</style>