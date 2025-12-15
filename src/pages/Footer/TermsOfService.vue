<template>
  <section class="terms-page">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last updated: January 2025</p>
      </header>

      <div class="content">
        <p>
          By accessing or using Infinity-Booking (“the Platform”), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
        </p>

        <section class="terms-section">
          <h2>1. Use of the Platform</h2>
          <p>
            Infinity-Booking provides a digital marketplace connecting service providers and customers in Ethiopia and beyond. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Use the platform only for lawful purposes and in good faith</li>
            <li>Not misuse the platform (e.g., spam, fraud, automated scraping)</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>2. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Treating other users with respect and professionalism</li>
            <li>Complying with applicable laws in Ethiopia and your jurisdiction</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>3. Provider Obligations</h2>
          <p>If you are a service provider, you agree to:</p>
          <ul>
            <li>Deliver services as described in your profile</li>
            <li>Honor confirmed bookings unless mutually cancelled</li>
            <li>Not solicit payments outside the platform</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>4. Fees and Payments</h2>
          <p>
            Infinity-Booking may charge service fees, which will be clearly displayed before checkout. All payments are processed securely via approved Ethiopian payment methods (e.g., Telebirr, CBE Birr).
          </p>
        </section>

        <section class="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Infinity-Booking shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform — including loss of profits, data, or business opportunities.
          </p>
        </section>

        <section class="terms-section">
          <h2>6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account immediately if you:
          </p>
          <ul>
            <li>Breach these Terms of Service</li>
            <li>Engage in fraudulent or harmful behavior</li>
            <li>Violate the rights of other users</li>
          </ul>
          <p>
            You may also deactivate your account at any time through your settings.
          </p>
        </section>

        <section class="terms-section">
          <h2>7. Changes to These Terms</h2>
          <p>
            We may update these terms periodically. Continued use after changes constitutes acceptance. We’ll notify users of material changes via email or in-app alerts.
          </p>
        </section>

        <section class="terms-section">
          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any disputes will be subject to the exclusive jurisdiction of courts in Addis Ababa.
          </p>
        </section>

        <div class="contact-notice">
          <h2>Questions?</h2>
          <p>
            Contact us at <strong>hello@infinitybooking.com</strong> for clarification on these terms.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Pure presentational component
</script>

<style scoped>
.terms-page {
  background: #0f172a;
  color: #e2e8f0;
  padding: 3rem 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 850px;
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

.terms-section {
  margin: 2.5rem 0;
}

.terms-section h2 {
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

.contact-notice {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.contact-notice h2 {
  font-size: 1.75rem;
  color: #c7d2fe;
  margin-bottom: 0.75rem;
}

/* Mobile */
@media (max-width: 640px) {
  .terms-page {
    padding: 2rem 1rem;
  }
  .page-header h1 {
    font-size: 1.875rem;
  }
  .terms-section {
    margin: 2rem 0;
  }
}
</style>