<template>
  <div class="home">
    <!-- Hero Section -->
    <section id="hero" class="hero" :style="{ backgroundImage: `url(${mekelleCity})` }">
      <div class="overlay"></div>
      <div class="content">
        <h1 class="animated-title">
          Welcome to <span class="highlight">Infinity-Booking</span>
        </h1>
        <p class="subtitle">
          The all-in-one platform built to empower <strong>service providers of every kind</strong>.  
          Launched with <strong>Home Services</strong>, <strong>Beauty & Salon</strong>, and <strong>Education/Tutoring</strong>,  
          Infinity-Booking is designed to <strong>grow infinitely</strong> — expanding into new industries as more providers join.  
          From small startups to established professionals, our platform helps you manage bookings, build trust,  
          and reach customers effortlessly <strong>Everywhere</strong>.
        </p>
        <div class="hero-buttons">
          <router-link to="/provider/register" class="btn btn-primary">
            Start Free Account <i class="fas fa-arrow-right"></i>
          </router-link>
          <a href="#how-it-works" class="btn btn-secondary">
            <i class="fas fa-play-circle"></i> See How It Works
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card" v-for="stat in stats" :key="stat.id">
          <h2><span ref="statCounter">{{ stat.start }}</span>{{ stat.suffix }}</h2>
          <p>{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="process-section">
      <div class="container">
        <h2 class="section-title">Get Started in 4 Simple Steps</h2>
        <p class="section-subtitle">
          Join thousands of providers who have transformed their business with our platform.
        </p>
        
        <div class="process-steps">
          <div class="process-step">
            <div class="step-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <div class="step-content">
              <h3>Create Your Profile</h3>
              <p>Sign up and showcase your services, experience, and portfolio to attract clients.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="step-content">
              <h3>Set Your Availability</h3>
              <p>Define your working hours and customize your schedule to match your lifestyle.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="step-content">
              <h3>Receive Bookings</h3>
              <p>Get instant notifications when clients book your services and manage everything in one place.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="step-content">
              <h3>Get Paid Securely</h3>
              <p>Receive payments through multiple secure options and track your earnings effortlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Categories -->
    <section class="categories-section">
      <h2 class="section-title">Our Core Service Categories</h2>
      <p class="section-subtitle">
        Infinity-Booking starts with these essential sectors and continuously expands as new providers join the movement.
      </p>
      <div class="categories-grid">
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Home Services" />
          <h3>Home Services</h3>
          <p>From repairs to cleaning — find skilled home experts ready to serve your neighborhood.</p>
          <ul class="service-list">
            <li><i class="fas fa-check"></i> Cleaning Services</li>
            <li><i class="fas fa-check"></i> Plumbing & Electrical</li>
            <li><i class="fas fa-check"></i> Gardening & Landscaping</li>
            <li><i class="fas fa-check"></i> Home Repairs</li>
          </ul>
        </div>
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Beauty Services" />
          <h3>Beauty & Salon</h3>
          <p>Book professional stylists, barbers, and beauty specialists who bring confidence to your doorstep.</p>
          <ul class="service-list">
            <li><i class="fas fa-check"></i> Hair Styling</li>
            <li><i class="fas fa-check"></i> Nail Care</li>
            <li><i class="fas fa-check"></i> Skin Treatments</li>
            <li><i class="fas fa-check"></i> Makeup Services</li>
          </ul>
        </div>
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Tutoring" />
          <h3>Education & Tutoring</h3>
          <p>Connect with experienced tutors and educators to support lifelong learning and growth.</p>
          <ul class="service-list">
            <li><i class="fas fa-check"></i> Academic Tutoring</li>
            <li><i class="fas fa-check"></i> Language Lessons</li>
            <li><i class="fas fa-check"></i> Music & Arts</li>
            <li><i class="fas fa-check"></i> Professional Training</li>
          </ul>
        </div>
        <div class="category-card">
          <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" alt="Professional Services" />
          <h3>Professional Services</h3>
          <p>Access skilled professionals for your business and personal needs.</p>
          <ul class="service-list">
            <li><i class="fas fa-check"></i> IT Support</li>
            <li><i class="fas fa-check"></i> Consulting</li>
            <li><i class="fas fa-check"></i> Event Planning</li>
            <li><i class="fas fa-check"></i> Photography</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <h2 class="section-title">Why Providers Choose Infinity-Booking</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>Business Growth</h3>
          <p>Reach new customers and grow your client base with our powerful marketing tools and platform visibility.</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-tools"></i>
          </div>
          <h3>Smart Management</h3>
          <p>Organize schedules, track bookings, and manage your business with our intuitive dashboard.</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>Secure Payments</h3>
          <p>Receive payments instantly via <strong>Telebirr</strong> with future integrations for <strong>PayPal</strong> and cards.</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3>Mobile Access</h3>
          <p>Manage your business on the go with our mobile-optimized platform accessible from any device.</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-headset"></i>
          </div>
          <h3>24/7 Support</h3>
          <p>Get help whenever you need it with our dedicated customer support team available round the clock.</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">
            <i class="fas fa-star"></i>
          </div>
          <h3>Build Reputation</h3>
          <p>Collect genuine reviews and build trust with our verified rating system that showcases your quality.</p>
        </div>
      </div>
    </section>

    <!-- Platform Features -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Powerful Platform Features</h2>
        <p class="section-subtitle">
          Everything you need to run and grow your service business efficiently.
        </p>
        
        <div class="features-content">
          <div class="feature-image">
            <div class="dashboard-preview">
              <div class="preview-header">
                <div class="preview-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
              </div>
              <div class="preview-body">
                <div class="metric-row">
                  <div class="metric">
                    <div class="metric-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="metric-info">
                      <div class="metric-value">24</div>
                      <div class="metric-label">Today's Bookings</div>
                    </div>
                  </div>
                  <div class="metric">
                    <div class="metric-icon"><i class="fas fa-dollar-sign"></i></div>
                    <div class="metric-info">
                      <div class="metric-value">$1,240</div>
                      <div class="metric-label">Today's Revenue</div>
                    </div>
                  </div>
                </div>
                <div class="chart-placeholder">
                  <div class="chart-bar" style="height: 80%;"></div>
                  <div class="chart-bar" style="height: 60%;"></div>
                  <div class="chart-bar" style="height: 90%;"></div>
                  <div class="chart-bar" style="height: 70%;"></div>
                  <div class="chart-bar" style="height: 85%;"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-calendar"></i>
              </div>
              <div class="feature-text">
                <h4>Smart Scheduling</h4>
                <p>Automated calendar management with real-time availability updates</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div class="feature-text">
                <h4>Instant Notifications</h4>
                <p>Get alerts for new bookings, messages, and payment confirmations</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="feature-text">
                <h4>Business Analytics</h4>
                <p>Track your performance with detailed reports and insights</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="feature-text">
                <h4>Customer Management</h4>
                <p>Keep track of client information and booking history</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="feature-text">
                <h4>Review System</h4>
                <p>Collect and showcase customer reviews to build credibility</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
              <div class="feature-text">
                <h4>Invoicing & Payments</h4>
                <p>Generate professional invoices and accept multiple payment methods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2 class="section-title">What Our Service Providers & Customers Say</h2>
      <p class="section-subtitle">
        Hear from providers and customers who have transformed their service experience with Infinity-Booking.
      </p>

      <div class="testimonial-slider">
        <div class="testimonial-card" v-for="(item, index) in testimonials" :key="index">
          <div class="quote">"</div>
          <p class="feedback">{{ item.feedback }}</p>
          <div class="user-info">
            <img :src="item.image" alt="user photo" />
            <div>
              <h4>{{ item.name }}</h4>
              <p>{{ item.role }}</p>
              <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="testimonial-navigation">
        <button class="nav-btn prev" @click="prevTestimonial">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="nav-btn next" @click="nextTestimonial">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <h2 class="section-title">Simple, Transparent Pricing</h2>
        <p class="section-subtitle">
          Choose the plan that fits your business. No hidden fees, no surprises.
        </p>
        
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="plan-header">
              <h3>Free</h3>
              <div class="price">
                <span class="amount">$0</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> Basic Profile Listing</li>
              <li><i class="fas fa-check"></i> Up to 5 Services</li>
              <li><i class="fas fa-check"></i> 20 Monthly Bookings</li>
              <li><i class="fas fa-check"></i> Email Support</li>
              <li><i class="fas fa-check"></i> Basic Analytics</li>
            </ul>
            <button class="plan-btn" @click="scrollToRegistration">
              Get Started Free
            </button>
          </div>
          
          <div class="pricing-card popular">
            <div class="popular-badge">Most Popular</div>
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="price">
                <span class="amount">$19</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> Everything in Free</li>
              <li><i class="fas fa-check"></i> Unlimited Services</li>
              <li><i class="fas fa-check"></i> Unlimited Bookings</li>
              <li><i class="fas fa-check"></i> Priority Support</li>
              <li><i class="fas fa-check"></i> Advanced Analytics</li>
              <li><i class="fas fa-check"></i> Marketing Tools</li>
              <li><i class="fas fa-check"></i> Custom Booking Page</li>
            </ul>
            <button class="plan-btn primary" @click="scrollToRegistration">
              Start 14-Day Trial
            </button>
          </div>
          
          <div class="pricing-card">
            <div class="plan-header">
              <h3>Business</h3>
              <div class="price">
                <span class="amount">$39</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> Everything in Professional</li>
              <li><i class="fas fa-check"></i> Team Management</li>
              <li><i class="fas fa-check"></i> White-label Solution</li>
              <li><i class="fas fa-check"></i> API Access</li>
              <li><i class="fas fa-check"></i> Dedicated Support</li>
              <li><i class="fas fa-check"></i> Custom Integrations</li>
            </ul>
            <button class="plan-btn" @click="scrollToRegistration">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">
          Get answers to common questions about joining Infinity-Booking.
        </p>
        
        <div class="faq-grid">
          <div class="faq-item" :class="{ active: activeFaq === 1 }" @click="toggleFaq(1)">
            <div class="faq-question">
              <h4>How quickly can I start receiving bookings?</h4>
              <i class="fas" :class="activeFaq === 1 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 1">
              <p>Most providers start receiving booking requests within 24-48 hours of completing their profile. We recommend adding detailed service descriptions, professional photos, and setting competitive pricing to attract customers faster.</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ active: activeFaq === 2 }" @click="toggleFaq(2)">
            <div class="faq-question">
              <h4>What payment methods do you support?</h4>
              <i class="fas" :class="activeFaq === 2 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 2">
              <p>We currently support Telebirr for local payments and are working on integrating PayPal and card payments. All transactions are secured with bank-level encryption, and you can withdraw your earnings directly to your bank account.</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ active: activeFaq === 3 }" @click="toggleFaq(3)">
            <div class="faq-question">
              <h4>Can I manage multiple service locations?</h4>
              <i class="fas" :class="activeFaq === 3 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 3">
              <p>Yes! Our platform allows you to add multiple service locations and set different availability, pricing, and services for each location. This is perfect for providers who serve multiple neighborhoods or cities.</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ active: activeFaq === 4 }" @click="toggleFaq(4)">
            <div class="faq-question">
              <h4>Is there a contract or long-term commitment?</h4>
              <i class="fas" :class="activeFaq === 4 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 4">
              <p>No long-term contracts! You can start with our free plan and upgrade or downgrade at any time. The Professional plan offers a 14-day free trial, and you can cancel your subscription anytime without penalties.</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ active: activeFaq === 5 }" @click="toggleFaq(5)">
            <div class="faq-question">
              <h4>How do you help me attract more customers?</h4>
              <i class="fas" :class="activeFaq === 5 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 5">
              <p>We use multiple strategies including SEO optimization for your profile, featured listings in relevant categories, email campaigns to potential customers in your area, and integration with social media platforms to increase your visibility.</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ active: activeFaq === 6 }" @click="toggleFaq(6)">
            <div class="faq-question">
              <h4>What kind of support do you provide?</h4>
              <i class="fas" :class="activeFaq === 6 ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <div class="faq-answer" v-if="activeFaq === 6">
              <p>We provide 24/7 email support, detailed documentation, video tutorials, and regular training webinars. Professional and Business plan users get priority support with faster response times and dedicated assistance for business growth.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Grow Your Service Business?</h2>
        <p>
          Join thousands of successful providers who trust Infinity-Booking to power their business growth.
          Start your journey today — it's free to begin.
        </p>
        <div class="cta-buttons">
          <router-link to="/provider/register" class="cta-btn primary">
            <i class="fas fa-rocket"></i> Start Free Account
          </router-link>
          <router-link to="/provider/login" class="cta-btn secondary">
            <i class="fas fa-sign-in-alt"></i> Login to Dashboard
          </router-link>
        </div>
        <div class="cta-features">
          <div class="feature">
            <i class="fas fa-check-circle"></i>
            <span>No credit card required</span>
          </div>
          <div class="feature">
            <i class="fas fa-check-circle"></i>
            <span>Free forever plan available</span>
          </div>
          <div class="feature">
            <i class="fas fa-check-circle"></i>
            <span>Setup in under 10 minutes</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mekelleCity from '../assets/Mekelle-City.jpg'

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
  {
    name: 'Jessica M.',
    role: 'Beauty Specialist',
    feedback: 'My bookings increased by 300% in just two months. The platform handles everything from scheduling to payments perfectly.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Robert K.',
    role: 'IT Consultant',
    feedback: 'As a professional service provider, I needed a platform that understood my business needs. Infinity-Booking delivered beyond expectations.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  }
]

const stats = ref([
  { id: 1, start: 0, end: 150, suffix: '+', label: 'Providers Onboarded' },
  { id: 2, start: 0, end: 500, suffix: '+', label: 'Services Listed' },
  { id: 3, start: 0, end: 1200, suffix: '+', label: 'Bookings Completed' },
  { id: 4, start: 0, end: 25, suffix: '+', label: 'Cities Covered' }
])

const activeFaq = ref(1)
const currentTestimonial = ref(0)

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length
}

const prevTestimonial = () => {
  currentTestimonial.value = currentTestimonial.value === 0 ? testimonials.length - 1 : currentTestimonial.value - 1
}

const scrollToRegistration = () => {
  const ctaSection = document.querySelector('.cta-section')
  ctaSection?.scrollIntoView({ behavior: 'smooth' })
}

// Animate counters
onMounted(() => {
  // Animate stats counters
  stats.value.forEach((stat, index) => {
    setTimeout(() => {
      let current = stat.start
      const increment = Math.ceil(stat.end / 100)
      const timer = setInterval(() => {
        current += increment
        if (current >= stat.end) {
          current = stat.end
          clearInterval(timer)
        }
        const element = document.querySelectorAll('.stat-card h2 span')[index]
        if (element) {
          element.textContent = current
        }
      }, 30)
    }, index * 300)
  })

  // Setup testimonial auto-slide
  setInterval(() => {
    nextTestimonial()
  }, 5000)
})
</script>

<style scoped>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.home {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #8f8888;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

/* Hero Section */
.hero {
  min-height: 90vh;
  background-size: cover;
  
  background-position: center;
  background-attachment: fixed;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgb(243, 243, 244);
  padding: 40px 20px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
}

.content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.animated-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  animation: fadeInDown 1s ease-out;
  line-height: 1.2;
  padding-top: 3rem;
 
}

.highlight {
  color: #70dddd;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #ffcc00;
  border-radius: 2px;
}

.subtitle {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  animation: fadeInUp 1.2s ease-out;
  opacity: 0.95;
 
}

.subtitle strong {
  color: #ded977;
  font-weight: 600;
}

.hero-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1.4s ease-out;
}

/* Stats Section */
.stats-section {
  background: #f8fafc;
  padding: 80px 20px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-card h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
}

/* Process Section */
.process-section {
  padding: 100px 0;
  background: white;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;
}

.process-step {
  text-align: center;
  padding: 30px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.process-step:hover {
  border-color: #3b82f6;
  transform: translateY(-5px);
}

.step-icon {
  width: 70px;
  height: 70px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #1d4ed8;
  font-size: 1.8rem;
}

.step-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.step-content p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* Categories Section */
.categories-section {
  padding: 100px 20px;
  background: #f8fafc;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.category-card img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  object-fit: contain;
}

.category-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}

.category-card > p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.service-list {
  list-style: none;
  text-align: left;
}

.service-list li {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.service-list li i {
  color: #10b981;
  font-size: 0.9rem;
}

/* Benefits Section */
.benefits-section {
  padding: 100px 20px;
  background: white;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  border-color: #3b82f6;
  transform: translateY(-5px);
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background: #dbeafe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #1d4ed8;
  font-size: 1.5rem;
}

.benefit-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}

.benefit-card p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  padding: 100px 0;
  background: #f8fafc;
}

.features-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-image {
  padding: 20px;
}

.dashboard-preview {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.preview-header {
  margin-bottom: 20px;
}

.preview-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.preview-body {
  padding: 10px;
}

.metric-row {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.metric {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.metric-label {
  font-size: 0.9rem;
  color: #64748b;
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 150px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 6px 6px 0 0;
  min-height: 10px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: #dbeafe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.feature-text h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.feature-text p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* Testimonials Section */
.testimonials-section {
  padding: 100px 20px;
  background: white;
  position: relative;
}

.testimonial-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 50px auto;
}

.testimonial-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid #e2e8f0;
}

.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.quote {
  font-size: 3.5rem;
  color: #3b82f6;
  opacity: 0.2;
  line-height: 1;
  margin-bottom: -15px;
}

.feedback {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 25px;
  font-style: italic;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

.user-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

.user-info p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.rating {
  color: #fbbf24;
  font-size: 0.9rem;
}

.testimonial-navigation {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: scale(1.1);
}

/* Pricing Section */
.pricing-section {
  padding: 100px 20px;
  background: #f8fafc;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  border: 2px solid #e2e8f0;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card.popular {
  border-color: #3b82f6;
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.plan-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
}

.amount {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
}

.period {
  font-size: 1rem;
  color: #64748b;
}

.plan-features {
  list-style: none;
  margin-bottom: 30px;
}

.plan-features li {
  font-size: 1rem;
  color: #475569;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.plan-features li i {
  color: #10b981;
}

.plan-btn {
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  border: 2px solid #3b82f6;
  background: white;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.plan-btn.primary {
  background: #3b82f6;
  color: white;
}

.plan-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* FAQ Section */
.faq-section {
  padding: 100px 20px;
  background: white;
}

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item.active {
  border-color: #3b82f6;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.1);
}

.faq-question {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: white;
}

.faq-question h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.faq-question i {
  color: #64748b;
  transition: transform 0.3s ease;
  font-size: 1rem;
}

.faq-item.active .faq-question i {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 20px;
}

.faq-answer p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.cta-section p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: #ffcc00;
  color: #1e293b;
}

.cta-btn.primary:hover {
  background: #ffd633;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(255, 204, 0, 0.3);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  opacity: 0.9;
}

.feature i {
  color: #ffcc00;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* Responsive Design */
@media (max-width: 1024px) {
  .animated-title {
    font-size: 2.5rem;
  }
  
  .features-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .feature-image {
    order: 2;
  }
  
  .feature-list {
    order: 1;
  }
  
  .pricing-card.popular {
    transform: none;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
    padding: 60px 20px;
  }
  
  .animated-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 0.6rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-steps,
  .categories-grid,
  .benefits-grid,
  .testimonial-slider,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .cta-features {
    flex-direction: column;
    gap: 15px;
  }
  
  .features-content {
    gap: 30px;
  }
  
  .metric-row {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .animated-title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stat-card h2 {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
  
  .cta-section p {
    font-size: 1.1rem;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .feature-icon {
    margin: 0 auto;
  }
}

/* Print Styles */
@media print {
  .hero {
    background: white !important;
    color: black !important;
    min-height: auto;
  }
  
  .overlay {
    display: none;
  }
  
  .btn, .cta-btn, .plan-btn, .nav-btn {
    display: none;
  }
  
  .pricing-card.popular {
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
}
</style>