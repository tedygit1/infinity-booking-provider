<!-- src/pages/HomePage.vue -->
<template>
  <div class="home font-poppins">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-logo">
            <span class="logo-icon">∞</span>
            <span class="logo-text">Infinity-Booking</span>
          </div>
          <div class="nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#industries" class="nav-link">Industries</a>
            <a href="#pricing" class="nav-link">Pricing</a>
            <a href="#success-stories" class="nav-link">Success Stories</a>
          </div>
          <div class="nav-actions">
            <router-link to="/login" class="nav-login">Login</router-link>
            <router-link to="/register" class="nav-register">Get Started</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Enhanced Hero Section -->
    <section id="hero" class="hero">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <span class="live-dot"></span>
              Live with Infinity-Booking • Grow Your Service Business
            </div>
            <h1 class="hero-title">
              Manage Your Service Business <span class="highlight">Smarter & Faster</span>
            </h1>
            <p class="hero-subtitle">
              All-in-one platform designed for Ethiopian service professionals to manage appointments, 
              accept payments, and connect with clients. Simple, powerful, and made for you.
            </p>

            <div class="hero-buttons">
              <router-link to="/register" class="btn-primary">
                <span class="btn-icon">🚀</span>
                Start Free Trial
              </router-link>
              <a href="#features" class="btn-secondary">
                <span class="btn-icon">📹</span>
                Watch Demo (3 min)
              </a>
            </div>

            <!-- Social Proof - Made more user-friendly -->
            <div class="social-proof">
              <div class="proof-stats">
                <div class="stat-item">
                  <strong>150+</strong>
                  <span>Service Providers</span>
                </div>
                <div class="stat-item">
                  <strong>1,200+</strong>
                  <span>Monthly Bookings</span>
                </div>
                <div class="stat-item">
                  <strong>98%</strong>
                  <span>Satisfaction Rate</span>
                </div>
              </div>
              <div class="provider-types">
                <span class="provider-tag">🏠 Home Services</span>
                <span class="provider-tag">💇 Beauty & Salon</span>
                <span class="provider-tag">🎓 Education</span>
                <span class="provider-tag">🏢 Business Services</span>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Feature Showcase - More informative -->
          <div class="feature-showcase">
            <div class="showcase-card">
              <div class="card-header">
                <h3>Your Business Dashboard</h3>
                <div class="card-badge">Live Preview</div>
              </div>
              <div class="card-content">
                <div class="dashboard-preview">
                  <div class="preview-header">
                    <div class="business-info">
                      <div class="business-name">Sample Beauty Salon</div>
                      <div class="business-status">📍 Addis Ababa • 🟢 Active</div>
                    </div>
                  </div>
                  
                  <!-- Enhanced metrics with clear explanations -->
                  <div class="growth-metrics">
                    <div class="metric-card">
                      <div class="metric-icon">💰</div>
                      <div class="metric-details">
                        <div class="metric-title">Monthly Earnings</div>
                        <div class="metric-value">ETB 45,250</div>
                        <div class="metric-desc">From 120+ appointments</div>
                      </div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-icon">👥</div>
                      <div class="metric-details">
                        <div class="metric-title">New Clients This Month</div>
                        <div class="metric-value">24</div>
                        <div class="metric-desc">+12% from last month</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Key features shown as benefits -->
                  <div class="business-benefits">
                    <h4>Key Benefits You Get:</h4>
                    <div class="benefit-item">
                      <span class="benefit-icon">🔔</span>
                      <div class="benefit-text">
                        <strong>Real-time Notifications</strong>
                        <small>Never miss a booking</small>
                      </div>
                    </div>
                    <div class="benefit-item">
                      <span class="benefit-icon">📊</span>
                      <div class="benefit-text">
                        <strong>Smart Reports</strong>
                        <small>See what's working</small>
                      </div>
                    </div>
                    <div class="benefit-item">
                      <span class="benefit-icon">💳</span>
                      <div class="benefit-text">
                        <strong>Easy Payments</strong>
                        <small>Accept all payment types</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid - More benefit-oriented -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Everything You Need to Grow</h2>
          <p class="section-subtitle">
            Powerful tools made simple for service businesses
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Smart Booking System</h3>
            <p>Let clients book 24/7 from your website, social media, or directly in the app.</p>
            <ul class="feature-benefits">
              <li>Online booking anytime</li>
              <li>Automatic reminders</li>
              <li>Calendar sync</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Easy Payments</h3>
            <p>Accept mobile money, bank transfers, and cash with automatic tracking.</p>
            <ul class="feature-benefits">
              <li>CBE Birr, Telebirr</li>
              <li>Payment tracking</li>
              <li>Automatic receipts</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Client Management</h3>
            <p>Keep all client info, history, and preferences in one organized place.</p>
            <ul class="feature-benefits">
              <li>Client profiles</li>
              <li>Service history</li>
              <li>Special notes</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Business Insights</h3>
            <p>See which services are most popular and when you're busiest.</p>
            <ul class="feature-benefits">
              <li>Best-selling services</li>
              <li>Busy hours report</li>
              <li>Revenue trends</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Marketing Tools</h3>
            <p>Simple ways to attract more clients and keep them coming back.</p>
            <ul class="feature-benefits">
              <li>Special offers</li>
              <li>Client referrals</li>
              <li>Reminder messages</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Business Protection</h3>
            <p>Professional features to protect your time and income.</p>
            <ul class="feature-benefits">
              <li>No-show protection</li>
              <li>Cancelation policies</li>
              <li>Service agreements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - New -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How Infinity-Booking Works</h2>
          <p class="section-subtitle">
            Get started in 3 simple steps
          </p>
        </div>
        
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Create Your Profile</h3>
              <p>Add your services, prices, and availability. Takes 10 minutes.</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Share Your Booking Link</h3>
              <p>Add it to your WhatsApp, Facebook, or website.</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Start Accepting Bookings</h3>
              <p>Manage appointments and grow your business.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Simple, Transparent Pricing</h2>
          <p class="section-subtitle">
            No hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div class="pricing-cards">
          <div class="pricing-card">
            <div class="plan-header">
              <h3>Starter</h3>
              <div class="price">Free</div>
              <p class="plan-desc">Perfect for trying it out</p>
            </div>
            <ul class="plan-features">
              <li>✅ Up to 20 bookings/month</li>
              <li>✅ Basic scheduling</li>
              <li>✅ Client management</li>
              <li>❌ Advanced reports</li>
              <li>❌ Payment processing</li>
            </ul>
            <router-link to="/register" class="plan-button">
              Start Free
            </router-link>
          </div>
          
          <div class="pricing-card featured">
            <div class="plan-badge">Most Popular</div>
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="price">ETB 299<span>/month</span></div>
              <p class="plan-desc">For growing businesses</p>
            </div>
            <ul class="plan-features">
              <li>✅ Unlimited bookings</li>
              <li>✅ All scheduling features</li>
              <li>✅ Full client management</li>
              <li>✅ Business insights</li>
              <li>✅ Payment processing</li>
            </ul>
            <router-link to="/register" class="plan-button primary">
              Start 14-Day Trial
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories Section - Enhanced -->
    <section id="success-stories" class="success-stories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Trusted by Ethiopian Business Owners</h2>
          <p class="section-subtitle">
            Real stories from real people
          </p>
        </div>

        <div class="stories-grid">
          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"Before Infinity-Booking, I spent hours on the phone scheduling appointments. Now clients book online, and I get instant notifications. It changed how I run my business."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">EB</div>
              <div class="author-info">
                <div class="author-name">Elena Berhanu</div>
                <div class="author-business">GreenClean Services</div>
                <div class="author-results">
                  <span>⏱️ Saves 15 hours/week</span>
                  <span>📈 40% more clients</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"My clients love how easy it is to book and pay. I love how organized everything is. The automatic reminders alone have saved me so much time."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">DM</div>
              <div class="author-info">
                <div class="author-name">Daniel Mekonnen</div>
                <div class="author-business">Excel Education Center</div>
                <div class="author-results">
                  <span>💰 Payments on time</span>
                  <span>⭐ 4.9/5 client rating</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">"</div>
              <p>"The reports helped me understand which services are most popular. I adjusted my schedule and increased my income by 60% in three months."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">ST</div>
              <div class="author-info">
                <div class="author-name">Sara Tesfaye</div>
                <div class="author-business">Glamour Beauty Salon</div>
                <div class="author-results">
                  <span>📊 Better scheduling</span>
                  <span>💸 Higher income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Grow Your Business?</h2>
          <p class="cta-text">Join hundreds of service professionals who are already saving time and earning more</p>
          
          <div class="cta-benefits">
            <div class="benefit-card">
              <span class="benefit-icon">🎯</span>
              <div>
                <strong>Made for Ethiopia</strong>
                <small>Local payment methods, Amharic support</small>
              </div>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">🆓</span>
              <div>
                <strong>Free Setup Help</strong>
                <small>We'll help you get started</small>
              </div>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">📱</span>
              <div>
                <strong>Works Everywhere</strong>
                <small>Phone, tablet, computer</small>
              </div>
            </div>
          </div>

          <div class="cta-actions">
            <router-link to="/register" class="cta-btn primary">
              Start Free Trial - No Credit Card Needed
            </router-link>
            <a href="/demo" class="cta-btn secondary">
              📞 Book a Demo Call
            </a>
          </div>

          <div class="cta-guarantee">
            <div class="guarantee-item">
              <span>✅</span>
              <span>30-day free trial</span>
            </div>
            <div class="guarantee-item">
              <span>✅</span>
              <span>Amharic & English support</span>
            </div>
            <div class="guarantee-item">
              <span>✅</span>
              <span>Setup in 10 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NO FOOTER SECTION - Using your existing separate footer component -->
  </div>
</template>

<style scoped>
/* ===== BASE STYLES ===== */
.home {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #1a1a1a;
  line-height: 1.5;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== NAVIGATION ===== */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #667eea;
}

.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-login {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 16px;
}

.nav-register {
  background: #667eea;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-register:hover {
  background: #5a6fd8;
}

/* ===== ENHANCED HERO SECTION ===== */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0 80px;
  margin-top: 60px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 20px;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

.highlight {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 24px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  margin: 24px 0;
}

.btn-primary {
  background: white;
  color: #667eea;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Enhanced Social Proof */
.social-proof {
  margin-top: 32px;
}

.proof-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item strong {
  font-size: 1.5rem;
  display: block;
}

.stat-item span {
  font-size: 0.8rem;
  opacity: 0.8;
}

.provider-types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.provider-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* Enhanced Feature Showcase */
.feature-showcase {
  display: flex;
  justify-content: center;
}

.showcase-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  width: 100%;
  max-width: 360px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.card-badge {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.dashboard-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.business-name {
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a1a;
}

.business-status {
  font-size: 0.8rem;
  color: #6b7280;
}

.growth-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-icon {
  font-size: 1.5rem;
}

.metric-details {
  flex: 1;
}

.metric-title {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.metric-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.business-benefits {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 8px;
}

.business-benefits h4 {
  font-size: 0.9rem;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.benefit-icon {
  font-size: 1.2rem;
}

.benefit-text {
  display: flex;
  flex-direction: column;
}

.benefit-text strong {
  font-size: 0.85rem;
  color: #1a1a1a;
}

.benefit-text small {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ===== SECTIONS ===== */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
}

/* Features Grid */
.features-section {
  padding: 80px 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.feature-card p {
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.feature-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-benefits li {
  padding: 4px 0;
  color: #6b7280;
  font-size: 0.9rem;
  position: relative;
  padding-left: 20px;
}

.feature-benefits li:before {
  content: "•";
  color: #667eea;
  position: absolute;
  left: 0;
}

/* How It Works */
.how-it-works {
  padding: 80px 0;
  background: white;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 200px;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.step-content h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.step-content p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.step-arrow {
  font-size: 1.5rem;
  color: #667eea;
  opacity: 0.5;
}

/* Pricing */
.pricing-section {
  padding: 80px 0;
  background: #f8fafc;
}

.pricing-cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.pricing-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  position: relative;
}

.pricing-card.featured {
  border: 2px solid #667eea;
  transform: scale(1.05);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.plan-header {
  text-align: center;
  margin-bottom: 24px;
}

.plan-header h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.price span {
  font-size: 1rem;
  color: #6b7280;
}

.plan-desc {
  color: #6b7280;
  font-size: 0.9rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.plan-features li {
  padding: 8px 0;
  color: #6b7280;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.plan-button {
  display: block;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  background: #f3f4f6;
  color: #4b5563;
  transition: all 0.2s;
}

.plan-button.primary {
  background: #667eea;
  color: white;
}

.plan-button:hover {
  transform: translateY(-2px);
}

/* Success Stories */
.success-stories {
  padding: 80px 0;
  background: white;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.story-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.story-card:hover {
  transform: translateY(-4px);
}

.story-content {
  position: relative;
  margin-bottom: 24px;
}

.quote-icon {
  font-size: 3rem;
  color: #667eea;
  opacity: 0.2;
  position: absolute;
  top: -10px;
  left: -10px;
}

.story-content p {
  font-style: italic;
  color: #4b5563;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
}

.story-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

.author-business {
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.author-results {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.author-results span {
  font-size: 0.8rem;
  color: #059669;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Enhanced Final CTA */
.final-cta {
  background: linear-gradient(135deg, #1a1a1a, #374151);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.cta-text {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-benefits {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
  flex-wrap: wrap;
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 8px;
  min-width: 200px;
}

.benefit-icon {
  font-size: 1.5rem;
}

.benefit-card strong {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.benefit-card small {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 32px 0;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 16px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  display: inline-block;
}

.cta-btn.primary {
  background: #667eea;
  color: white;
}

.cta-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.cta-guarantee {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 24px;
  flex-wrap: wrap;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===== ENHANCED MOBILE RESPONSIVENESS ===== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 40px;
  }
  
  .step-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .hero {
    padding: 100px 0 60px;
    margin-top: 50px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .proof-stats {
    justify-content: center;
  }
  
  .provider-types {
    justify-content: center;
  }
  
  .features-grid,
  .pricing-cards,
  .stories-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .cta-benefits {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .benefit-card {
    width: 100%;
    max-width: 300px;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
  
  .cta-guarantee {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .nav-actions {
    gap: 8px;
  }
  
  .nav-login, .nav-register {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .story-author {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .author-info {
    text-align: center;
  }
  
  .author-results {
    justify-content: center;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
  
  .cta-text {
    font-size: 1rem;
  }
  
  .showcase-card {
    margin: 0 -12px;
    border-radius: 0;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .feature-card,
  .story-card,
  .pricing-card,
  .cta-btn,
  .btn-primary,
  .btn-secondary {
    transition: none;
  }
  
  .feature-card:hover,
  .story-card:hover,
  .pricing-card:hover {
    transform: none;
  }
  
  .cta-btn.primary:hover,
  .cta-btn.secondary:hover,
  .btn-primary:hover,
  .btn-secondary:hover {
    transform: none;
  }
  
  /* Larger tap targets for mobile */
  .nav-link,
  .nav-login,
  .nav-register {
    padding: 12px 16px;
  }
  
  .feature-benefits li,
  .plan-features li {
    padding: 12px 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>