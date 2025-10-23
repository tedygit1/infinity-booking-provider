<template>
  <div class="how-it-works font-poppins">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>How Infinity-Booking Works</h1>
        <p>
          Empowering local service providers while giving admins the tools to maintain high-quality service standards. 
          Manage appointments, receive payments, gain visibility, and grow your business efficiently.
        </p>
        <p>
          Join a reliable, professional, and thriving provider community — designed to expand endlessly.
        </p>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps-section">
      <h2 class="section-title">Provider Journey</h2>
      <div class="steps-grid">
        <div class="step-card" v-for="(step, index) in steps" :key="index" :class="'step-'+index">
          <img :src="step.icon" :alt="step.title" />
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Platform Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-user-check fa-2x"></i>
          <h3>Verified Providers</h3>
          <p>Ensure trust and quality with admin-approved provider profiles.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-chart-line fa-2x"></i>
          <h3>Analytics & Insights</h3>
          <p>Track your bookings, performance, and growth trends on your dashboard.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-hand-holding-usd fa-2x"></i>
          <h3>Secure Payments</h3>
          <p>Receive payments reliably via Telebirr, PayPal, and future card integrations.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-comments fa-2x"></i>
          <h3>Customer Feedback</h3>
          <p>Build your reputation with ratings and reviews for better visibility.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Join Infinity-Booking?</h2>
      <p>Create your provider account today and start growing your business in a professional network that expands endlessly.</p>
      <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
    </section>

  </div>
</template>

<script setup>
const steps = [
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
    title: 'Sign Up & Create Profile',
    desc: 'Add your service details, pricing, availability, and showcase your skills to attract clients efficiently.'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135679.png',
    title: 'Gain Visibility',
    desc: 'Be discovered by potential customers. More providers on the platform means more opportunities for all.'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/1250/1250615.png',
    title: 'Manage Appointments',
    desc: 'Confirm, reschedule, or track appointments using your provider dashboard.'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png',
    title: 'Receive Payments',
    desc: 'Receive payments securely through Telebirr, PayPal, and future card payment options after service completion.'
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/545/545682.png',
    title: 'Build Reputation',
    desc: 'Earn ratings and feedback to strengthen your profile, build trust, and increase visibility.'
  }
];
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(to right, #0ea5e9, #0284c7);
  color: white;
  text-align: center;
  padding: 120px 20px 80px;
  position: relative;
}
.hero-overlay {
  position: absolute;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.25);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-content h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
.hero-content p { font-size: 1.15rem; margin-bottom: 1rem; line-height: 1.7; }

/* Steps Section */
.steps-section { padding: 80px 20px; text-align: center; }
.section-title { font-size: 2.2rem; margin-bottom: 2rem; color: #0ea5e9; font-weight: 700; }
.steps-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}
.step-card {
  background: white;
  border-radius: 20px;
  padding: 30px 25px;
  width: 280px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.4s, box-shadow 0.4s;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 0.8s forwards;
}
.step-card:nth-child(1) { animation-delay: 0.2s; }
.step-card:nth-child(2) { animation-delay: 0.4s; }
.step-card:nth-child(3) { animation-delay: 0.6s; }
.step-card:nth-child(4) { animation-delay: 0.8s; }
.step-card:nth-child(5) { animation-delay: 1s; }
.step-card img { width: 70px; margin-bottom: 15px; }
.step-card h3 { font-size: 1.3rem; color: #0ea5e9; margin-bottom: 10px; }
.step-card p { font-size: 1rem; color: #555; line-height: 1.6; }

/* Features Section */
.features-section { padding: 80px 20px; background: #f9fafb; text-align: center; }
.features-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 25px; }
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 25px 20px;
  width: 240px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.feature-card i { color: #0ea5e9; margin-bottom: 12px; }
.feature-card h3 { font-size: 1.2rem; margin-bottom: 8px; color: #0ea5e9; }
.feature-card p { font-size: 0.95rem; color: #555; }

/* CTA Section */
.cta-section {
  background: linear-gradient(to right, #0ea5e9, #0284c7);
  color: white;
  text-align: center;
  padding: 90px 20px;
}
.cta-btn {
  background: #ffcc00;
  color: black;
  padding: 1rem 2rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  margin-top: 20px;
  transition: transform 0.3s, background 0.3s;
}
.cta-btn:hover { transform: scale(1.05); background: #ffd633; }

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .steps-grid, .features-grid { flex-direction: column; align-items: center; }
}
</style>
