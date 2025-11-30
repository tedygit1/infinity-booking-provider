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
              Alive With Infinity-Booking • Expanding Your Business Globally
            </div>
            <h1 class="hero-title">
              Grow Your Service Business with <span class="highlight">Infinity-Booking</span>
            </h1>
            <p class="hero-subtitle">
              All-in-one platform to manage bookings, accept payments, and grow your client base. 
              Used by 150+ professionals across Home Services, Beauty, and Education sectors.
            </p>

            <div class="hero-buttons">
              <router-link to="/register" class="btn-primary">
                <span class="btn-icon">🚀</span>
                Start Free Trial
              </router-link>
              <a href="#features" class="btn-secondary">
                <span class="btn-icon">📹</span>
                Watch Demo
              </a>
            </div>

            <!-- Social Proof -->
            <div class="social-proof">
              <div class="proof-stats">
                <strong>150+</strong> Service Providers • 
                <strong>1,200+</strong> Monthly Bookings • 
                <strong>98%</strong> Satisfaction Rate
              </div>
              <div class="provider-types">
                <span class="provider-tag">🏠 Home Services</span>
                <span class="provider-tag">💇 Beauty & Salon</span>
                <span class="provider-tag">🎓 Education</span>
              </div>
            </div>
          </div>
          
          <!-- Feature Showcase -->
          <div class="feature-showcase">
            <div class="showcase-card">
              <div class="card-header">
                <h3>Business Growth Dashboard</h3>
                <div class="card-badge">Live Example</div>
              </div>
              <div class="card-content">
                <div class="growth-metric">
                  <div class="metric">
                    <div class="metric-title">Monthly Revenue</div>
                    <div class="metric-value">ETB 45,250</div>
                    <div class="metric-change positive">+18%</div>
                  </div>
                  <div class="metric">
                    <div class="metric-title">New Clients</div>
                    <div class="metric-value">24</div>
                    <div class="metric-change positive">+12%</div>
                  </div>
                </div>
                <div class="feature-highlights">
                  <div class="highlight-item">
                    <span class="highlight-icon">✅</span>
                    <span>Real-time booking notifications</span>
                  </div>
                  <div class="highlight-item">
                    <span class="highlight-icon">📊</span>
                    <span>Automated business reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Everything You Need to Scale</h2>
          <p class="section-subtitle">
            Powerful tools designed specifically for service businesses
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Smart Dashboard</h3>
            <p>Real-time analytics, appointment tracking, and performance insights in one place.</p>
            <ul class="feature-list">
              <li>Revenue reports</li>
              <li>Client analytics</li>
              <li>Performance metrics</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Client Management</h3>
            <p>Automated reminders, client history, and feedback collection system.</p>
            <ul class="feature-list">
              <li>SMS/Email reminders</li>
              <li>Client database</li>
              <li>Review management</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Marketing Tools</h3>
            <p>Promote your services and attract new clients with built-in marketing features.</p>
            <ul class="feature-list">
              <li>Service promotions</li>
              <li>Client referrals</li>
              <li>Social media integration</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Business Protection</h3>
            <p>Secure your business with cancellation policies and dispute resolution.</p>
            <ul class="feature-list">
              <li>Cancellation protection</li>
              <li>Dispute mediation</li>
              <li>Service guarantees</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📞</div>
            <h3>Dedicated Support</h3>
            <p>24/7 customer support in Amharic and English for all your business needs.</p>
            <ul class="feature-list">
              <li>Phone & chat support</li>
              <li>Business consulting</li>
              <li>Technical assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Industries Showcase -->
    <section id="industries" class="industries-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Built for Your Industry</h2>
          <p class="section-subtitle">
            Tailored solutions for different service professionals
          </p>
        </div>

        <div class="industries-grid">
          <div class="industry-card">
            <div class="industry-header">
              <div class="industry-icon">🏠</div>
              <h3>Home Services</h3>
            </div>
            <p>Plumbers, electricians, cleaners, repair technicians</p>
            <div class="industry-features">
              <span>📍 Location-based clients</span>
              <span>🛠️ Service categories</span>
              <span>⏰ Emergency bookings</span>
            </div>
          </div>

          <div class="industry-card">
            <div class="industry-header">
              <div class="industry-icon">💅</div>
              <h3>Beauty & Salon</h3>
            </div>
            <p>Hair stylists, beauticians, spa therapists, nail technicians</p>
            <div class="industry-features">
              <span>💇 Service packages</span>
              <span>⭐ Style portfolios</span>
              <span>📸 Before/after photos</span>
            </div>
          </div>

          <div class="industry-card">
            <div class="industry-header">
              <div class="industry-icon">🎓</div>
              <h3>Education</h3>
            </div>
            <p>Tutors, trainers, coaches, workshop instructors</p>
            <div class="industry-features">
              <span>📚 Course management</span>
              <span>👥 Group sessions</span>
              <span>📝 Progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories Section -->
    <section id="success-stories" class="success-stories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Success Stories from Ethiopian Entrepreneurs</h2>
          <p class="section-subtitle">
            See how service professionals are transforming their businesses
          </p>
        </div>

        <div class="stories-grid">
          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">❝</div>
              <p>"Infinity-Booking helped me grow my cleaning business from 5 to 25 regular clients in just 3 months. The automated reminders reduced no-shows by 80%!"</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">EB</div>
              <div class="author-info">
                <div class="author-name">Elena Berhanu</div>
                <div class="author-business">GreenClean Services</div>
                <div class="author-stats">
                  <span>📈 Revenue increased by 150%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">❝</div>
              <p>"As a tutor, managing multiple students was challenging. Now with Infinity-Booking, I save 10+ hours weekly on scheduling and payment collection."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">DM</div>
              <div class="author-info">
                <div class="author-name">Daniel Mekonnen</div>
                <div class="author-business">Excel Education Center</div>
                <div class="author-stats">
                  <span>🎯 95% client retention rate</span>
                </div>
              </div>
            </div>
          </div>

          <div class="story-card">
            <div class="story-content">
              <div class="quote-icon">❝</div>
              <p>"The platform made everything so easy. My clients love the convenience, and I get to focus on growing my business instead of administrative tasks."</p>
            </div>
            <div class="story-author">
              <div class="author-avatar">ST</div>
              <div class="author-info">
                <div class="author-name">Sara Tesfaye</div>
                <div class="author-business">Glamour Beauty Salon</div>
                <div class="author-stats">
                  <span>💰 2.3x more bookings</span>
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
          <h2 class="cta-title">Start Growing Your Service Business Today</h2>
          <p class="cta-text">Join hundreds of Ethiopian service professionals already scaling their businesses</p>
          
          <div class="cta-features">
            <div class="cta-feature">
              <span class="feature-icon">🎯</span>
              <span>Perfect for Ethiopian market</span>
            </div>
            <div class="cta-feature">
              <span class="feature-icon">🆓</span>
              <span>Free setup and training</span>
            </div>
          </div>

          <div class="cta-actions">
            <router-link to="/register" class="cta-btn primary">
              Start Free Trial - No Credit Card
            </router-link>
            <a href="/demo" class="cta-btn secondary">
              Book a Demo Call
            </a>
          </div>

          <div class="cta-guarantee">
            <span class="guarantee-badge">✅</span>
            <span>30-day money-back guarantee • Amharic & English support • Setup in 10 minutes</span>
          </div>
        </div>
      </div>
    </section>

    <!-- NO FOOTER SECTION - Using your existing separate footer component -->
  </div>
</template>

<style scoped>
/* Your existing CSS styles remain exactly the same */
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

/* Social Proof */
.social-proof {
  margin-top: 32px;
}

.proof-stats {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 12px;
}

.provider-types {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.provider-tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* Feature Showcase */
.feature-showcase {
  display: flex;
  justify-content: center;
}

.showcase-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  width: 100%;
  max-width: 320px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.growth-metric {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.metric {
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-title {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-change.positive {
  color: #10b981;
}

.feature-highlights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #4b5563;
}

.highlight-icon {
  font-size: 1rem;
}

/* ===== NEW SECTIONS STYLES ===== */
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

/* Features */
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

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 4px 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Industries */
.industries-section {
  padding: 80px 0;
  background: #f8fafc;
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.industry-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.industry-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.industry-icon {
  font-size: 2rem;
}

.industry-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.industry-card p {
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.industry-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.industry-features span {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Success Stories */
.success-stories {
  padding: 80px 0;
  background: #f8fafc;
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
  margin-bottom: 4px;
}

.author-stats {
  font-size: 0.8rem;
  color: #059669;
  font-weight: 500;
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

.cta-features {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
  flex-wrap: wrap;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.1rem;
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
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 24px;
}

.guarantee-badge {
  font-size: 1.1rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
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
  
  .provider-types {
    justify-content: center;
  }
  
  .features-grid,
  .industries-grid,
  .stories-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-features {
    flex-direction: column;
    gap: 16px;
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
  
  .cta-title {
    font-size: 1.75rem;
  }
  
  .cta-text {
    font-size: 1rem;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>