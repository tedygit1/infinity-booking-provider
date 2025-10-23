<template>
  <div class="about-page font-poppins">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>About Infinity-Booking</h1>
        <p>
          Infinity-Booking is a flexible, professional, and extendable platform connecting service providers and customers globally.
          We empower providers, ensure quality services, and make managing appointments and payments effortless.
        </p>
        <p>
          Whether you're a small business, a freelancer, or a new provider, join our growing community and thrive!
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="middle-section mission-section">
      <h2 class="section-title">Our Mission</h2>
      <p class="section-text">
        Our mission is to create a reliable ecosystem where service providers can grow their business, customers can find trusted professionals,
        and administrators can maintain high standards effortlessly. The platform is designed to accept infinite services, adapting to all industries.
      </p>
    </section>

    <!-- Values Section -->
    <section class="middle-section values-section">
      <h2 class="section-title">Our Values</h2>
      <div class="values-grid">
        <div class="value-card">
          <i class="fas fa-users fa-2x"></i>
          <h3>Community First</h3>
          <p>We prioritize building a strong and supportive network of providers and customers.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-shield-alt fa-2x"></i>
          <h3>Trust & Safety</h3>
          <p>Verified profiles, secure payments, and transparent feedback ensure reliability.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-chart-line fa-2x"></i>
          <h3>Growth & Insight</h3>
          <p>Providers can track their progress, performance, and expand their services effortlessly.</p>
        </div>
        <div class="value-card">
          <i class="fas fa-infinity fa-2x"></i>
          <h3>Flexibility & Expansion</h3>
          <p>The platform is built to grow endlessly, accommodating new services, industries, and innovations.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Join Infinity-Booking Today</h2>
      <p>
        Become a part of a professional network that empowers providers and connects customers with the best services globally.
      </p>
      <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>
/* Gradient for top, middle, and bottom sections */
.hero-section,
.middle-section,
.cta-section {
  background: linear-gradient(to right, #3b82f6, #1e40af); /* darker, inviting blue gradient */
  color: white;
  text-align: center;
  padding: 80px 20px;
  position: relative;
}

/* Overlay for Hero Section */
.hero-overlay {
  position: absolute;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.2); /* lighter overlay for readability */
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-content h1 {
  font-size: 3.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #ffeb3b; /* bright yellow for inviting read */
}
.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  line-height: 1.8;
  color: #f0f9ff;
}

/* Section Titles */
.section-title {
  font-size: 2.4rem; /* larger font for mission & values */
  margin-bottom: 2rem;
  color: #ffd54f; /* golden accent */
  font-weight: 700;
}
.section-text {
  font-size: 1.2rem; /* increased font size for middle sections */
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: #f0f9ff;
}

/* Values Grid */
.values-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
}
.value-card {
  background: rgba(255,255,255,0.15); /* semi-transparent for gradient show */
  border-radius: 20px;
  width: 240px;
  padding: 25px 20px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.value-card i {
  color: #ffd54f;
  margin-bottom: 12px;
}
.value-card h3 {
  font-size: 1.25rem; /* bigger font for readability */
  margin-bottom: 8px;
  color: #ffd54f;
}
.value-card p {
  font-size: 1rem; /* bigger font for readability */
  color: #f0f9ff;
  line-height: 1.6;
}

/* CTA Button */
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
.cta-btn:hover {
  transform: scale(1.05);
  background: #ffd633;
}

/* Responsive */
@media (max-width: 768px) {
  .values-grid { flex-direction: column; align-items: center; }
}
</style>
