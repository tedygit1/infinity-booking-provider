<template>
  <section class="pricing-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Simple, Transparent Pricing</h1>
        <p>
          Choose the plan that fits your service business — from solo providers in Mekelle to growing teams across Ethiopia.
        </p>
      </div>

      <!-- Pricing Tiers -->
      <div class="pricing-grid">
        <!-- Free Plan -->
        <div class="pricing-card">
          <div class="card-header">
            <h2>Free Plan</h2>
            <div class="price">ETB 0<span>/month</span></div>
          </div>
          <p class="card-description">Perfect for getting started</p>
          <ul class="features">
            <li>Basic provider profile</li>
            <li>Up to 5 bookings per month</li>
            <li>Email support (48h response)</li>
            <li>Standard visibility in search</li>
            <li>Manual availability management</li>
          </ul>
          <router-link to="/login" class="cta-button cta-outline">
            Get Started
          </router-link>
        </div>

        <!-- Professional Plan -->
        <div class="pricing-card featured">
          <div class="popular-badge">Most Popular</div>
          <div class="card-header">
            <h2>Professional</h2>
            <div class="price">ETB 1000<span>/month</span></div>
          </div>
          <p class="card-description">For serious providers</p>
          <ul class="features">
            <li>Unlimited bookings</li>
            <li>Advanced analytics dashboard</li>
            <li>Priority support (24h response)</li>
            <li>Boosted profile visibility</li>
            <li>Automated availability sync</li>
            <li>Customer messaging inbox</li>
            <li>ETB payout via Telebirr / CBE Birr</li>
          </ul>
          <router-link to="/login" class="cta-button">
            Start Free Trial
          </router-link>
        </div>

        <!-- Enterprise -->
        <div class="pricing-card">
          <div class="card-header">
            <h2>Enterprise</h2>
            <div class="price">Custom</div>
          </div>
          <p class="card-description">For agencies & organizations</p>
          <ul class="features">
            <li>Custom booking workflows</li>
            <li>Team member accounts</li>
            <li>API access & integrations</li>
            <li>Dedicated account manager</li>
            <li>White-label options</li>
            <li>On-premise deployment (optional)</li>
            <li>Local compliance support</li>
          </ul>
          <a href="mailto:hello@infinitybooking.com" class="cta-button cta-outline">
            Contact Sales
          </a>
        </div>
      </div>

      <!-- FAQ -->
      
      
    </div>
  </section>
</template>

<script setup>
// No script logic needed — pure presentational component
</script>

<style scoped>
.pricing-page {
  background: #0f172a;
  color: #e2e8f0;
  padding: 3rem 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  font-size: 1.125rem;
  color: #cbd5e1;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Pricing Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.pricing-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(74, 85, 104, 0.4);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.pricing-card:hover {
  border-color: #4f46e5;
  transform: translateY(-4px);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.card-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #c7d2fe;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #a5b4fc;
  margin-bottom: 1rem;
}

.price span {
  font-size: 1rem;
  color: #94a3b8;
}

.card-description {
  color: #94a3b8;
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
}

.features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.75rem;
  text-align: left;
}

.features li {
  padding: 0.5rem 0;
  color: #e2e8f0;
  position: relative;
  padding-left: 1.5rem;
}

.features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0.5rem;
  color: #4ade80;
  font-weight: bold;
}

/* CTA Buttons */
.cta-button {
  display: inline-block;
  width: 100%;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cta-button.cta-outline {
  background: transparent;
  border: 2px solid #4f46e5;
  color: #a5b4fc;
}

.cta-button.cta-outline:hover {
  background: rgba(79, 70, 229, 0.15);
}

.cta-button:not(.cta-outline) {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.cta-button:not(.cta-outline):hover {
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.6);
  transform: translateY(-2px);
}

/* FAQ Section */
.faq-section {
  max-width: 800px;
  margin: 0 auto;
}

.faq-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #c7d2fe;
}

.faq-list {
  display: grid;
  gap: 1rem;
}

.faq-item h3 {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: #cbd5e1;
}

.faq-item p {
  color: #94a3b8;
  font-size: 0.9375rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .pricing-page {
    padding: 2rem 1rem;
  }
  .header h1 {
    font-size: 2rem;
  }
  .price {
    font-size: 1.75rem;
  }
}
</style>