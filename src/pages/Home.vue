<!-- src/pages/HomePage.vue -->
<template>
  <div class="home font-poppins">
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">🚀 Now Live in Ethiopia & Expanding Globally</div>
        <h1 class="hero-title">
          Empower Your Service Business with <span class="highlight">Infinity-Booking</span>
        </h1>
        <p class="hero-subtitle">
          The only platform designed <strong>for service providers</strong> to manage bookings, payments, and growth — all in one intuitive dashboard.  
          Join thousands of professionals in <strong>Home Services</strong>, <strong>Beauty & Salon</strong>, and <strong>Education</strong> today.
        </p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn-primary">✨ Register as Provider</router-link>
          <router-link to="/explore" class="btn-secondary">🔍 Explore Services</router-link>
        </div>
        <div class="hero-trust">
          <span>Trusted by 150+ providers across 12 cities</span>
          <div class="trust-badges">
            <img src="https://cdn-icons-png.flaticon.com/512/1181/1181468.png" alt="Secure" />
            <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Verified" />
            <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="24/7 Support" />
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
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Providers" />
            </div>
            <div class="stat-number">150+</div>
            <div class="stat-label">Active Providers</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Services" />
            </div>
            <div class="stat-number">500+</div>
            <div class="stat-label">Services Listed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2972/2972133.png" alt="Bookings" />
            </div>
            <div class="stat-number">1,200+</div>
            <div class="stat-label">Bookings Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="Support" />
            </div>
            <div class="stat-number">98%</div>
            <div class="stat-label">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Overview -->
    <section class="overview-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">One Platform. Infinite Possibilities.</h2>
          <p class="section-subtitle">
            Infinity-Booking isn't just another booking app — it's a complete ecosystem built to scale with your business.
          </p>
        </div>
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png" alt="Dashboard" />
            </div>
            <h3>Smart Dashboard</h3>
            <p>Manage your schedule, clients, earnings, and reviews in one place. Real-time analytics included.</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2681/2681155.png" alt="Payments" />
            </div>
            <h3>Local & Global Payments</h3>
            <p>Accept payments via <strong>Telebirr</strong>, CBE Birr, and soon PayPal, cards, and mobile money.</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Growth" />
            </div>
            <h3>Grow Your Audience</h3>
            <p>Get discovered by new customers through our smart recommendation engine and local SEO.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Providers Choose Infinity-Booking</h2>
          <p class="section-subtitle">
            We solve real pain points — so you can focus on your craft.
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
          <h2 class="flow-title">Secure, Transparent, and Reliable</h2>
          <p class="flow-subtitle">
            Every booking is protected with end-to-end encryption, verified identities, and guaranteed payments.
          </p>
          <ul class="flow-list">
            <li>🔒 <strong>Verified Providers</strong> – All providers undergo ID and business verification.</li>
            <li>💸 <strong>Instant Payouts</strong> – Get paid within 24 hours after service completion.</li>
            <li>📅 <strong>Smart Reminders</strong> – Automated SMS & email confirmations for both parties.</li>
            <li>🛡️ <strong>Dispute Resolution</strong> – Fair, human-reviewed support for every issue.</li>
          </ul>
          <div class="flow-visual">
            <img src="https://cdn-icons-png.flaticon.com/512/3003/3003557.png" alt="Security" />
          </div>
        </div>
      </div>
    </section>

    <!-- Industries Section -->
    <section class="industries-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Serving Key Industries</h2>
          <p class="section-subtitle">
            We're building the future of service booking across multiple sectors
          </p>
        </div>
        <div class="industries-grid">
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/869/869636.png" alt="Home Services" />
            </div>
            <h3>Home Services</h3>
            <p>Plumbing, electrical, cleaning, repairs and maintenance services</p>
          </div>
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3082/3082405.png" alt="Beauty & Salon" />
            </div>
            <h3>Beauty & Salon</h3>
            <p>Hair styling, beauty treatments, spa services and personal care</p>
          </div>
          <div class="industry-card">
            <div class="industry-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Education" />
            </div>
            <h3>Education</h3>
            <p>Tutoring, skill development, workshops and training sessions</p>
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
            Everything you need to know — in one place.
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
          <h2 class="section-title">Trusted by Providers & Customers</h2>
          <p class="section-subtitle">
            Real stories from real people who transformed their service experience.
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
        <h2 class="cta-title">Ready to Transform Your Service Business?</h2>
        <p class="cta-text">
          Join Infinity-Booking today — where every provider has the tools to succeed and grow infinitely.
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="btn-primary-large">✨ Register as Provider</router-link>
          <a href="#hero" class="btn-text">Learn More</a>
        </div>
      </div>
    </section>

    <!-- Footer CTA (Mini) -->
    <div class="footer-cta">
      <div class="container">
        <p>© 2025 Infinity-Booking. Empowering service providers, one booking at a time.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const testimonials = [
  {
    name: 'Sophia L.',
    role: 'Home Service Provider',
    feedback: 'Infinity-Booking helped me reach hundreds of customers without any marketing hassle. The platform feels modern, easy, and powerful.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Michael B.',
    role: 'Salon Owner',
    feedback: 'I love how simple it is to manage bookings and payments! My clients now book me directly — it has boosted my business visibility.',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    name: 'Sara T.',
    role: 'Tutor & Educator',
    feedback: 'The system made it so easy for me to offer online and in-person sessions. Infinity-Booking really connects us with learners everywhere!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Daniel K.',
    role: 'Customer',
    feedback: 'Booking home and beauty services has never been smoother. I appreciate the trust and quality providers I can find here.',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
];

const benefits = [
  {
    title: 'Zero Commission (For Now!)',
    description: 'We believe in your success. No fees for the first 6 months — forever for students and NGOs.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  },
  {
    title: 'Smart Business Tools',
    description: 'Organize schedules, track customer requests, and handle bookings with a single smart dashboard.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png',
  },
  {
    title: 'Secure & Local Payments',
    description: 'Receive payments instantly via Telebirr and future integrations like PayPal and Card options.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2681/2681155.png',
  },
  {
    title: '24/7 Dedicated Support',
    description: 'Our Ethiopian-based support team is always ready to help — in Amharic or English.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3003/3003557.png',
  },
];

const faqs = [
  {
    question: 'Is registration free?',
    answer: 'Yes! Registration and listing your services is 100% free. We only charge a small fee after a successful booking (waived for the first 6 months).'
  },
  {
    question: 'How do I get paid?',
    answer: 'Payments are processed securely through Telebirr or CBE Birr. Funds are transferred to your wallet within 24 hours after service completion.'
  },
  {
    question: 'Can I manage multiple services?',
    answer: 'Absolutely! You can list as many services as you offer under your verified provider profile.'
  },
  {
    question: 'What if a customer cancels?',
    answer: 'Our fair cancellation policy protects you. Last-minute cancellations (under 2 hours) still pay you 50% as compensation.'
  },
];

function handleImageError(e) {
  e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
}
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.home {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #0f172a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.15rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ===== HERO SECTION ===== */
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  background-image: 
    linear-gradient(rgba(30, 58, 138, 0.9), rgba(15, 23, 42, 0.95));
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(255,204,0,0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(14,165,233,0.2) 0%, transparent 40%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 850px;
  padding: 0 20px;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: inline-block;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 1.8rem;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.highlight {
  background: linear-gradient(135deg, #ffcc00, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.3rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-primary {
  background: linear-gradient(135deg, #ffcc00, #ff9e00);
  color: #0f172a;
  font-weight: 700;
  padding: 16px 36px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.1rem;
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.4);
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 204, 0, 0.6);
}

.btn-secondary {
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 16px 36px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  transform: translateY(-3px);
}

.hero-trust {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
}

.trust-badges img {
  width: 32px;
  opacity: 0.9;
  filter: brightness(0) invert(1);
}

/* Shapes for visual depth */
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
  background: radial-gradient(circle, rgba(255,204,0,0.1) 0%, transparent 70%);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation: float 15s infinite ease-in-out;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 15%;
  right: 8%;
  animation: float 18s infinite reverse ease-in-out;
}

/* ===== STATS SECTION ===== */
.stats-section {
  background: #f8fafc;
  padding: 80px 0;
  position: relative;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.stat-icon img {
  width: 60px;
  margin-bottom: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.05rem;
  color: #475569;
  font-weight: 600;
}

/* ===== OVERVIEW SECTION ===== */
.overview-section,
.benefits-section {
  padding: 100px 0;
  background: white;
}

.overview-grid,
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.overview-card,
.benefit-card {
  background: #f8fafc;
  border-radius: 22px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid #e2e8f0;
}

.overview-card:hover,
.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.1);
}

.card-icon img,
.benefit-icon img {
  width: 70px;
  margin-bottom: 22px;
}

.overview-card h3,
.benefit-card h3 {
  font-size: 1.4rem;
  margin: 18px 0 14px;
  color: #0f172a;
}

.overview-card p,
.benefit-card p {
  color: #64748b;
  line-height: 1.6;
}

/* ===== BOOKING FLOW ===== */
.booking-flow-section {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  padding: 100px 0;
}

.flow-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.flow-title {
  font-size: 2.3rem;
  margin-bottom: 1.2rem;
  color: #0c4a6e;
}

.flow-subtitle {
  font-size: 1.15rem;
  color: #334155;
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.flow-list {
  text-align: left;
  max-width: 600px;
  margin: 0 auto 3rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #1e293b;
}

.flow-list li {
  margin-bottom: 12px;
  padding-left: 10px;
}

.flow-visual {
  margin-top: 2rem;
}

.flow-visual img {
  width: 100px;
  opacity: 0.8;
}

/* ===== INDUSTRIES SECTION ===== */
.industries-section {
  padding: 100px 0;
  background: #f8fafc;
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.industry-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.industry-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.industry-icon img {
  width: 70px;
  margin-bottom: 22px;
}

.industry-card h3 {
  font-size: 1.4rem;
  margin: 18px 0 14px;
  color: #0f172a;
}

.industry-card p {
  color: #64748b;
  line-height: 1.6;
}

/* ===== FAQ ===== */
.faq-section {
  background: white;
  padding: 100px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  margin-top: 3rem;
}

.faq-item {
  background: #f8fafc;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.faq-question {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 14px;
}

.faq-answer {
  color: #475569;
  line-height: 1.6;
  font-size: 1.02rem;
}

/* ===== TESTIMONIALS ===== */
.testimonials-section {
  padding: 100px 0;
  background: #f8fafc;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 3rem;
}

.testimonial-card {
  background: white;
  border-radius: 22px;
  padding: 36px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #0ea5e9;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.quote-mark {
  position: absolute;
  top: 24px;
  left: 24px;
  font-size: 3.2rem;
  color: #0ea5e9;
  opacity: 0.12;
  font-family: Georgia, serif;
}

.testimonial-text {
  font-style: italic;
  color: #1e293b;
  line-height: 1.75;
  margin: 24px 0 28px;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
}

.user-info img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5e9;
}

.user-info h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.user-role {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* ===== FINAL CTA ===== */
.cta-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 100px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
}

.cta-text {
  font-size: 1.2rem;
  max-width: 720px;
  margin: 0 auto 2.5rem;
  opacity: 0.95;
  line-height: 1.7;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-large {
  background: linear-gradient(135deg, #ffcc00, #ff9e00);
  color: #0f172a;
  font-weight: 700;
  padding: 18px 42px;
  border-radius: 18px;
  text-decoration: none;
  font-size: 1.25rem;
  box-shadow: 0 8px 24px rgba(255, 204, 0, 0.5);
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary-large:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(255, 204, 0, 0.6);
}

.btn-text {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  font-size: 1.1rem;
  align-self: center;
  transition: color 0.3s ease;
}

.btn-text:hover {
  color: white;
}

/* ===== FOOTER CTA ===== */
.footer-cta {
  background: #0f172a;
  color: #94a3b8;
  text-align: center;
  padding: 20px 0;
  font-size: 0.95rem;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, 20px); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.3rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
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
    max-width: 320px;
    text-align: center;
  }
}

/* ===== ACCESSIBILITY ===== */
.btn-primary:focus,
.btn-secondary:focus,
.btn-primary-large:focus {
  outline: 3px solid #ffcc00;
  outline-offset: 4px;
  border-radius: 16px;
}
</style>