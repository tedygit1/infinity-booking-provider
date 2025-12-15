<template>
  <section class="features-page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-content">
        <h1>Platform Features Built for Providers</h1>
        <p>
          Infinity-Booking empowers service providers — especially in Home services,Body beauty services, Education & Tutoring  and growing infinitelly — with powerful tools to manage bookings, grow your business, and serve customers seamlessly.
        </p>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">98%</div>
            <div class="stat-label">Provider Satisfaction</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Real-Time Booking Sync</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100K+</div>
            <div class="stat-label">Bookings Managed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Features -->
    <div class="container">
      <div class="section-header">
        <h2>Core Platform Features</h2>
        <p>Everything you need to run your service business efficiently — from discovery to payment.</p>
      </div>

      <div class="feature-cards">
        <FeatureCard
          v-for="(feature, index) in coreFeatures"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :color="feature.color"
        />
      </div>
    </div>

    <!-- For Providers -->
    <div class="provider-section">
      <div class="container">
        <div class="section-header">
          <h2>Tools Built for You — The Provider</h2>
          <p>Designed with educators, tutors, coaches, and local service providers in mind — especially those in Mekelle and beyond.</p>
        </div>

        <div class="provider-features">
          <div class="feature-item" v-for="(item, index) in providerFeatures" :key="index">
            <div class="feature-icon" :style="{ backgroundColor: item.color }">
              <span>{{ item.icon }}</span>
            </div>
            <div class="feature-text">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <ul v-if="item.subFeatures">
                <li v-for="(sub, i) in item.subFeatures" :key="i">{{ sub }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- For Customers -->
    <div class="customer-section">
      <div class="container">
        <div class="section-header">
          <h2>What Your Customers Experience</h2>
          <p>Happy customers = repeat bookings. We make it easy for them to find, book, and pay — so you can focus on delivering great service.</p>
        </div>

        <div class="customer-benefits">
          <div class="benefit-card" v-for="(benefit, index) in customerBenefits" :key="index">
            <div class="benefit-icon">{{ benefit.icon }}</div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
   <!-- CTA Section -->
<div class="cta-section">
  <div class="container">
    <h2>Ready to Grow Your Business?</h2>
    <p>Join thousands of providers already using Infinity-Booking to manage bookings, payments, and customer relationships — all in one place.</p>
    <router-link to="/login" class="cta-button">
      Start Free Trial
    </router-link>
  </div>
</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Simulate navigation (replace with router.push in real app)
const navigateToSignup = () => {
  alert('Redirecting to signup... (In real app: use Vue Router)')
}

// Feature data
const coreFeatures = ref([
  {
    title: 'Online Service Discovery',
    description: 'Customers find your services instantly through smart search, categories, and location filters.',
    icon: '🔍',
    color: '#60a5fa'
  },
  {
    title: 'Real-Time Availability',
    description: 'Sync your calendar automatically. No double-bookings. No manual updates.',
    icon: '📅',
    color: '#34d399'
  },
  {
    title: 'Secure Authentication',
    description: 'Two-factor login, encrypted sessions, and role-based access control keep your data safe.',
    icon: '🔒',
    color: '#f59e0b'
  },
  {
    title: 'Provider Dashboard',
    description: 'Your command center: view earnings, bookings, ratings, and analytics at a glance.',
    icon: '📊',
    color: '#8b5cf6'
  },
  {
    title: 'Customer Booking History',
    description: 'See who booked you, when, and how often — perfect for loyalty programs and follow-ups.',
    icon: '📁',
    color: '#ec4899'
  },
  {
    title: 'Automated Notifications',
    description: 'Email/SMS reminders for upcoming sessions, cancellations, and new reviews — set it once, forget it.',
    icon: '🔔',
    color: '#10b981'
  }
])

const providerFeatures = ref([
  {
    title: 'Manage Services & Pricing',
    description: 'Create unlimited service packages, set prices, durations, and availability rules — even for group classes or private tutoring.',
    icon: '💰',
    color: '#3b82f6',
    subFeatures: [
      'Set different pricing for weekdays vs weekends',
      'Offer discounts for bulk bookings',
      'Add add-ons (e.g., materials, travel fee)'
    ]
  },
  {
    title: 'Track Bookings & Earnings',
    description: 'View daily, weekly, or monthly reports. Export CSV for accounting. See what’s working — and what’s not.',
    icon: '📈',
    color: '#10b981',
    subFeatures: [
      'Earnings by service type',
      'Top-performing time slots',
      'Refund and cancellation logs'
    ]
  },
  {
    title: 'Customer Communication Tools',
    description: 'Built-in messaging, video call links (Zoom/Google Meet), and automated follow-up emails — all inside the platform.',
    icon: '💬',
    color: '#8b5cf6',
    subFeatures: [
      'Send personalized session notes',
      'Schedule reschedules without leaving the app',
      'Rate and review customers (optional)'
    ]
  },
  {
    title: 'Education-Specific Tools',
    description: 'Tailored for tutors and educators: lesson plans, attendance tracking, gradebooks, and parent portals.',
    icon: '📚',
    color: '#f59e0b',
    subFeatures: [
      'Upload lesson materials per session',
      'Track student progress over time',
      'Parent communication dashboard'
    ]
  },
  {
    title: 'Verification & Trust Badges',
    description: 'Get verified as a trusted provider. Display badges to build credibility with new customers.',
    icon: '✅',
    color: '#10b981',
    subFeatures: [
      'ID verification (passport, license)',
      'Background check integration (optional)',
      'Verified badge displayed on profile'
    ]
  },
  {
    title: 'Local Support for Mekelle Providers',
    description: 'We speak your language — both literally and culturally. Localized support, currency, and payment options for Ethiopian providers.',
    icon: '🌍',
    color: '#ec4899',
    subFeatures: [
      'Support in Amharic & Tigrinya',
      'ETB payment processing via Telebirr/Birr',
      'Local tax compliance guides'
    ]
  }
])

const customerBenefits = ref([
  {
    title: 'Easy Booking Experience',
    description: 'One-click booking, instant confirmation, and seamless rescheduling — no phone calls needed.',
    icon: '⏱️'
  },
  {
    title: 'Verified Providers',
    description: 'Only vetted, background-checked providers are listed. Safety first — for you and your family.',
    icon: '⭐'
  },
  {
    title: 'Secure Payments',
    description: 'Pay online with confidence. Funds are held securely until after your session is complete.',
    icon: '💳'
  },
  {
    title: 'Flexible Scheduling',
    description: 'Book anytime, anywhere — even late at night. Choose your preferred time slot based on real-time availability.',
    icon: '🌙'
  },
  {
    title: 'Session Reminders',
    description: 'Never miss a session. Get SMS/email reminders 24 hours and 1 hour before your appointment.',
    icon: '⏰'
  },
  {
    title: 'Review & Rate',
    description: 'Share your experience. Help others find great providers — and help us improve our platform.',
    icon: '🌟'
  }
])
</script>

<style scoped>
.features-page {
  font-family: 'Poppins', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

/* Hero Section */
.hero {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.3137 0 6-2.6863 6-6s-2.6863-6-6-6-6 2.6863-6 6 2.6863 6 6 6zm10 0c3.3137 0 6-2.6863 6-6s-2.6863-6-6-6-6 2.6863-6 6 2.6863 6 6 6zm10 0c3.3137 0 6-2.6863 6-6s-2.6863-6-6-6-6 2.6863-6 6 2.6863 6 6 6z' fill='%231e293b' fill-opacity='0.1'/%3E%3C/svg%3E") repeat;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-content p {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  color: #cbd5e1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 85, 104, 0.3);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #818cf8;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.5rem;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #c7d2fe;
}

.section-header p {
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Feature Cards */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 85, 104, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.feature-card .feature-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color);
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #c7d2fe;
}

.feature-card p {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.6;
}

/* Provider Section */
.provider-section {
  background: #0f172a;
  padding: 4rem 0;
}

.provider-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(74, 85, 104, 0.3);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

.feature-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.feature-text h3 {
  font-size: 1.375rem;
  margin-bottom: 0.5rem;
  color: #c7d2fe;
}

.feature-text p {
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.feature-text ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.feature-text li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.feature-text li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #818cf8;
}

/* Customer Section */
.customer-section {
  background: #0f172a;
  padding: 4rem 0;
}

.customer-benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 85, 104, 0.3);
  transition: transform 0.3s ease;
  text-align: center;
}

.benefit-card:hover {
  transform: scale(1.05);
}

.benefit-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #818cf8;
}

.benefit-card h3 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
  color: #c7d2fe;
}

.benefit-card p {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #c7d2fe;
}

.cta-section p {
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.25rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .feature-cards,
  .provider-features,
  .customer-benefits {
    grid-template-columns: 1fr;
  }

  .feature-item {
    flex-direction: column;
  }

  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 4rem 1rem;
  }

  .container {
    padding: 2rem 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-item {
    padding: 1rem;
  }

  .cta-button {
    width: 100%;
    padding: 1rem;
  }
}
</style>