<!-- src/pages/AboutPage.vue -->
<template>
  <div class="about-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">About Infinity-Booking</h1>
        <p class="hero-text">
          A flexible, professional platform connecting service providers and customers globally.
        </p>
        <p class="hero-text">
          Empowering providers, ensuring quality, and simplifying appointments & payments.
        </p>
        <router-link to="/login" class="hero-cta">Get Started</router-link>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section mission-section">
      <div class="section-container">
        <h2 class="section-title">Our Mission</h2>
        <p class="section-text">
          To build a reliable ecosystem where providers grow, customers find trusted professionals, and admins maintain high standards — all on a platform designed to scale infinitely across any industry.
        </p>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section values-section">
      <div class="section-container">
        <h2 class="section-title">Our Values</h2>
        <div class="values-grid">
          <div
            v-for="(value, index) in values"
            :key="index"
            class="value-card"
            :class="`value-${index}`"
          >
            <i :class="value.icon"></i>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <h2 class="cta-title">Join Infinity-Booking Today</h2>
        <p class="cta-text">
          Become part of a global network that empowers providers and connects customers with excellence.
        </p>
        <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// Enhanced values with icons and content
const values = [
  {
    icon: "fas fa-users fa-2x",
    title: "Community First",
    description: "We build a supportive network of providers and customers who grow together."
  },
  {
    icon: "fas fa-shield-alt fa-2x",
    title: "Trust & Safety",
    description: "Verified profiles, secure payments, and honest reviews ensure peace of mind."
  },
  {
    icon: "fas fa-chart-line fa-2x",
    title: "Growth & Insight",
    description: "Track performance, understand trends, and scale your service business."
  },
  {
    icon: "fas fa-infinity fa-2x",
    title: "Flexible & Scalable",
    description: "Built to adapt endlessly — new services, industries, and innovations welcome."
  }
];

// Optional: Add simple scroll reveal
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.value-card, .section').forEach(el => {
    observer.observe(el);
  });
});
</script>

<style scoped>
/* Base */
.about-page {
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
}

/* Universal Section */
.section {
  padding: 70px 20px;
  position: relative;
}

.section-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

/* Hero */
.hero-section {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  position: relative;
  padding: 100px 20px 80px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  line-height: 1.2;
  color: #ffd54f;
}

.hero-text {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 1rem;
  opacity: 0.95;
}

.hero-cta {
  display: inline-block;
  background: #ffd54f;
  color: #1e3a8a;
  font-weight: 700;
  padding: 0.9rem 2rem;
  border-radius: 14px;
  text-decoration: none;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.25s ease;
}

.hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* Mission & Values */
.mission-section {
  background: white;
  color: #1e3a8a;
}

.mission-section .section-title {
  color: #1e40af;
}

.values-section {
  background: #f8fafc;
  color: #1e3a8a;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
  color: #4b5563;
}

/* Values Grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 2rem;
}

.value-card {
  background: white;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.value-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.value-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.value-card i {
  color: #3b82f6;
  margin-bottom: 16px;
}

.value-card h3 {
  font-size: 1.25rem;
  margin: 0.8rem 0;
  color: #1e40af;
  font-weight: 700;
}

.value-card p {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  text-align: center;
  padding: 80px 20px;
}

.cta-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffd54f;
}

.cta-text {
  font-size: 1.15rem;
  max-width: 700px;
  margin: 0 auto 1.8rem;
  opacity: 0.95;
  line-height: 1.7;
}

.cta-btn {
  display: inline-block;
  background: #ffd54f;
  color: #1e3a8a;
  font-weight: 700;
  padding: 1rem 2.2rem;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.cta-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
}

/* Mobile-First Responsive */
@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-text {
    font-size: 1.05rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-text,
  .cta-text {
    font-size: 1.05rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .value-card {
    padding: 24px 20px;
  }

  .hero-cta,
  .cta-btn {
    width: 100%;
    max-width: 320px;
  }
}

/* Accessibility */
.hero-cta:focus,
.cta-btn:focus {
  outline: 2px solid #ffd54f;
  outline-offset: 4px;
  border-radius: 14px;
}
</style>