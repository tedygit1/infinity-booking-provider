<template>
  <section class="help-center-page">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-content">
        <h1>Help Center</h1>
        <p>We’re here to support every provider — especially tutors and educators in Mekelle — with fast, clear, and local-friendly guidance.</p>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="container">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Quick answers to common questions from providers like you.</p>
      </div>

      <div class="faq-container">
        <div
          class="faq-item"
          v-for="(faq, index) in faqs"
          :key="index"
          @click="toggleFaq(index)"
          :class="{ active: openIndex === index }"
        >
          <div class="faq-question">
            <h3>{{ faq.question }}</h3>
            <span class="faq-toggle">{{ openIndex === index ? '−' : '+' }}</span>
          </div>
          <Transition name="fade-slide">
            <div v-show="openIndex === index" class="faq-answer">
              <p v-html="faq.answer"></p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="support-section">
        <div class="support-card">
          <div class="support-icon">📧</div>
          <h3>Contact Support</h3>
          <p>
            Email us anytime at
            <a href="mailto:hello@infinitybooking.com" class="email-link"
              >hello@infinitybooking.com</a
            >
          </p>
          <p class="support-note">
            We respond within 24 hours (sooner for urgent issues).
          </p>
        </div>

        <div class="support-card">
          <div class="support-icon">💬</div>
          <h3>Local Support for Mekelle</h3>
          <p>
            Prefer to speak in <strong>Amharic or Tigrinya</strong>? Call our
            local support line:
          </p>
          <p class="phone-number">+251 911 223 344</p>
          <p class="support-note">Available Mon–Sat, 8 AM – 6 PM EAT</p>
        </div>

        <div class="support-card">
          <div class="support-icon">📚</div>
          <h3>Provider Guide</h3>
          <p>
            Download our step-by-step guide for Education & Tutoring providers.
          </p>
          <a href="/docs/provider-guide.pdf" class="download-link" download>
            Download PDF Guide
          </a>
        </div>
      </div>

      <!-- Still Need Help? -->
      <div class="footer-cta">
        <h2>Still Can’t Find What You Need?</h2>
        <p>
          Submit a support request, and our team will reach out directly.
        </p>
        <router-link to="/feedback" class="cta-button">
          Go to Feedback Form
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    question: 'How do I register as a provider?',
    answer:
      'Go to the <strong>Sign Up</strong> page,  fill in your details. You’ll need to upload your ID and a service certificate ,then your application will be confirmed by admin, confirmation(Verification) typically takes 1–2 business days.'
  },
  {
    question: 'How do customers find my services?',
    answer:
      'Your profile appears in search results based on category (e.g., <em>Education/Tutoring</em>), location (e.g., <em>Mekelle</em>), availability, and ratings. You can also share your profile link directly via WhatsApp or email.'
  },
  {
    question: 'How and when do I get paid?',
    answer:
      'Payments are processed securely via our platform. For Ethiopian providers, we support payouts in <strong>ETB</strong> through Telebirr, CBE Birr, or bank transfer. Payouts are released 24 hours after a completed session. You can view your earnings in the <em>Dashboard → Earnings</em> section.'
  },
  {
    question: 'Can I offer group tutoring sessions?',
    answer:
      'Yes! When creating a service, select <em>Group Session</em> and set a maximum number of students (up to 20). You can also upload lesson materials that all participants can access after booking.'
  },
  {
    question: 'What if a customer cancels last minute?',
    answer:
      'Our cancellation policy protects you: <ul><li>Cancellations more than 24 hours before: free</li><li>Within 24 hours: 50% of session fee is paid to you</li><li>No-show: 100% of fee is paid</li></ul>You can adjust these settings in your <em>Service Settings</em>.'
  },
  {
    question: 'How do I verify my phone number or email?',
    answer:
      'After registration, check your email (including spam) for a verification link. For phone verification, you’ll receive an SMS with a 6-digit code. Note: <strong>new@gmail.com</strong> must be verified to receive booking notifications.'
  },
  {
    question: 'Can I manage my availability for weekends only?',
    answer:
      'Absolutely. In your <em>Dashboard → Availability</em>, you can set recurring weekly hours or one-time blocks. Many tutors in Mekelle set availability for weekends and after-school hours (3 PM–8 PM).'
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest. We never share your contact details with customers until a booking is confirmed. Your certificate and ID are stored securely and only used for verification.'
  }
]
</script>

<style scoped>
.help-center-page {
  font-family: 'Poppins', system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

/* Hero */
.hero {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
  color: #cbd5e1;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.section-header {
  text-align: center;
  margin: 4rem 0 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c7d2fe;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
}

/* FAQ */
.faq-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(74, 85, 104, 0.4);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #4f46e5;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #c7d2fe;
}

.faq-toggle {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.faq-item.active .faq-toggle {
  transform: rotate(0deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.faq-answer p {
  margin: 0;
}

.faq-answer ul {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.faq-answer li {
  margin-bottom: 0.25rem;
}

/* Support Section */
.support-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
}

.support-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(74, 85, 104, 0.4);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.support-card:hover {
  transform: translateY(-5px);
}

.support-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #818cf8;
}

.support-card h3 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
  color: #c7d2fe;
}

.email-link,
.phone-number {
  font-weight: 600;
  color: #a5b4fc;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.support-note {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.75rem;
}

.download-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: #60a5fa;
  font-weight: 600;
  text-decoration: none;
}

.download-link:hover {
  text-decoration: underline;
}

/* Footer CTA */
.footer-cta {
  text-align: center;
  margin-top: 4rem;
  padding: 2.5rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(74, 85, 104, 0.3);
}

.footer-cta h2 {
  font-size: 2rem;
  color: #c7d2fe;
  margin-bottom: 1rem;
}

.footer-cta p {
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: 700;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.6);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  max-height: 0;
  padding: 0 1.5rem;
}
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;
  }
  .hero h1 {
    font-size: 2.25rem;
  }
  .hero p {
    font-size: 1rem;
  }
  .section-header h2 {
    font-size: 2rem;
  }
  .faq-question {
    font-size: 1rem;
    padding: 1rem 1.25rem;
  }
  .faq-answer {
    padding: 0 1.25rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem 2rem;
  }
  .support-section {
    gap: 1.25rem;
  }
  .support-card {
    padding: 1.5rem;
  }
}
</style>