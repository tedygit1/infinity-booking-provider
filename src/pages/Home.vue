<!-- src/pages/HomePage.vue -->
<template>
  <div class="home font-poppins">
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">🚀 Now Live in Ethiopia & Expanding Globally</div>
        <h1 class="hero-title">
          Streamline Your Service Business with <span class="highlight">Infinity-Booking</span>
        </h1>
        <p class="hero-subtitle">
          The comprehensive platform designed exclusively for <strong>service providers</strong> to manage bookings, 
          process payments, and drive business growth — all through one intuitive dashboard.  
          Join thousands of established professionals across <strong>Home Services</strong>, 
          <strong>Beauty & Salon</strong>, and <strong>Education</strong> sectors.
        </p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn-primary">✨ Register as Service Provider</router-link>
          <router-link to="/explore" class="btn-secondary">🔍 Explore Available Services</router-link>
        </div>
        <div class="hero-trust">
          <span>Trusted by 150+ professional providers across 12 major cities</span>
          <div class="trust-badges">
            <img src="https://cdn-icons-png.flaticon.com/512/1181/1181468.png" alt="Secure Platform" />
            <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Verified Providers" />
            <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="24/7 Dedicated Support" />
          </div>
        </div>
      </div>
      <div class="hero-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Professional Providers" />
            </div>
            <div class="stat-number">150+</div>
            <div class="stat-label">Verified Providers</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Service Listings" />
            </div>
            <div class="stat-number">500+</div>
            <div class="stat-label">Professional Services</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2972/2972133.png" alt="Completed Bookings" />
            </div>
            <div class="stat-number">1,200+</div>
            <div class="stat-label">Successful Bookings</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="Customer Satisfaction" />
            </div>
            <div class="stat-number">98%</div>
            <div class="stat-label">Client Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Overview -->
    <section class="overview-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">One Unified Platform. Unlimited Business Potential.</h2>
          <p class="section-subtitle">
            Infinity-Booking transcends traditional booking applications — we provide a complete business 
            ecosystem engineered to scale alongside your enterprise growth.
          </p>
        </div>
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png" alt="Business Intelligence Dashboard" />
            </div>
            <h3>Intelligent Business Dashboard</h3>
            <p>Comprehensive management of schedules, client relationships, revenue analytics, and performance reviews in a single interface. Includes real-time business intelligence.</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2681/2681155.png" alt="Payment Processing" />
            </div>
            <h3>Multi-Channel Payment Solutions</h3>
            <p>Seamlessly accept payments through <strong>Telebirr</strong>, CBE Birr, with upcoming integrations for PayPal, international cards, and mobile money platforms.</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Business Growth" />
            </div>
            <h3>Strategic Client Acquisition</h3>
            <p>Expand your customer base through our sophisticated recommendation algorithms and optimized local search visibility.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Strategic Advantages for Professional Providers</h2>
          <p class="section-subtitle">
            We address critical business challenges — enabling you to concentrate on delivering exceptional service quality.
          </p>
        </div>
        <div class="benefits-grid">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="benefit-card"
          >
            <div class="benefit-icon">
              <img :src="benefit.icon" :alt="benefit.title" loading="lazy" />
            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Secure Booking Flow -->
    <section class="booking-flow-section">
      <div class="container">
        <div class="flow-content">
          <h2 class="flow-title">Enterprise-Grade Security & Reliability</h2>
          <p class="flow-subtitle">
            Every transaction is protected with bank-level encryption, identity verification protocols, and guaranteed payment security.
          </p>
          <ul class="flow-list">
            <li>🔒 <strong>Verified Professional Network</strong> – All providers undergo comprehensive business and identity verification.</li>
            <li>💸 <strong>Accelerated Payment Processing</strong> – Receive funds within 24 hours following service completion.</li>
            <li>📅 <strong>Automated Communication System</strong> – Intelligent SMS and email confirmations for optimal client coordination.</li>
            <li>🛡️ <strong>Professional Dispute Mediation</strong> – Equitable, expert-reviewed resolution for exceptional service assurance.</li>
          </ul>
          <div class="flow-visual">
            <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="Enterprise Security" />
          </div>
        </div>
      </div>
    </section>

    <!-- Industries Section -->
    <section class="industries-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Serving Premier Service Industries</h2>
          <p class="section-subtitle">
            We're pioneering the future of professional service booking across multiple high-demand sectors
          </p>
        </div>
        <div class="industries-grid">
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/869/869636.png" alt="Professional Home Services" />
            </div>
            <h3>Home Services</h3>
            <p>Comprehensive plumbing, electrical, professional cleaning, maintenance and repair services</p>
          </div>
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3082/3082405.png" alt="Beauty & Salon Professionals" />
            </div>
            <h3>Beauty & Salon</h3>
            <p>Expert hair styling, premium beauty treatments, luxury spa services and personal care</p>
          </div>
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Education Professionals" />
            </div>
            <h3>Education & Tutoring</h3>
            <p>Professional tutoring, skill development programs, specialized workshops and training sessions</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">
            Comprehensive information to support your business decisions.
          </p>
        </div>
        <div class="faq-grid">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
          >
            <h3 class="faq-question">{{ faq.question }}</h3>
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Professional Endorsements</h2>
          <p class="section-subtitle">
            Authentic success stories from service professionals who have transformed their business operations.
          </p>
        </div>
        <div class="testimonials-grid">
          <div
            v-for="(item, index) in testimonials"
            :key="index"
            class="testimonial-card"
          >
            <div class="quote-mark">"</div>
            <p class="testimonial-text">{{ item.feedback }}</p>
            <div class="user-info">
              <img
                :src="item.image"
                :alt="`${item.name}, ${item.role}`"
                loading="lazy"
                @error="handleImageError"
              />
              <div>
                <h4>{{ item.name }}</h4>
                <p class="user-role">{{ item.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Elevate Your Service Business Today</h2>
        <p class="cta-text">
          Join Infinity-Booking's professional network — where ambitious providers access enterprise-grade tools 
          for sustainable growth and market expansion.
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="btn-primary-large">✨ Register Your Business</router-link>
          <a href="#hero" class="btn-text">Explore Platform Features</a>
        </div>
      </div>
    </section>

    <!-- Footer CTA (Mini) -->
    <div class="footer-cta">
      <div class="container">
        <p>© 2025 Infinity-Booking. Empowering professional service providers through innovative booking solutions.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const testimonials = [
  {
    name: 'Sophia L.',
    role: 'Home Service Professional',
    feedback: 'Infinity-Booking has revolutionized how I connect with clients. The platform’s sophisticated tools have eliminated administrative burdens while significantly expanding my customer reach.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Michael B.',
    role: 'Salon Enterprise Owner',
    feedback: 'The seamless integration of booking management with payment processing has optimized our operations. Our clients appreciate the professional booking experience.',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    name: 'Sara T.',
    role: 'Educational Consultant',
    feedback: 'Infinity-Booking provides the perfect infrastructure for scaling educational services. The platform effortlessly connects us with learners across multiple locations.',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Daniel K.',
    role: 'Corporate Client',
    feedback: 'The quality assurance and verification process ensures we engage only with premium service providers. The booking experience is consistently professional.',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
];

const benefits = [
  {
    title: 'Commission-Free Launch Period',
    description: 'Supporting your business growth with zero platform fees for the first 6 months — permanent exemption for educational institutions and NGOs.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  },
  {
    title: 'Advanced Business Management Suite',
    description: 'Streamline scheduling, client relationship management, and service delivery through our comprehensive professional dashboard.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png',
  },
  {
    title: 'Secure Payment Infrastructure',
    description: 'Immediate payment processing through Telebirr with upcoming enterprise-grade financial integrations.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2681/2681155.png',
  },
  {
    title: 'Dedicated Professional Support',
    description: '24/7 expert assistance from our Ethiopian-based support team, available in both Amharic and English.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3003/3003557.png',
  },
];

const faqs = [
  {
    question: 'What are the registration requirements?',
    answer: 'Professional registration and service listing are completely free. We implement a minimal service fee following successful bookings, with this fee waived during your initial 6-month growth period.'
  },
  {
    question: 'How does the payment system work?',
    answer: 'All transactions are securely processed through Telebirr or CBE Birr. Your earnings are deposited into your business wallet within 24 hours after service completion.'
  },
  {
    question: 'Can I manage multiple service categories?',
    answer: 'Absolutely. You can list and manage an unlimited portfolio of services under your verified professional profile.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Our equitable cancellation framework protects your business interests. Last-minute cancellations (within 2 hours) compensate providers with 50% of the service value.'
  },
];

function handleImageError(e) {
  e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
}
</script>

<style scoped>
/* ===== ENHANCED TYPOGRAPHY & PROFESSIONAL STYLING ===== */
.home {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #0f172a;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.25rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.2rem;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
}

/* ===== ENHANCED HERO SECTION ===== */
.hero {
  position: relative;
  height: 100vh;
  min-height: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  background-image: 
    linear-gradient(rgba(30, 58, 138, 0.92), rgba(15, 23, 42, 0.96));
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(255,204,0,0.12) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(14,165,233,0.15) 0%, transparent 40%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 880px;
  padding: 0 24px;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  display: inline-block;
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: 3.4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.15;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.03em;
}

.highlight {
  background: linear-gradient(135deg, #ffcc00, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.3rem;
  line-height: 1.75;
  margin-bottom: 3rem;
  opacity: 0.95;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #ffcc00, #ff9e00);
  color: #0f172a;
  font-weight: 700;
  padding: 18px 40px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.15rem;
  box-shadow: 0 8px 24px rgba(255, 204, 0, 0.4);
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  letter-spacing: 0.02em;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 204, 0, 0.6);
}

.btn-secondary {
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 18px 40px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.15rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  display: inline-block;
  letter-spacing: 0.02em;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  transform: translateY(-3px);
}

.hero-trust {
  margin-top: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
  font-weight: 500;
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.trust-badges img {
  width: 36px;
  opacity: 0.9;
  filter: brightness(0) invert(1);
}

/* Enhanced shapes for visual depth */
.hero-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,204,0,0.08) 0%, transparent 70%);
}

.shape-1 {
  width: 320px;
  height: 320px;
  top: 10%;
  left: 5%;
  animation: float 18s infinite ease-in-out;
}

.shape-2 {
  width: 220px;
  height: 220px;
  bottom: 15%;
  right: 8%;
  animation: float 20s infinite reverse ease-in-out;
}

/* ===== ENHANCED STATS SECTION ===== */
.stats-section {
  background: #f8fafc;
  padding: 100px 0;
  position: relative;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}

.stat-icon img {
  width: 64px;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.stat-number {
  font-size: 2.6rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
  color: #475569;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* ===== ENHANCED OVERVIEW SECTION ===== */
.overview-section,
.benefits-section {
  padding: 120px 0;
  background: white;
}

.overview-grid,
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 36px;
}

.overview-card,
.benefit-card {
  background: #f8fafc;
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid #e2e8f0;
}

.overview-card:hover,
.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  background: white;
}

.card-icon img,
.benefit-icon img {
  width: 72px;
  margin-bottom: 28px;
}

.overview-card h3,
.benefit-card h3 {
  font-size: 1.5rem;
  margin: 20px 0 16px;
  color: #0f172a;
  font-weight: 700;
  line-height: 1.3;
}

.overview-card p,
.benefit-card p {
  color: #64748b;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* ===== ENHANCED BOOKING FLOW ===== */
.booking-flow-section {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding: 120px 0;
}

.flow-content {
  max-width: 840px;
  margin: 0 auto;
  text-align: center;
}

.flow-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #0c4a6e;
  font-weight: 700;
  line-height: 1.2;
}

.flow-subtitle {
  font-size: 1.2rem;
  color: #334155;
  margin-bottom: 3rem;
  line-height: 1.7;
  font-weight: 400;
}

.flow-list {
  text-align: left;
  max-width: 640px;
  margin: 0 auto 3.5rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #1e293b;
}

.flow-list li {
  margin-bottom: 16px;
  padding-left: 12px;
  font-weight: 500;
}

.flow-visual {
  margin-top: 2.5rem;
}

.flow-visual img {
  width: 100px;
  opacity: 0.8;
}

/* ===== ENHANCED INDUSTRIES SECTION ===== */
.industries-section {
  padding: 120px 0;
  background: #f8fafc;
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 36px;
}

.industry-card {
  background: white;
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.industry-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}

.industry-icon img {
  width: 72px;
  margin-bottom: 28px;
}

.industry-card h3 {
  font-size: 1.5rem;
  margin: 20px 0 16px;
  color: #0f172a;
  font-weight: 700;
}

.industry-card p {
  color: #64748b;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* ===== ENHANCED FAQ ===== */
.faq-section {
  background: white;
  padding: 120px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 3.5rem;
}

.faq-item {
  background: #f8fafc;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.faq-question {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  line-height: 1.4;
}

.faq-answer {
  color: #475569;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* ===== ENHANCED TESTIMONIALS ===== */
.testimonials-section {
  padding: 120px 0;
  background: #f8fafc;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 36px;
  margin-top: 3.5rem;
}

.testimonial-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #0ea5e9;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}

.quote-mark {
  position: absolute;
  top: 28px;
  left: 28px;
  font-size: 3.5rem;
  color: #0ea5e9;
  opacity: 0.12;
  font-family: Georgia, serif;
  font-weight: 700;
}

.testimonial-text {
  font-style: italic;
  color: #1e293b;
  line-height: 1.75;
  margin: 28px 0 32px;
  font-size: 1.15rem;
  position: relative;
  z-index: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: flex-start;
}

.user-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5e9;
}

.user-info h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.user-role {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* ===== ENHANCED FINAL CTA ===== */
.cta-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 120px 24px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.cta-text {
  font-size: 1.3rem;
  max-width: 760px;
  margin: 0 auto 3rem;
  opacity: 0.95;
  line-height: 1.7;
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-large {
  background: linear-gradient(135deg, #ffcc00, #ff9e00);
  color: #0f172a;
  font-weight: 700;
  padding: 20px 48px;
  border-radius: 18px;
  text-decoration: none;
  font-size: 1.3rem;
  box-shadow: 0 10px 30px rgba(255, 204, 0, 0.5);
  transition: all 0.3s ease;
  display: inline-block;
  letter-spacing: 0.02em;
}

.btn-primary-large:hover {
  transform: scale(1.05);
  box-shadow: 0 14px 36px rgba(255, 204, 0, 0.6);
}

.btn-text {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  font-size: 1.15rem;
  align-self: center;
  transition: color 0.3s ease;
  font-weight: 500;
}

.btn-text:hover {
  color: white;
}

/* ===== ENHANCED FOOTER CTA ===== */
.footer-cta {
  background: #0f172a;
  color: #94a3b8;
  text-align: center;
  padding: 24px 0;
  font-size: 1rem;
  font-weight: 500;
}

/* ===== ENHANCED ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, 20px) rotate(2deg); }
  66% { transform: translate(-15px, 15px) rotate(-2deg); }
}

/* ===== RESPONSIVE ENHANCEMENTS ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.15rem;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
  }

  .hero-buttons,
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary,
  .btn-primary-large {
    width: 100%;
    max-width: 340px;
    text-align: center;
  }

  .stats-grid,
  .overview-grid,
  .benefits-grid,
  .industries-grid,
  .faq-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .container {
    padding: 0 20px;
  }
}

/* ===== ACCESSIBILITY ENHANCEMENTS ===== */
.btn-primary:focus,
.btn-secondary:focus,
.btn-primary-large:focus {
  outline: 3px solid #ffcc00;
  outline-offset: 4px;
  border-radius: 16px;
}

/* Improved text contrast for accessibility */
.section-subtitle,
.hero-subtitle,
.flow-subtitle,
.cta-text {
  color: #64748b;
}

/* Enhanced hover states for better UX */
.overview-card,
.benefit-card,
.industry-card,
.faq-item,
.testimonial-card {
  cursor: pointer;
}
</style>