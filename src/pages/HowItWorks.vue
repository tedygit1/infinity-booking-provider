<!-- src/pages/HowItWorksPage.vue -->
<template>
  <div class="how-it-works font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">How Infinity-Booking Works</h1>
        <p class="hero-text">
          Empowering local service providers while giving admins the tools to maintain high-quality service standards.
        </p>
        <p class="hero-text">
          From registration to payment — follow this simple journey to start growing your business.
        </p>
        <router-link to="/login" class="hero-cta">🚀 Get Started as a Provider</router-link>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps-section">
      <div class="container">
        <h2 class="section-title">Your Provider Journey</h2>
        <p class="section-subtitle">
          Follow these 5 clear steps to go from sign-up to earning — safely and efficiently.
        </p>
        <div class="steps-grid">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-card"
            :class="`step-${index}`"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <img
              :src="step.icon.trim()"
              :alt="step.title"
              loading="lazy"
              @error="handleImageError"
            />
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Platform Features</h2>
        <p class="section-subtitle">
          Built for growth, trust, and efficiency — here’s what you get when you join.
        </p>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
          >
            <i :class="feature.icon"></i>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Ready to Join Infinity-Booking?</h2>
        <p class="cta-text">
          Create your provider account today and start growing your business in a professional network that expands endlessly.
        </p>
        <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const steps = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    title: "Sign Up & Create Profile",
    desc: "Register with your email or phone. Complete your personal info, upload ID, and set up your basic profile.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png",
    title: "Wait for Admin Approval",
    desc: "Our team reviews your application",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135679.png",
    title: "Post Your First Service",
    desc: "Add your service name, description, pricing, location, availability, and photos. Make it irresistible to customers!",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1250/1250615.png",
    title: "Manage Appointments",
    desc: "Customers book you directly! Confirm, reschedule, or cancel appointments from your dashboard — all in one place.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/545/545682.png",
    title: "Get Paid & Build Reputation",
    desc: "Receive payments securely via Telebirr after each job. Earn ratings and reviews to grow your visibility and trust.",
  },
];

const features = [
  {
    icon: "fas fa-user-check fa-2x",
    title: "Verified Providers",
    description: "Ensure trust and quality with admin-approved provider profiles.",
  },
  {
    icon: "fas fa-chart-line fa-2x",
    title: "Analytics & Insights",
    description: "Track your bookings, performance, and growth trends on your dashboard.",
  },
  {
    icon: "fas fa-hand-holding-usd fa-2x",
    title: "Secure Payments",
    description: "Receive payments reliably via Telebirr, PayPal, and future card integrations.",
  },
  {
    icon: "fas fa-comments fa-2x",
    title: "Customer Feedback",
    description: "Build your reputation with ratings and reviews for better visibility.",
  },
];

function handleImageError(e) {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2972/2972185.png";
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".step-card, .feature-card").forEach((el) => {
    observer.observe(el);
  });
});
</script>

<style scoped>
/* Base */
.how-it-works {
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero */
.hero-section {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  text-align: center;
  padding: 90px 20px 70px;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  line-height: 1.2;
}

.hero-text {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 1rem;
  opacity: 0.95;
}

.hero-cta {
  display: inline-block;
  background: #ffcc00;
  color: #1e293b;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.15rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
}

/* Steps Section */
.steps-section {
  background: #f8fafc;
  padding: 70px 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0ea5e9;
  margin: 0 auto 1rem;
  text-align: center;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.05rem;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  text-align: center;
  line-height: 1.6;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-top: 2rem;
}

.step-card {
  background: white;
  border-radius: 22px;
  padding: 30px 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  position: relative;
  opacity: 0;
  transform: translateY(40px);
}

.step-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.step-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.step-number {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 40px;
  height: 40px;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.step-card img {
  width: 60px;
  margin-bottom: 16px;
}

.step-card h3 {
  font-size: 1.3rem;
  color: #0ea5e9;
  margin: 16px 0 12px;
  font-weight: 700;
}

.step-card p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  background: white;
  padding: 70px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-top: 2rem;
}

.feature-card {
  background: #f8fafc;
  border-radius: 22px;
  padding: 30px 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(40px);
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.feature-card i {
  color: #0ea5e9;
  margin-bottom: 16px;
  font-size: 1.8rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #0ea5e9;
  margin: 16px 0 12px;
  font-weight: 700;
}

.feature-card p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.95;
  line-height: 1.7;
}

.cta-btn {
  display: inline-block;
  background: #ffcc00;
  color: #1e293b;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.15rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.cta-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-text,
  .cta-text,
  .section-subtitle {
    font-size: 1rem;
  }

  .steps-grid,
  .features-grid {
    grid-template-columns: 1fr !important;
    padding: 0 16px;
  }

  .step-number {
    top: -10px;
    right: -10px;
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .hero-cta,
  .cta-btn {
    width: 100%;
    max-width: 300px;
    padding: 16px;
  }
}

/* Accessibility */
.hero-cta:focus,
.cta-btn:focus {
  outline: 2px solid #ffcc00;
  outline-offset: 4px;
  border-radius: 16px;
}
</style>