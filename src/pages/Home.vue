<!-- src/pages/Home.vue -->
<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="flag">🇪🇹</span> Built for Ethiopian Service Professionals
          </div>
          <h1 class="hero-title">
            Grow Your <span class="highlight">Service Business</span>, Ethiopian-Style
          </h1>
          <p class="hero-subtitle">
            Accept bookings 24/7, get paid instantly via Telebirr & CBE Birr, and manage your business — all in one simple dashboard.
          </p>

          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">150+</div>
              <div class="stat-label">Active Businesses</div>
            </div>
            <div class="stat">
              <div class="stat-number">4.9★</div>
              <div class="stat-label">User Rating</div>
            </div>
            <div class="stat">
              <div class="stat-number">5,200+</div>
              <div class="stat-label">Monthly Bookings</div>
            </div>
          </div>

          <div class="hero-buttons">
            <button @click="goToRegister" class="hero-button primary">
              Start Free Trial (30 Days)
            </button>
            <button @click="goToLogin" class="hero-button secondary">
              Login to Dashboard
            </button>
          </div>

          <div class="trust-badges">
            <span>🔒 Secure • 📱 Mobile-Optimized • 🇪🇹 Ethiopian Support</span>
          </div>
        </div>

        <div class="hero-dashboard">
          <div class="dashboard-preview">
            <div class="dashboard-header">
              <div class="business-info">
                <div class="avatar">A</div>
                <div>
                  <div class="business-name">Addis Beauty Lounge</div>
                  <div class="business-status">📍 Bole, Addis Ababa • <span class="live">● Live</span></div>
                </div>
              </div>
              <div class="dashboard-actions">
                <button class="btn-sm">Settings</button>
              </div>
            </div>

            <div class="dashboard-metrics">
              <div class="metric-card">
                <div class="metric-value">12</div>
                <div class="metric-label">Appointments Today</div>
                <div class="metric-trend up">+3 vs yesterday</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">ETB 8,450</div>
                <div class="metric-label">Revenue Today</div>
                <div class="metric-trend up">+ETB 1,200</div>
              </div>
            </div>

            <div class="dashboard-section-title">Upcoming Appointments</div>
            <div class="upcoming-list">
              <div class="appointment-item">
                <div class="time-badge morning">10:00</div>
                <div class="appointment-details">
                  <div class="client-name">Meseret G.</div>
                  <div class="service">Hair Styling • 60 min</div>
                </div>
                <div class="payment-status paid">
                  <span>✅ Paid</span>
                </div>
              </div>
              <div class="appointment-item">
                <div class="time-badge afternoon">14:00</div>
                <div class="appointment-details">
                  <div class="client-name">Hana M.</div>
                  <div class="service">Manicure • 45 min</div>
                </div>
                <div class="payment-status pending">
                  <span>⏱️ Pending</span>
                </div>
              </div>
              <div class="appointment-item">
                <div class="time-badge evening">16:30</div>
                <div class="appointment-details">
                  <div class="client-name">Samuel K.</div>
                  <div class="service">Beard Trim • 30 min</div>
                </div>
                <div class="payment-status paid">
                  <span>✅ Paid</span>
                </div>
              </div>
            </div>

            <div class="dashboard-footer">
              <span>📱 Mobile dashboard accessible anywhere</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted By Section -->
    <section class="trusted-by-section">
      <div class="container">
        <p class="trusted-by-label">Trusted by leading Ethiopian service businesses</p>
        <div class="logos-grid">
          <div class="logo">Salon</div>
          <div class="logo">Spa</div>
          <div class="logo">Cleaning</div>
          <div class="logo">Tutor</div>
          <div class="logo">Repair</div>
          <div class="logo">Events</div>
        </div>
        <p class="trusted-by-note">Including salons in Addis, cleaning services in Adama, and tutors in Hawassa</p>
      </div>
    </section>

    <!-- Core Platform -->
    <section class="platform-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">All-in-One Platform for Ethiopian Service Providers</h2>
          <p class="section-subtitle">
            Everything you need — built with local payment systems, Amharic support (coming soon), and Ethiopian business workflows in mind.
          </p>
        </div>

        <div class="platform-grid">
          <div class="platform-card">
            <div class="platform-icon bg-blue">📅</div>
            <h3>Smart Booking</h3>
            <p>Share your booking link. Clients book 24/7 — no calls, no missed opportunities.</p>
          </div>
          <div class="platform-card">
            <div class="platform-icon bg-green">💳</div>
            <h3>Local Payments</h3>
            <p>Telebirr, CBE Birr, bank transfer & cash. Payments appear instantly in your dashboard.</p>
          </div>
          <div class="platform-card">
            <div class="platform-icon bg-purple">📱</div>
            <h3>Mobile Dashboard</h3>
            <p>Manage bookings, clients, and revenue — fully responsive on any phone or tablet.</p>
          </div>
          <div class="platform-card">
            <div class="platform-icon bg-amber">📊</div>
            <h3>Business Insights</h3>
            <p>Track peak hours, top services, revenue trends — make smarter decisions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What Users Say -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Real Impact, Real Stories</h2>
          <p class="section-subtitle">
            Hear from Ethiopian entrepreneurs who’ve transformed their businesses.
          </p>
        </div>

        <div class="testimonials-grid">
          <!-- Provider Column -->
          <div class="testimonial-column">
            <div class="column-header">
              <h3 class="column-title">Service Providers</h3>
              <div class="column-badge">💼 Running businesses across 8 cities</div>
            </div>
            <div class="testimonial-cards">
              <div class="testimonial-card provider">
                <div class="testimonial-header">
                  <div class="user-avatar bg-blue">SG</div>
                  <div class="user-info">
                    <div class="user-name">Selam G.</div>
                    <div class="user-meta">
                      <span>Beauty Salon Owner</span> • <span>📍 Addis Ababa</span>
                    </div>
                  </div>
                  <div class="rating">★★★★★</div>
                </div>
                <p class="testimonial-text">
                  "Since joining, I’ve doubled my client base. The Telebirr integration means no more chasing payments — clients pay in seconds. My time is now spent on creativity, not admin."
                </p>
                <div class="testimonial-results">
                  <span class="result">↑ 2x Revenue</span>
                  <span class="result">↓ 12 hrs/week admin</span>
                </div>
              </div>

              <div class="testimonial-card provider">
                <div class="testimonial-header">
                  <div class="user-avatar bg-green">DT</div>
                  <div class="user-info">
                    <div class="user-name">Daniel T.</div>
                    <div class="user-meta">
                      <span>Cleaning Service Founder</span> • <span>📍 Adama</span>
                    </div>
                  </div>
                  <div class="rating">★★★★★</div>
                </div>
                <p class="testimonial-text">
                  "Clients love the professional booking experience — it made us look bigger than we are! Payment reminders reduced late payments to zero. Worth every birr."
                </p>
                <div class="testimonial-results">
                  <span class="result">100% on-time payments</span>
                  <span class="result">+40 new clients in 2 months</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Column -->
          <div class="testimonial-column">
            <div class="column-header">
              <h3 class="column-title">Clients & Customers</h3>
              <div class="column-badge">👥 5,000+ monthly bookings</div>
            </div>
            <div class="testimonial-cards">
              <div class="testimonial-card client">
                <div class="testimonial-header">
                  <div class="user-avatar bg-amber">MG</div>
                  <div class="user-info">
                    <div class="user-name">Meseret G.</div>
                    <div class="user-meta">
                      <span>Regular Client</span> • <span>📍 Bole, Addis</span>
                    </div>
                  </div>
                  <div class="rating">★★★★★</div>
                </div>
                <p class="testimonial-text">
                  "Booking my stylist used to mean 3 phone calls and hoping she’s free. Now I book in 20 seconds, pay with Telebirr, and get reminders. Feels so modern!"
                </p>
                <div class="testimonial-benefits">
                  <span class="benefit">✅ Instant booking</span>
                  <span class="benefit">✅ Telebirr safe & fast</span>
                  <span class="benefit">✅ No-show protection</span>
                </div>
              </div>

              <div class="testimonial-card client">
                <div class="testimonial-header">
                  <div class="user-avatar bg-purple">HM</div>
                  <div class="user-info">
                    <div class="user-name">Hana M.</div>
                    <div class="user-meta">
                      <span>Working Professional</span> • <span>📍 Kirkos, Addis</span>
                    </div>
                  </div>
                  <div class="rating">★★★★★</div>
                </div>
                <p class="testimonial-text">
                  "I use the same platform for my hair, nails, and even home cleaning. It’s reliable, the providers are vetted, and I can see my full booking history. So convenient!"
                </p>
                <div class="testimonial-benefits">
                  <span class="benefit">✅ Trusted providers</span>
                  <span class="benefit">✅ Single dashboard</span>
                  <span class="benefit">✅ Booking history</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="impact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Transform Your Business in 3 Steps</h2>
          <p class="section-subtitle">See how thousands of Ethiopian service professionals are growing</p>
        </div>

        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Register in 2 Minutes</h3>
            <p>Set up your business profile, services, and availability. No tech skills needed.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Share Your Booking Link</h3>
            <p>Post it on Telegram, WhatsApp, Facebook — clients book & pay instantly.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Grow & Scale</h3>
            <p>Use insights to add services, adjust pricing, and expand your team.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Simple, Transparent Pricing</h2>
          <p class="section-subtitle">No hidden fees. Cancel anytime. Ethiopian birr only.</p>
        </div>

        <div class="pricing-cards">
          <div class="pricing-card">
            <div class="plan-header">
              <h3 class="plan-name">Free Trial</h3>
              <div class="plan-badge">ETB 0</div>
            </div>
            <div class="plan-desc">30 days — no card required</div>
            <ul class="plan-features">
              <li>✔️ Up to 50 bookings/month</li>
              <li>✔️ Online booking link</li>
              <li>✔️ SMS & email reminders</li>
              <li>✔️ Basic business dashboard</li>
              <li class="dim">❌ Payment processing (manual only)</li>
            </ul>
            <button @click="goToRegister" class="plan-button">
              Start Free Trial
            </button>
            <div class="plan-note">Perfect for testing & small setups</div>
          </div>

          <div class="pricing-card featured">
            <div class="featured-tag">Most Popular</div>
            <div class="plan-header">
              <h3 class="plan-name">Professional</h3>
              <div class="plan-badge">ETB 299<span>/month</span></div>
            </div>
            <div class="plan-desc">After 30-day free trial</div>
            <ul class="plan-features highlight">
              <li>✔️ <strong>Unlimited bookings</strong></li>
              <li>✔️ <strong>Telebirr & CBE Birr payments</strong></li>
              <li>✔️ <strong>Revenue & client analytics</strong></li>
              <li>✔️ <strong>Staff & team management</strong></li>
              <li>✔️ <strong>Priority Ethiopian support</strong></li>
            </ul>
            <button @click="goToRegister" class="plan-button primary">
              Get Started — Free 30 Days
            </button>
            <div class="plan-note">Best value for growing businesses</div>
          </div>
        </div>

        <div class="pricing-faq">
          <p>❓ <strong>Frequently asked:</strong> 
            <span>Can I downgrade? → Yes, anytime.</span>
            <span>No setup fees. No long contracts.</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">
            Ready to Join Ethiopia’s <span class="highlight">Smart Service Economy</span>?
          </h2>
          <p class="cta-subtitle">
            150+ businesses are already thriving. Your journey starts in 5 minutes — free.
          </p>

          <div class="cta-stats">
            <div class="cta-stat">
              <div class="stat-icon">🇪🇹</div>
              <div>
                <div class="stat-value">100% Ethiopian</div>
                <div class="stat-desc">Built in Addis, for Ethiopia</div>
              </div>
            </div>
            <div class="cta-stat">
              <div class="stat-icon">⏱️</div>
              <div>
                <div class="stat-value">5-Minute Setup</div>
                <div class="stat-desc">No tech expertise needed</div>
              </div>
            </div>
            <div class="cta-stat">
              <div class="stat-icon">🔒</div>
              <div>
                <div class="stat-value">Secure & Private</div>
                <div class="stat-desc">Your data, always protected</div>
              </div>
            </div>
          </div>

          <button @click="goToRegister" class="cta-button">
            ✨ Start My Free Trial — No Card Needed
          </button>

          <p class="cta-footer">
            <span>Questions? We’re here: <strong>support@yourplatform.et</strong> | +251 XXX XXX XXX</span>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToRegister() {
      this.$router.push('/register');
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* =============== Base =============== */
.home {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
}

/* =============== Utilities =============== */
.bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.bg-green { background: linear-gradient(135deg, #10b981, #047857); color: white; }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
.bg-amber { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }

.up { color: #16a34a; }
.down { color: #dc2626; }

/* =============== Typography =============== */
.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
}
.hero-title .highlight {
  background: linear-gradient(135deg, #1e40af, #0c4a6e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #0f172a;
}
.section-subtitle {
  font-size: 1.125rem;
  color: #475569;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

/* =============== Layout =============== */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

/* =============== Hero =============== */
.hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 6rem 0 4rem;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  z-index: 0;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  position: relative;
  z-index: 2;
  align-items: center;
}

.hero-content {
  max-width: 520px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #60a5fa;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  display: block;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.hero-button {
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-button.primary {
  background: white;
  color: #1e40af;
}
.hero-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.hero-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}
.hero-button.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.trust-badges {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 1rem;
}

/* Dashboard Preview */
.hero-dashboard {
  display: flex;
  justify-content: center;
}

.dashboard-preview {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #e2e8f0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  background: #e2e8f0;
  color: #475569;
}

.business-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.business-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #0f172a;
}

.business-status {
  font-size: 0.875rem;
  color: #64748b;
}

.business-status .live {
  color: #10b981;
  font-weight: 500;
}

.dashboard-actions .btn-sm {
  background: #f1f5f9;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #475569;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.25rem 0;
}

.metric-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 600;
}

.dashboard-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin: 1.5rem 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.9rem;
}

.time-badge {
  min-width: 2.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
}
.morning { background: #dbeafe; color: #1d4ed8; }
.afternoon { background: #fef3c7; color: #d97706; }
.evening { background: #dcfce7; color: #16a34a; }

.appointment-details {
  flex: 1;
}

.client-name {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.125rem;
}

.service {
  color: #64748b;
  font-size: 0.85rem;
}

.payment-status {
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.paid { background: #dcfce7; color: #16a34a; }
.pending { background: #fef3c7; color: #d97706; }

.dashboard-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
}

/* =============== Trusted By =============== */
.trusted-by-section {
  padding: 3rem 0;
  background: white;
  text-align: center;
}

.trusted-by-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.logos-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1.5rem 0;
}

.logo {
  background: #f1f5f9;
  color: #475569;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  min-width: 100px;
}

.trusted-by-note {
  color: #64748b;
  font-size: 0.95rem;
  max-width: 600px;
  margin: 0 auto;
}

/* =============== Platform =============== */
.platform-section {
  padding: 5rem 0;
  background: #f1f5f9;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
  max-width: 1000px;
  margin: 0 auto;
}

.platform-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}
.platform-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.platform-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.75rem;
}

.platform-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.platform-card p {
  color: #475569;
  margin: 0;
}

/* =============== Testimonials =============== */
.testimonials-section {
  padding: 5rem 0;
  background: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.column-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.column-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.column-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
}

.testimonial-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}
.testimonial-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.testimonial-card.provider {
  border-top: 4px solid #3b82f6;
}
.testimonial-card.client {
  border-top: 4px solid #10b981;
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.user-meta {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  gap: 0.5rem;
}

.rating {
  color: #fbbf24;
  font-size: 1rem;
  white-space: nowrap;
}

.testimonial-text {
  font-style: italic;
  color: #334155;
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.testimonial-results,
.testimonial-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.result,
.benefit {
  background: #f1f5f9;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}
.result { color: #1e40af; }
.benefit { color: #059669; }

/* =============== Impact =============== */
.impact-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.step {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.step-number {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0 auto 1.25rem;
}

.step h3 {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.step p {
  color: #475569;
  margin: 0;
}

/* =============== Pricing =============== */
.pricing-section {
  padding: 5rem 0;
  background: white;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.featured {
  border-color: #3b82f6;
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1);
}

.featured-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 0.375rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
}

.plan-header {
  margin-bottom: 1rem;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.plan-badge {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0.5rem 0;
  color: #0f172a;
}
.plan-badge span {
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
}

.plan-desc {
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  text-align: left;
}
.plan-features li {
  padding: 0.5rem 0;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.plan-features li.dim {
  color: #94a3b8;
}
.plan-features.highlight li {
  font-weight: 500;
}

.plan-button {
  width: 100%;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}
.plan-button.primary {
  background: #3b82f6;
  color: white;
}
.plan-button:not(.primary) {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.plan-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.plan-note {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 1rem;
}

.pricing-faq {
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}
.pricing-faq span {
  margin-left: 1rem;
}

/* =============== CTA =============== */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #0c4a6e 100%);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}
.cta-title .highlight {
  color: #93c5fd;
}

.cta-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.cta-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.cta-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 1.75rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.stat-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

.cta-button {
  background: white;
  color: #0c4a6e;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}
.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cta-footer {
  margin-top: 2rem;
  font-size: 0.9rem;
  opacity: 0.9;
}
.cta-footer strong {
  color: #93c5fd;
}

/* =============== Responsive =============== */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-content {
    max-width: 100%;
  }
  .hero-stats {
    justify-content: center;
  }
  .dashboard-preview {
    max-width: 450px;
    margin: 0 auto;
  }
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0 3rem;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .hero-buttons {
    flex-direction: column;
  }
  .platform-grid,
  .steps-container,
  .pricing-cards,
  .cta-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  .section-title {
    font-size: 1.75rem;
  }
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .dashboard-actions {
    width: 100%;
  }
  .testimonials-grid,
  .pricing-cards {
    gap: 1.5rem;
  }
  .pricing-card {
    padding: 2rem 1.5rem;
  }
}
</style>