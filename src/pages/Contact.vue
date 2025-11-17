<!-- src/pages/ContactPage.vue -->
<template>
  <div class="contact-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Partner with Infinity-Booking</h1>
        <p class="hero-text">
          Grow your business, reach more customers, and manage bookings — all in one powerful platform.
        </p>
        <router-link to="/login" class="cta-btn">🚀 Get Started as a Provider</router-link>
      </div>
    </section>

    <!-- Info Section -->
    <section class="info-section">
      <div class="container">
        <!-- Info Cards -->
        <div class="info-cards">
          <!-- Why Partner -->
          <div class="info-card highlight">
            <i class="fas fa-rocket icon"></i>
            <h2>Why Partner With Us?</h2>
            <ul class="benefits-list">
              <li>✅ Instant visibility to thousands of customers</li>
              <li>✅ Free profile setup & onboarding</li>
              <li>✅ Secure payments & dispute resolution</li>
              <li>✅ Real-time booking & calendar sync</li>
            </ul>
          </div>

          <!-- How It Works -->
          <div class="info-card">
            <i class="fas fa-tasks icon"></i>
            <h2>How to Become a Provider</h2>
            <ol class="steps-list">
              <li>✅ Sign up or log in to your account</li>
              <li>✅ Go to “your Dashboard” → “Become a Provider”</li>
              <li>✅ Fill out your service details & upload documents</li>
  
              <li>✅ Start receiving bookings!</li>
            </ol>
          </div>

          <!-- Contact Info -->
          <div class="info-card">
            <i class="fas fa-headset icon"></i>
            <h2>Contact Us</h2>
            <p class="contact-item">
              <i class="fas fa-envelope"></i> support@infinity-booking.com
            </p>
            <p class="contact-item">
              <i class="fas fa-phone"></i> +251 911 234 567
            </p>
            <p class="contact-item">
              <i class="fas fa-clock"></i> Mon–Fri, 9AM–5PM EAT
            </p>
          </div>
        </div>

        <!-- Testimonials -->
        <div class="testimonials">
          <h2>What Our Providers Say</h2>
          <div class="testimonial-card">
            <div class="quote">“Infinity-Booking helped me double my clients in just 3 months!”</div>
            <div class="author">— Alemu T., Photographer</div>
          </div>
          <div class="testimonial-card">
            <div class="quote">“The payment system is smooth and reliable. Highly recommend.”</div>
            <div class="author">— Selamawit K., Tutor</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-question">Who can become a provider?</div>
            <div class="faq-answer">
              Any individual or business offering services — from tutors to plumbers to photographers. You must be 18+ and provide valid ID.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Is there a fee to join?</div>
            <div class="faq-answer">
              No! Registration is free. We charge a small commission only when you receive a booking.
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">How long does approval take?</div>
            <div class="faq-answer">
              After Admin has reviewed your documents to fit valid business certificate,you will be confirmed and you start creating your service 
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question">Can I edit my profile later?</div>
            <div class="faq-answer">
              Yes! You can update your services, photos, pricing, and availability anytime in your dashboard.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Ready to Grow Your Business?</h2>
        <p class="cta-text">
          Join thousands of providers who trust Infinity-Booking to manage their services and customers.
        </p>
        <router-link to="/login" class="cta-btn">📈 Sign Up / Login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
// No script needed — static content
</script>

<style scoped>
/* Base */
.contact-page {
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
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  position: relative;
  padding: 90px 20px 70px;
  color: white;
  text-align: center;
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
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.cta-btn {
  display: inline-block;
  background: #ffd54f;
  color: #1e3a8a;
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

/* Info Section */
.info-section {
  background: #f8fafc;
  padding: 70px 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  margin-bottom: 40px;
}

.info-card {
  background: white;
  border-radius: 22px;
  padding: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.info-card.highlight {
  border-top: 4px solid #3b82f6;
}

.icon {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 16px;
}

.info-card h2 {
  font-size: 1.5rem;
  color: #1e3a8a;
  margin: 0 0 16px;
  font-weight: 700;
}

.benefits-list,
.steps-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.benefits-list li,
.steps-list li {
  margin-bottom: 10px;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.5;
}

.steps-list li::before {
  content: counter(item) ". ";
  font-weight: bold;
  color: #3b82f6;
}

.steps-list {
  counter-reset: item;
}

.steps-list li {
  counter-increment: item;
}

/* Contact Items */
.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  color: #4b5563;
  font-size: 1rem;
}

.contact-item i {
  color: #3b82f6;
  width: 20px;
  text-align: center;
}

/* Testimonials */
.testimonials {
  margin-top: 40px;
}

.testimonials h2 {
  text-align: center;
  color: #1e3a8a;
  font-size: 1.8rem;
  margin-bottom: 24px;
  font-weight: 700;
}

.testimonial-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  margin-bottom: 20px;
}

.quote {
  font-style: italic;
  color: #2d3748;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.author {
  font-weight: 600;
  color: #1e3a8a;
  font-size: 0.95rem;
}

/* FAQ Section */
.faq-section {
  background: white;
  padding: 70px 0;
}

.section-title {
  text-align: center;
  font-size: 2.1rem;
  color: #1e3a8a;
  margin-bottom: 2rem;
  font-weight: 700;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s ease;
}

.faq-item:hover {
  background: #eef6ff;
  transform: translateX(4px);
}

.faq-question {
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 12px;
  font-size: 1.1rem;
  cursor: pointer;
}

.faq-answer {
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.15rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.95;
  line-height: 1.7;
}

.cta-btn {
  display: inline-block;
  background: #ffd54f;
  color: #1e3a8a;
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
  .cta-text {
    font-size: 1.05rem;
  }

  .info-cards,
  .container {
    grid-template-columns: 1fr !important;
    padding: 0 16px;
  }

  .cta-btn {
    width: 100%;
    max-width: 320px;
    padding: 16px;
  }

  .faq-question {
    font-size: 1rem;
  }
}

/* Accessibility */
.cta-btn:focus {
  outline: 2px solid #ffd54f;
  outline-offset: 4px;
}
</style>