<template>
  <section class="security-page">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1>Security Commitment</h1>
        <p class="subtitle">
          At Infinity-Booking, we protect your data with enterprise-grade safeguards — so you can focus on your service, not security risks.
        </p>
      </header>

      <!-- Security Practices -->
      <div class="security-content">
        <p>
          We implement rigorous technical and organizational measures to ensure the confidentiality, integrity, and availability of your data across our platform — trusted by providers in Mekelle, Addis Ababa, and beyond.
        </p>

        <div class="security-grid">
          <div class="security-card">
            <div class="icon">🔒</div>
            <h3>Encrypted Data</h3>
            <p>All data in transit and at rest is protected with AES-256 and TLS 1.3 encryption.</p>
          </div>

          <div class="security-card">
            <div class="icon">🛡️</div>
            <h3>Secure Authentication</h3>
            <p>Password-protected accounts with optional two-factor authentication (2FA) for providers.</p>
          </div>

          <div class="security-card">
            <div class="icon">👁️</div>
            <h3>Continuous Monitoring</h3>
            <p>24/7 system monitoring for suspicious activity, DDoS attacks, and anomalies.</p>
          </div>

          <div class="security-card">
            <div class="icon">🧾</div>
            <h3>Access Controls</h3>
            <p>Strict role-based permissions — your data is only visible to authorized users.</p>
          </div>
        </div>

        <div class="compliance-note">
          <p>
            Our infrastructure complies with international best practices and is regularly audited for vulnerabilities.
          </p>
        </div>

        <!-- Report Section -->
        <div class="report-section">
          <h2>Report a Security Issue</h2>
          <p>
            If you discover a potential vulnerability or security concern, please contact us immediately:
          </p>
          <div class="contact-box">
            <p>📧 <strong>hello@infinitybooking.com</strong></p>
            <p class="response-time">We aim to respond within 24 hours.</p>
          </div>
          <p class="note">
            We appreciate responsible disclosure and will work with you to resolve issues promptly.
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
.security-page {
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
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: #cbd5e1;
  max-width: 700px;
  margin: 0 auto;
}

.security-content {
  color: #cbd5e1;
}

.security-content p {
  margin: 1.25rem 0;
  font-size: 1rem;
}

/* Security Grid */
.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.security-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(74, 85, 104, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.security-card:hover {
  transform: translateY(-3px);
  border-color: #4f46e5;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.security-card h3 {
  font-size: 1.125rem;
  color: #c7d2fe;
  margin-bottom: 0.75rem;
}

.security-card p {
  margin: 0;
  font-size: 0.9375rem;
}

/* Compliance Note */
.compliance-note {
  background: rgba(15, 23, 42, 0.5);
  border-left: 3px solid #4ade80;
  padding: 1rem 1.25rem;
  margin: 2rem 0;
  border-radius: 0 8px 8px 0;
}

/* Report Section */
.report-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.report-section h2 {
  font-size: 1.75rem;
  color: #c7d2fe;
  margin-bottom: 1rem;
  text-align: center;
}

.contact-box {
  background: rgba(30, 41, 59, 0.6);
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  margin: 1.5rem 0;
  border: 1px solid rgba(74, 85, 104, 0.4);
}

.contact-box p {
  margin: 0.25rem 0;
}

.response-time {
  font-size: 0.9375rem;
  color: #94a3b8;
  margin-top: 0.5rem;
}

.note {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9375rem;
  margin-top: 1rem;
}

/* Mobile */
@media (max-width: 640px) {
  .security-page {
    padding: 2rem 1rem;
  }
  .page-header h1 {
    font-size: 1.875rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .security-card {
    padding: 1.25rem;
  }
}
</style>