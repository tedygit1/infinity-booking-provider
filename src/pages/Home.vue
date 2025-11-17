<!-- src/pages/HomePage.vue -->
<template>
  <div class="home font-poppins">
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          Welcome to <span class="highlight">Infinity-Booking</span>
        </h1>
        <p class="hero-subtitle">
          The all-in-one platform built to empower <strong>service providers of every kind</strong>.  
          Launched with <strong>Home Services</strong>, <strong>Beauty & Salon</strong>, and <strong>Education/Tutoring</strong>,  
          Infinity-Booking is designed to <strong>grow infinitely</strong> — expanding into new industries as more providers join.
        </p>
        <router-link to="/login" class="hero-cta">🚀 Get Started</router-link>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">150+</div>
            <div class="stat-label">Providers Onboarded</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">500+</div>
            <div class="stat-label">Services Listed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">1,200+</div>
            <div class="stat-label">Bookings Completed</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Our Core Service Categories</h2>
        <p class="section-subtitle">
          We start with these essential sectors — and grow infinitely as new providers join.
        </p>
        <div class="categories-grid">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="category-card"
          >
            <img
              :src="category.icon"
              :alt="category.title"
              loading="lazy"
              decoding="async"
            />
            <h3>{{ category.title }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title">Why Providers Choose Us</h2>
        <div class="benefits-grid">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="benefit-card"
          >
            <img
              :src="benefit.icon"
              :alt="benefit.title"
              loading="lazy"
              decoding="async"
            />
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">Trusted by Providers & Customers</h2>
        <p class="section-subtitle">
          Real stories from real people who transformed their service experience.
        </p>
        <div class="testimonials-grid">
          <div
            v-for="(item, index) in testimonials"
            :key="index"
            class="testimonial-card"
          >
            <div class="quote-mark">“</div>
            <p class="testimonial-text">{{ item.feedback }}</p>
            <div class="user-info">
              <img
                :src="item.image.trim()"
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

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Ready to Join the Infinite Network?</h2>
        <p class="cta-text">
          Sign up today and start growing your business with <strong>Infinity-Booking</strong> — where every service finds its place.
        </p>
        <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import mekelleCity from '../assets/Mekelle-City.jpg';
import { onMounted } from 'vue';

// Fix image URLs (remove extra spaces)
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

const categories = [
  {
    title: 'Home Services',
    description: 'From repairs to cleaning — find skilled home experts ready to serve your neighborhood.',
    icon: 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
  },
  {
    title: 'Beauty & Salon',
    description: 'Book professional stylists, barbers, and beauty specialists who bring confidence to your doorstep.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    title: 'Education & Tutoring',
    description: 'Connect with experienced tutors and educators to support lifelong learning and growth.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png',
  },
];

const benefits = [
  {
    title: 'Unlimited Growth',
    description: 'Infinity-Booking expands endlessly — the more providers join, the more opportunities open for all.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  },
  {
    title: 'Smart Business Tools',
    description: 'Organize schedules, track customer requests, and handle bookings with a single smart dashboard.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png',
  },
  {
    title: 'Secure & Local Payments',
    description: 'Receive payments instantly via <strong>Telebirr</strong> and future integrations like <strong>PayPal</strong> and <strong>Card</strong> options.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2681/2681155.png',
  },
];

function handleImageError(e) {
  e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
}

// Optimize hero image load
onMounted(() => {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundImage = `url(${mekelleCity})`;
  }
});
</script>

<style scoped>
/* Base */
.home {
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero */
.hero {
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
  animation: fadeIn 1s ease;
}

.hero-title {
  font-size: 2.6rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  line-height: 1.2;
}

.highlight {
  color: #ffcc00;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 1.8rem;
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

/* Stats */
.stats-section {
  background: #f8fafc;
  padding: 60px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  text-align: center;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #475569;
}

/* Sections */
.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
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

/* Categories & Benefits */
.categories-grid,
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-top: 2rem;
}

.category-card,
.benefit-card {
  background: white;
  border-radius: 22px;
  padding: 30px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  text-align: center;
}

.category-card:hover,
.benefit-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.category-card img,
.benefit-card img {
  width: 60px;
  margin-bottom: 18px;
}

.category-card h3,
.benefit-card h3 {
  font-size: 1.35rem;
  margin: 16px 0 12px;
  color: #1e293b;
  font-weight: 700;
}

.category-card p,
.benefit-card p {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
}

/* Testimonials */
.testimonials-section {
  background: white;
  padding: 80px 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 2.5rem;
}

.testimonial-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.quote-mark {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 3rem;
  color: #0ea5e9;
  opacity: 0.15;
  line-height: 1;
}

.testimonial-text {
  font-style: italic;
  color: #1e293b;
  line-height: 1.7;
  margin: 20px 0 25px;
  font-size: 1.05rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}

.user-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5e9;
}

.user-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.user-role {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  padding: 80px 20px;
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

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle,
  .cta-text,
  .section-subtitle {
    font-size: 1rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .hero-cta,
  .cta-btn {
    width: 100%;
    max-width: 300px;
    padding: 16px;
  }

  .container {
    padding: 0 16px;
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