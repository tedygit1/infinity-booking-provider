<template>
  <div class="home">
    <!-- ENHANCED & MORE INFORMATIVE HERO SECTION -->
    <section class="hero-premium">
      <div class="hero-background-premium">
        <div class="hero-gradient"></div>
        <div class="hero-particles">
          <div v-for="i in 15" :key="i" class="particle" :style="particleStyle(i)"></div>
        </div>
      </div>
      
      <div class="container">
        <div class="hero-premium-content">
          <div class="hero-premium-text">
            <!-- FIXED & IMPROVED Trust Badges -->
            <div class="trust-badges-wrapper">
              <h2 class="platform-tagline">Infinity-Booking</h2>
              <div class="trust-badges">
                <div class="badge-row">
                  <span class="badge-industry">
                    <i class="fas fa-trophy"></i>
                    Direct Provider-to-Customer Platform
                  </span>
                  <span class="badge-trusted">
                    <i class="fas fa-shield-alt"></i>
                    Smart Scheduling & Payment System
                  </span>
                </div>
                <div class="badge-row">
                  <span class="badge-new full-width">
                    <i class="fas fa-bolt"></i>
                    No Middlemen, More Earnings
                  </span>
                </div>
              </div>
            </div>
            
            <!-- MORE INFORMATIVE MAIN HEADLINE -->
            <h1 class="hero-premium-title">
              <span class="title-line-1">Connect Directly with Your Customers</span>
              <span class="title-line-2">
                <span class="text-rotating">
                  <span class="rotating-text active">Keep 100% of your earnings</span>
                  <span class="rotating-text">No commissions, more profits</span>
                  <span class="rotating-text">Smart booking & scheduling</span>
                  <span class="rotating-text">Built for Ethiopian service providers</span>
                </span>
              </span>
            </h1>
            
            <!-- IMPROVED & DETAILED VALUE PROPOSITION -->
            <div class="improved-proposition">
              <div class="proposition-grid">
                <div class="proposition-item">
                  <i class="fas fa-handshake"></i>
                  <div>
                    <h4>Direct Connection</h4>
                    <p>Connect directly with customers without middlemen or commissions. Keep 100% of your earnings.</p>
                  </div>
                </div>
                <div class="proposition-item">
                  <i class="fas fa-calendar-check"></i>
                  <div>
                    <h4>Smart Booking System</h4>
                    <p>Automated scheduling, calendar management, and real-time availability updates.</p>
                  </div>
                </div>
                <div class="proposition-item">
                  <i class="fas fa-money-bill-wave"></i>
                  <div>
                    <h4>Instant Payments</h4>
                    <p>Get paid instantly via Telebirr. Secure, fast, and reliable payment processing.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- STATS SHOWCASE -->
            <div class="stats-showcase">
              <div class="stat-item">
                <div class="stat-number">unlimited</div>
                <div class="stat-label">Service Categories</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">smart system</div>
                <div class="stat-label">oriented scheduling</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Support Available</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">few minutes</div>
                <div class="stat-label">Setup Time</div>
              </div>
            </div>
            
            <!-- Primary CTA -->
            <div class="hero-premium-actions">
              <div class="cta-buttons-row">
                <router-link to="/register" class="hero-premium-cta primary-cta">
                  <i class="fas fa-rocket"></i>
                    create your account now and start exploring your service
                </router-link>
                
                <router-link to="/login" class="hero-premium-cta secondary-cta">
                  <i class="fas fa-search"></i>
                  login to your dashboard
                </router-link>
              </div>
              
              <div class="value-highlights">
                <div class="highlight">
                  <i class="fas fa-check-circle"></i>
                  <span>No setup fees • Free forever plan</span>
                </div>
                <div class="highlight">
                  <i class="fas fa-check-circle"></i>
                  <span>Mobile-optimized • Works on any device</span>
                </div>
                <div class="highlight">
                  <i class="fas fa-check-circle"></i>
                  <span>Ethiopian-focused • Local payment support</span>
                </div>
              </div>
            </div>
            
            <!-- QUICK PROVIDER INFO -->
            <div class="provider-quick-info">
              <h4><i class="fas fa-info-circle"></i> How It Works for Providers:</h4>
              <div class="info-steps">
                <div class="step">
                  <span class="step-number">1</span>
                  <span class="step-text">Create your service profile</span>
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  <span class="step-text">Set your availability & pricing</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span class="step-text">Receive & manage bookings</span>
                </div>
                <div class="step">
                  <span class="step-number">4</span>
                  <span class="step-text">Get paid directly via Telebirr</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Visual Preview -->
          <div class="hero-premium-visual">
            <div class="preview-container">
              <div class="window-header">
                <div class="window-dots">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
                <div class="window-title">Provider Dashboard Preview</div>
              </div>
              
              <div class="preview-content">
                <!-- Enhanced Booking Notifications -->
                <div class="booking-notifications">
                  <div class="notification-header">
                    <i class="fas fa-bell"></i>
                    <span>Recent Bookings</span>
                  </div>
                  <div class="notifications-list">
                    <div class="notification-item new">
                      <div class="notification-avatar">JS</div>
                      <div class="notification-details">
                        <div class="notification-name">John Smith</div>
                        <div class="notification-service">Home Cleaning</div>
                        <div class="notification-amount">ETB 500</div>
                      </div>
                      <div class="notification-time">Just now</div>
                    </div>
                    <div class="notification-item">
                      <div class="notification-avatar">MG</div>
                      <div class="notification-details">
                        <div class="notification-name">Maria Garcia</div>
                        <div class="notification-service">Hair Styling</div>
                        <div class="notification-amount">ETB 350</div>
                      </div>
                      <div class="notification-time">15 min ago</div>
                    </div>
                  </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="quick-stats">
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-info">
                      <div class="stat-value">24</div>
                      <div class="stat-label">Today's Bookings</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                      <div class="stat-value">ETB 2,840</div>
                      <div class="stat-label">Today's Revenue</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                      <div class="stat-value">85%</div>
                      <div class="stat-label">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
                
                <!-- Telebirr Payment Preview -->
                <div class="payment-preview">
                  <div class="payment-header">
                    <i class="fas fa-mobile-alt"></i>
                    <span>Telebirr Payments</span>
                  </div>
                  <div class="payment-status">
                    <div class="status-item success">
                      <i class="fas fa-check-circle"></i>
                      <span>Instant Payment Received</span>
                    </div>
                    <div class="status-item pending">
                      <i class="fas fa-clock"></i>
                      <span>ETB 1,200 Pending</span>
                    </div>
                  </div>
                </div>
                
                <!-- Live Booking Counter -->
                <div class="live-booking-counter">
                  <div class="counter-header">
                    <i class="fas fa-bolt"></i>
                    <span>Live Bookings Today</span>
                  </div>
                  <div class="counter-value">{{ liveBookingCount }}</div>
                  <div class="counter-progress">
                    <div class="progress-bar" :style="{ width: bookingProgress + '%' }"></div>
                  </div>
                  <div class="counter-label">{{ bookingProgress }}% of daily capacity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collapsible Service Categories -->
    <section class="collapsible-section categories-collapsible">
      <div class="container">
        <button class="collapsible-toggle hint-animation" @click="toggleCategories">
          <span class="toggle-title">
            <i class="fas fa-layer-group"></i>
            <span class="hint-text">Click to explore</span>
            Our Core Service Categories
          </span>
          <span class="toggle-icon">
            <i class="fas" :class="categoriesVisible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </span>
        </button>
        
        <div class="collapsible-content" :class="{ expanded: categoriesVisible }">
          <p class="section-subtitle">
            Professional services, beautifully organized. Start with these sectors and expand as you grow.
          </p>
          <div class="categories-grid">
            <div class="category-card">
              <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Home Services" />
              <h3>Home Services</h3>
              <p>Skilled experts for repairs, cleaning, and home maintenance.</p>
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
              <p>Professional stylists and beauty specialists at your service.</p>
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
              <p>Connect with experienced tutors for learning and growth.</p>
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
              <p>Skilled professionals for business and personal needs.</p>
              <ul class="service-list">
                <li><i class="fas fa-check"></i> IT Support</li>
                <li><i class="fas fa-check"></i> Consulting</li>
                <li><i class="fas fa-check"></i> Event Planning</li>
                <li><i class="fas fa-check"></i> Photography</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collapsible Benefits Section -->
    <section class="collapsible-section benefits-collapsible">
      <div class="container">
        <button class="collapsible-toggle hint-animation" @click="toggleBenefits">
          <span class="toggle-title">
            <i class="fas fa-star"></i>
            <span class="hint-text">Click to explore</span>
            Why Providers Choose Infinity-Booking
          </span>
          <span class="toggle-icon">
            <i class="fas" :class="benefitsVisible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </span>
        </button>
        
        <div class="collapsible-content" :class="{ expanded: benefitsVisible }">
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3>Business Growth</h3>
              <p>Reach new customers with powerful marketing tools and platform visibility.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-tools"></i>
              </div>
              <h3>Smart Management</h3>
              <p>Organize schedules, track bookings, manage your business efficiently.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Payments</h3>
              <p>Instant payments via <strong>Telebirr</strong>, with PayPal and cards coming soon.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Access</h3>
              <p>Manage your business on the go with our mobile-optimized platform.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Get help whenever you need it with our dedicated support team.</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-star"></i>
              </div>
              <h3>Build Reputation</h3>
              <p>Collect genuine reviews and build trust with our verified rating system.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collapsible Platform Features -->
    <section class="collapsible-section features-collapsible">
      <div class="container">
        <button class="collapsible-toggle hint-animation" @click="toggleFeatures">
          <span class="toggle-title">
            <i class="fas fa-cogs"></i>
            <span class="hint-text">Click to explore</span>
            Powerful Platform Features
          </span>
          <span class="toggle-icon">
            <i class="fas" :class="featuresVisible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </span>
        </button>
        
        <div class="collapsible-content" :class="{ expanded: featuresVisible }">
          <p class="section-subtitle">
            Everything you need to run and grow your service business efficiently.
          </p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-calendar"></i>
              </div>
              <h3>Smart Scheduling</h3>
              <p>Automated calendar management with real-time availability updates.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> Auto-sync calendars</li>
                <li><i class="fas fa-check"></i> Buffer time management</li>
                <li><i class="fas fa-check"></i> Recurring bookings</li>
              </ul>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-bell"></i>
              </div>
              <h3>Instant Notifications</h3>
              <p>Get alerts for new bookings, messages, and payment confirmations.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> SMS & Email alerts</li>
                <li><i class="fas fa-check"></i> Push notifications</li>
                <li><i class="fas fa-check"></i> Custom alert rules</li>
              </ul>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <h3>Business Analytics</h3>
              <p>Track performance with detailed reports and actionable insights.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> Revenue reports</li>
                <li><i class="fas fa-check"></i> Customer insights</li>
                <li><i class="fas fa-check"></i> Performance trends</li>
              </ul>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-users"></i>
              </div>
              <h3>Customer Management</h3>
              <p>Keep track of client information and complete booking history.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> Client profiles</li>
                <li><i class="fas fa-check"></i> Booking history</li>
                <li><i class="fas fa-check"></i> Notes & preferences</li>
              </ul>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-star"></i>
              </div>
              <h3>Review System</h3>
              <p>Collect and showcase customer reviews to build credibility.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> Automated review requests</li>
                <li><i class="fas fa-check"></i> Public rating display</li>
                <li><i class="fas fa-check"></i> Response management</li>
              </ul>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
              <h3>Invoicing & Payments</h3>
              <p>Generate professional invoices and accept multiple payment methods.</p>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> Custom invoices</li>
                <li><i class="fas fa-check"></i> Auto-payment reminders</li>
                <li><i class="fas fa-check"></i> Multi-currency support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- IMPROVED TESTIMONIALS SECTION - WIDER FOR MOBILE -->
    <section class="compact-testimonials">
      <div class="container">
        <h2 class="section-title">What Our Service Providers & Customers Say</h2>
        <p class="section-subtitle">
          Real stories from real people who transformed their service business with Infinity-Booking.
        </p>

        <div class="testimonials-wrapper">
          <button class="slider-nav prev" @click="prevTestimonials" :disabled="testimonialIndex === 0">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="testimonials-container">
            <div class="testimonials-track" :style="{ transform: `translateX(-${testimonialIndex * 100}%)` }">
              <!-- SINGLE COLUMN FOR MOBILE, TWO COLUMNS FOR DESKTOP -->
              <div class="testimonial-column" v-for="(pair, pairIndex) in testimonialPairs" :key="pairIndex">
                <div class="testimonial-item" v-for="testimonial in pair" :key="testimonial.id">
                  <div class="testimonial-content">
                    <div class="quote-mark">"</div>
                    <p class="feedback">{{ testimonial.feedback }}</p>
                    <div class="testimonial-rating">
                      <i class="fas fa-star" v-for="n in 5" :key="n"></i>
                    </div>
                  </div>
                  <div class="testimonial-author">
                    <img :src="testimonial.image" alt="User" class="author-avatar" />
                    <div class="author-info">
                      <h4>{{ testimonial.name }}</h4>
                      <p class="author-role">{{ testimonial.role }}</p>
                      <p class="author-location">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="slider-nav next" @click="nextTestimonials" :disabled="testimonialIndex >= testimonialPairs.length - 1">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="testimonial-dots">
          <span 
            v-for="i in testimonialPairs.length" 
            :key="i" 
            class="dot" 
            :class="{ active: testimonialIndex === i-1 }"
            @click="testimonialIndex = i-1"
          ></span>
        </div>
      </div>
    </section>

    <!-- Enhanced Final CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Grow Your Service Business in Ethiopia?</h2>
        <p>
          Join thousands of successful providers across Ethiopia. Start your journey today — it's free to begin, 
          with direct Telebirr payments and no commission fees.
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="cta-btn primary">
            <i class="fas fa-rocket"></i> Start Free as Provider
          </router-link>
          <router-link to="/login" class="cta-btn secondary">
            <i class="fas fa-search"></i> Book Services as Customer
          </router-link>
        </div>
        <div class="platform-highlights">
          <div class="highlight-item">
            <div class="highlight-icon">
              <i class="fas fa-handshake"></i>
            </div>
            <h4>Direct Connection</h4>
            <p>No middlemen, connect directly</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h4>Telebirr Payments</h4>
            <p>Instant Ethiopian payments</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4>Zero Commission</h4>
            <p>Keep 100% of your earnings</p>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h4>Local Support</h4>
            <p>24/7 Ethiopian support</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Testimonials data
const testimonials = ref([
  {
    id: 1,
    name: 'Sophia L.',
    role: 'Home Service Provider',
    feedback: 'Infinity-Booking helped me reach hundreds of customers without any marketing hassle. The platform feels modern, easy, and powerful.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'Michael B.',
    role: 'Salon Owner',
    feedback: 'I love how simple it is to manage bookings and payments! My clients now book me directly — it has boosted my business visibility.',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    id: 3,
    name: 'Sara T.',
    role: 'Tutor & Educator',
    feedback: 'The system made it so easy for me to offer online and in-person sessions. Infinity-Booking really connects us with learners everywhere!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 4,
    name: 'Daniel K.',
    role: 'Customer',
    feedback: 'Booking home and beauty services has never been smoother. I appreciate the trust and quality providers I can find here.',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
  {
    id: 5,
    name: 'Jessica M.',
    role: 'Beauty Specialist',
    feedback: 'My bookings increased by 300% in just two months. The platform handles everything from scheduling to payments perfectly.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 6,
    name: 'Robert K.',
    role: 'IT Consultant',
    feedback: 'As a professional service provider, I needed a platform that understood my business needs. Infinity-Booking delivered beyond expectations.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  }
])

// Group testimonials into pairs of 2
const testimonialPairs = computed(() => {
  const pairs = []
  for (let i = 0; i < testimonials.value.length; i += 2) {
    pairs.push(testimonials.value.slice(i, i + 2))
  }
  return pairs
})

const testimonialIndex = ref(0)
const benefitsVisible = ref(false)
const categoriesVisible = ref(false)
const featuresVisible = ref(false)

// Navigation for testimonials
const nextTestimonials = () => {
  if (testimonialIndex.value < testimonialPairs.value.length - 1) {
    testimonialIndex.value++
  }
}

const prevTestimonials = () => {
  if (testimonialIndex.value > 0) {
    testimonialIndex.value--
  }
}

// Toggle functions
const toggleBenefits = () => {
  benefitsVisible.value = !benefitsVisible.value
}

const toggleCategories = () => {
  categoriesVisible.value = !categoriesVisible.value
}

const toggleFeatures = () => {
  featuresVisible.value = !featuresVisible.value
}

// Hero section variables
const activeTestimonialSlide = ref(0)
const liveBookingCount = ref(0)
const bookingProgress = ref(75)

// Hero section methods
const nextTestimonialSlide = () => {
  activeTestimonialSlide.value = (activeTestimonialSlide.value + 1) % 2
}

const particleStyle = (index) => {
  const size = Math.random() * 4 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const animationDelay = Math.random() * 5
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${animationDelay}s`
  }
}

onMounted(() => {
  // Text rotation for hero section
  const rotatingText = document.querySelector('.text-rotating')
  if (rotatingText) {
    const texts = rotatingText.querySelectorAll('.rotating-text')
    let current = 0
    
    setInterval(() => {
      texts[current].classList.remove('active')
      current = (current + 1) % texts.length
      texts[current].classList.add('active')
    }, 3000)
  }
  
  // Auto rotate testimonial slides
  setInterval(nextTestimonialSlide, 4000)
  
  // Animate live booking counter
  let counter = 0
  const target = 42
  const counterInterval = setInterval(() => {
    counter++
    liveBookingCount.value = counter
    if (counter >= target) {
      clearInterval(counterInterval)
    }
  }, 50)
  
  // Auto rotate testimonials every 5 seconds
  setInterval(() => {
    if (testimonialIndex.value < testimonialPairs.value.length - 1) {
      testimonialIndex.value++
    } else {
      testimonialIndex.value = 0
    }
  }, 5000)
})
</script>

<style scoped>
/* ========== ENHANCED HERO SECTION STYLES ========== */
.hero-premium {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
  color: white;
  padding: 2rem 0;
}

.hero-background-premium {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: floatParticle 6s infinite ease-in-out;
}

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.hero-premium-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 10;
  padding: 4rem 0;
}

.hero-premium-text {
  max-width: 600px;
  width: 100%;
}

/* FIXED Trust Badges - Optimized for all devices */
.trust-badges-wrapper {
  margin-bottom: 2rem;
  width: 100%;
}

.platform-tagline {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
}

.platform-tagline::before {
  content: "🚀";
  font-size: 1.5rem;
}

.trust-badges {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.badge-industry, .badge-trusted, .badge-new {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
  text-align: center;
  justify-content: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  min-height: 3rem;
}

.badge-industry {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
}

.badge-trusted {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.badge-new {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  width: 100%;
}

.badge-new.full-width {
  width: 100%;
  max-width: none;
  display: flex;
  justify-content: center;
  text-align: center;
}

.badge-industry i,
.badge-trusted i,
.badge-new i {
  font-size: 1rem;
  flex-shrink: 0;
  min-width: 1.2rem;
}

/* Hero Title - Optimized for readability */
.hero-premium-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 2rem;
  width: 100%;
}

.title-line-1 {
  display: block;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.75rem;
  font-size: 2.8rem;
  line-height: 1.1;
}

.title-line-2 {
  display: block;
  position: relative;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.3;
}

.text-rotating {
  display: inline-block;
  position: relative;
  height: 1.4em;
  overflow: hidden;
  vertical-align: bottom;
  width: 100%;
}

.rotating-text {
  display: block;
  position: absolute;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.5s ease;
  white-space: normal;
  width: 100%;
}

.rotating-text.active {
  opacity: 1;
  transform: translateY(0);
}

/* Improved Value Proposition */
.improved-proposition {
  margin-bottom: 2.5rem;
  width: 100%;
}

.proposition-grid {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}

.proposition-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  width: 100%;
}

.proposition-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
  border-color: rgba(99, 102, 241, 0.3);
}

.proposition-item i {
  color: #6366f1;
  font-size: 1.5rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
  min-width: 1.5rem;
}

.proposition-item h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.proposition-item p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  width: 100%;
}

/* Stats Showcase */
.stats-showcase {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #6366f1;
  line-height: 1;
  margin-bottom: 0.5rem;
  display: block;
  width: 100%;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.3;
  display: block;
  width: 100%;
}

/* Provider Quick Info */
.provider-quick-info {
  background: rgba(99, 102, 241, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(99, 102, 241, 0.2);
  width: 100%;
}

.provider-quick-info h4 {
  font-size: 1.1rem;
  color: #818cf8;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.info-steps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.step-number {
  width: 2rem;
  height: 2rem;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 2rem;
}

.step-text {
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
  width: 100%;
}

/* Hero Actions */
.hero-premium-actions {
  margin-bottom: 3rem;
  width: 100%;
}

.cta-buttons-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.hero-premium-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  justify-content: center;
  text-align: center;
  min-height: 3.5rem;
}

.hero-premium-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.hero-premium-cta:hover::before {
  left: 100%;
}

.hero-premium-cta:hover {
  transform: translateY(-2px);
}

.hero-premium-cta.primary-cta {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.hero-premium-cta.primary-cta:hover {
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.hero-premium-cta.secondary-cta {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-premium-cta.secondary-cta:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1);
}

.value-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  width: 100%;
}

.highlight i {
  color: #10b981;
  min-width: 1rem;
}

/* Hero Visual */
.hero-premium-visual {
  position: relative;
  width: 100%;
}

.preview-container {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  transform: perspective(1000px) rotateY(-5deg);
  transition: transform 0.3s ease;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.preview-container:hover {
  transform: perspective(1000px) rotateY(0deg);
}

.window-header {
  background: rgba(30, 41, 59, 0.8);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.window-dots {
  display: flex;
  gap: 0.5rem;
}

.window-dots .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.window-title {
  font-size: 0.875rem;
  opacity: 0.8;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-content {
  padding: 1.5rem;
  width: 100%;
}

/* Booking Notifications */
.booking-notifications {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
  width: 100%;
}

.notification-header i {
  color: #f59e0b;
  flex-shrink: 0;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.75rem;
  width: 100%;
}

.notification-item.new {
  border-left: 3px solid #6366f1;
}

.notification-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 36px;
}

.notification-details {
  flex: 1;
  min-width: 0;
}

.notification-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-service {
  font-size: 0.75rem;
  opacity: 0.7;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-amount {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
  line-height: 1.2;
}

.notification-time {
  font-size: 0.75rem;
  opacity: 0.6;
  flex-shrink: 0;
  min-width: 3.5rem;
  text-align: right;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.quick-stats .stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.quick-stats .stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  min-width: 48px;
}

.quick-stats .stat-info {
  flex: 1;
  min-width: 0;
}

.quick-stats .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  display: block;
}

.quick-stats .stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  line-height: 1.2;
  display: block;
}

/* Payment Preview */
.payment-preview {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid rgba(16, 185, 129, 0.2);
  width: 100%;
}

.payment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  width: 100%;
}

.payment-header i {
  color: #10b981;
  flex-shrink: 0;
}

.payment-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  width: 100%;
}

.status-item.success {
  color: #10b981;
}

.status-item.pending {
  color: #f59e0b;
}

/* Live Booking Counter */
.live-booking-counter {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  width: 100%;
}

.counter-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  width: 100%;
}

.counter-header i {
  color: #10b981;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.counter-value {
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  color: #10b981;
  margin-bottom: 0.5rem;
  display: block;
  width: 100%;
}

.counter-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
  width: 100%;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
  animation: progressAnimation 2s ease-out;
  width: 75%;
}

@keyframes progressAnimation {
  from { width: 0%; }
  to { width: 75%; }
}

.counter-label {
  font-size: 0.75rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  width: 100%;
}

/* ========== COLLAPSIBLE SECTIONS ========== */
.collapsible-section {
  padding: 50px 20px;
  background: white;
  width: 100%;
}

.categories-collapsible {
  background: #f8fafc;
}

.benefits-collapsible {
  background: white;
}

.features-collapsible {
  background: #f8fafc;
}

.collapsible-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 30px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.categories-collapsible .collapsible-toggle {
  background: #ffffff;
  border-color: #dbeafe;
  border-width: 3px;
}

.benefits-collapsible .collapsible-toggle {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.features-collapsible .collapsible-toggle {
  background: #ffffff;
  border-color: #fef3c7;
  border-width: 3px;
}

.hint-animation {
  animation: hintPulse 2s infinite;
}

.hint-animation:hover {
  animation: none;
}

@keyframes hintPulse {
  0%, 100% {
    border-color: #e2e8f0;
    transform: translateY(0);
  }
  50% {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
  }
}

.categories-collapsible .hint-animation {
  animation: hintPulseBlue 2s infinite;
}

@keyframes hintPulseBlue {
  0%, 100% {
    border-color: #dbeafe;
    transform: translateY(0);
  }
  50% {
    border-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(29, 78, 216, 0.15);
  }
}

.features-collapsible .hint-animation {
  animation: hintPulseYellow 2s infinite;
}

@keyframes hintPulseYellow {
  0%, 100% {
    border-color: #fef3c7;
    transform: translateY(0);
  }
  50% {
    border-color: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15);
  }
}

.collapsible-toggle:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.15);
}

.toggle-title {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  width: 100%;
  text-align: left;
}

.toggle-title i {
  color: #6366f6;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.features-collapsible .toggle-title i {
  color: #f59e0b;
}

.collapsible-toggle:hover .toggle-title i {
  transform: scale(1.2) rotate(5deg);
}

.hint-text {
  position: absolute;
  top: -25px;
  left: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #3b82f6;
  background: #dbeafe;
  padding: 4px 10px;
  border-radius: 20px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.features-collapsible .hint-text {
  color: #d97706;
  background: #fef3c7;
}

.collapsible-toggle:hover .hint-text {
  opacity: 1;
  transform: translateY(0);
}

.toggle-icon i {
  color: #64748b;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.collapsible-toggle:hover .toggle-icon i {
  color: #3b82f6;
  transform: scale(1.2);
}

.collapsible-content {
  max-width: 1200px;
  margin: 0 auto;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.collapsible-content.expanded {
  max-height: 3000px;
  margin-top: 30px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
  line-height: 1.6;
  width: 100%;
  padding: 0 20px;
}

/* ========== CATEGORIES GRID ========== */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 30px auto 0;
  width: 100%;
  padding: 0 20px;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.category-card:hover::before {
  transform: translateY(0);
}

.category-card img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  object-fit: contain;
  transition: transform 0.3s ease;
  align-self: center;
}

.category-card:hover img {
  transform: scale(1.1) rotate(5deg);
}

.category-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  line-height: 1.3;
  width: 100%;
}

.category-card > p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  width: 100%;
  flex: 1;
}

.service-list {
  list-style: none;
  text-align: left;
  width: 100%;
}

.service-list li {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease;
  width: 100%;
}

.service-list li:hover {
  transform: translateX(5px);
  color: #3b82f6;
}

.service-list li i {
  color: #10b981;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.service-list li:hover i {
  transform: scale(1.2);
  color: #059669;
}

/* ========== BENEFITS GRID ========== */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.benefit-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.benefit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #34d399);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  border-color: #3b82f6;
  transform: translateY(-5px);
}

.benefit-card:hover::before {
  transform: translateY(0);
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
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.benefit-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  line-height: 1.3;
  width: 100%;
}

.benefit-card p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  flex: 1;
  width: 100%;
}

/* ========== FEATURES GRID ========== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.feature-card:hover::before {
  transform: translateY(0);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: #fef3c7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #d97706;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  line-height: 1.3;
  width: 100%;
}

.feature-card > p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  width: 100%;
}

.feature-list {
  list-style: none;
  text-align: left;
  width: 100%;
}

.feature-list li {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease;
  width: 100%;
}

.feature-list li:hover {
  transform: translateX(5px);
  color: #3b82f6;
}

.feature-list li i {
  color: #10b981;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.feature-list li:hover i {
  transform: scale(1.2);
  color: #059669;
}

/* ========== IMPROVED TESTIMONIALS SECTION ========== */
.compact-testimonials {
  padding: 80px 20px;
  background: white;
  width: 100%;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1rem;
  width: 100%;
  padding: 0 20px;
  line-height: 1.2;
}

.testimonials-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 1200px;
  margin: 50px auto 30px;
  position: relative;
  width: 100%;
  padding: 0 20px;
}

.testimonials-container {
  flex: 1;
  overflow: hidden;
  border-radius: 20px;
  width: 100%;
}

.testimonials-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.testimonial-column {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  min-width: 100%;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
}

.testimonial-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  width: 100%;
}

.testimonial-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.testimonial-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.testimonial-item:hover::before {
  transform: translateY(0);
}

.testimonial-content {
  flex: 1;
  margin-bottom: 25px;
  width: 100%;
}

.quote-mark {
  font-size: 3.5rem;
  color: #3b82f6;
  opacity: 0.2;
  line-height: 1;
  margin-bottom: -15px;
}

.feedback {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
}

.testimonial-rating {
  color: #fbbf24;
  font-size: 1rem;
  margin-top: 10px;
  width: 100%;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  width: 100%;
}

.author-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.testimonial-item:hover .author-avatar {
  transform: scale(1.1);
}

.author-info {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.author-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-role {
  color: #3b82f6;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 3px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-location {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slider-nav {
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
  flex-shrink: 0;
  min-width: 50px;
}

.slider-nav:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.slider-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
  width: 100%;
  padding: 0 20px;
}

.testimonial-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.testimonial-dots .dot.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.testimonial-dots .dot:hover {
  background: #3b82f6;
  transform: scale(1.2);
}

/* ========== ENHANCED CTA SECTION ========== */
.cta-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
  width: 100%;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  width: 100%;
  padding: 0 20px;
}

.cta-section p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  width: 100%;
  padding: 0 20px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
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
  width: 100%;
  max-width: 300px;
  min-height: 3.5rem;
  text-align: center;
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

.platform-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 50px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding: 0 20px;
}

.highlight-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: transform 0.3s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.highlight-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.highlight-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.highlight-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
  line-height: 1.3;
  width: 100%;
}

.highlight-item p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
  width: 100%;
}

/* ========== RESPONSIVE DESIGN ========== */
/* Base mobile optimizations */
@media (max-width: 1400px) {
  .container {
    max-width: 100%;
    padding: 0 40px;
  }
  
  .hero-premium-content {
    gap: 3rem;
  }
}

@media (max-width: 1200px) {
  .container {
    padding: 0 30px;
  }
  
  .hero-premium-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .hero-premium-text {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .preview-container {
    transform: none !important;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .platform-tagline {
    justify-content: center;
    text-align: center;
  }
  
  .trust-badges {
    align-items: center;
  }
  
  .badge-row {
    justify-content: center;
  }
}

@media (max-width: 1024px) {
  .container {
    padding: 0 25px;
  }
  
  .testimonial-column {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .testimonials-wrapper {
    max-width: 600px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .hint-text {
    display: none;
  }
  
  .platform-highlights {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }
  
  .categories-grid,
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-premium-title {
    font-size: 2.5rem;
  }
  
  .title-line-1 {
    font-size: 2.2rem;
  }
  
  .title-line-2 {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
  
  .hero-premium-title {
    font-size: 2rem;
  }
  
  .title-line-1 {
    font-size: 1.8rem;
    line-height: 1.2;
  }
  
  .title-line-2 {
    font-size: 1.4rem;
    line-height: 1.3;
  }
  
  .hero-premium-content {
    padding: 2rem 0;
    gap: 2.5rem;
  }
  
  .platform-tagline {
    font-size: 1.5rem;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
  }
  
  .platform-tagline::before {
    margin-right: 0;
  }
  
  .trust-badges {
    gap: 0.75rem;
    max-width: 100%;
  }
  
  .badge-row {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
  
  .badge-industry, .badge-trusted, .badge-new {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    justify-content: center;
    text-align: center;
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
    line-height: 1.4;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
  
  .badge-industry i,
  .badge-trusted i,
  .badge-new i {
    font-size: 1.1rem;
    margin-bottom: 0;
  }
  
  .cta-buttons-row {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-premium-cta {
    width: 100%;
    max-width: 350px;
    justify-content: center;
    padding: 1rem 1.5rem;
  }
  
  .proposition-item {
    text-align: left;
    padding: 1.2rem;
  }
  
  .stats-showcase {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.6rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
  
  .info-steps {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .step {
    justify-content: flex-start;
    gap: 1rem;
  }
  
  .value-highlights {
    text-align: left;
    align-items: flex-start;
    gap: 0.8rem;
  }
  
  .highlight {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.8rem;
    line-height: 1.2;
  }
  
  .section-subtitle {
    font-size: 1rem;
    padding: 0 15px;
    line-height: 1.5;
  }
  
  .categories-grid,
  .benefits-grid,
  .features-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
    gap: 25px;
  }
  
  .testimonials-wrapper {
    flex-direction: column;
    gap: 20px;
    padding: 0 15px;
  }
  
  .slider-nav {
    order: 3;
    margin-top: 20px;
    display: flex !important;
  }
  
  .testimonials-container {
    width: 100%;
    order: 1;
  }
  
  .testimonial-column {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 5px;
  }
  
  .testimonial-item {
    margin: 0 5px;
    padding: 25px 20px;
    min-height: auto;
  }
  
  .feedback {
    -webkit-line-clamp: 4;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .author-avatar {
    width: 50px;
    height: 50px;
  }
  
  .author-info h4 {
    font-size: 1rem;
  }
  
  .author-role, .author-location {
    font-size: 0.85rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 350px;
    padding: 1rem 1.5rem;
  }
  
  .platform-highlights {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 400px;
  }
  
  .highlight-item {
    padding: 1.5rem;
  }
  
  .collapsible-toggle {
    font-size: 1.1rem;
    padding: 18px 20px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .toggle-title {
    gap: 12px;
    justify-content: center;
  }
  
  .toggle-title i {
    font-size: 1.2rem;
  }
  
  .toggle-icon {
    display: none;
  }
  
  .preview-container {
    max-width: 100%;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quick-stats .stat-item {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .hero-premium {
    padding: 1.5rem 0;
    min-height: auto;
  }
  
  .hero-premium-title {
    font-size: 1.8rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .title-line-1 {
    font-size: 1.6rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .title-line-2 {
    font-size: 1.2rem;
    line-height: 1.3;
  }
  
  .platform-tagline {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
  
  .badge-industry, .badge-trusted, .badge-new {
    font-size: 0.85rem;
    padding: 0.8rem 1rem;
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    text-align: center;
    min-height: auto;
  }
  
  .badge-industry i,
  .badge-trusted i,
  .badge-new i {
    font-size: 1rem;
    margin-bottom: 0;
  }
  
  .proposition-grid {
    gap: 1rem;
  }
  
  .proposition-item {
    padding: 1rem;
    gap: 0.8rem;
  }
  
  .proposition-item i {
    font-size: 1.3rem;
  }
  
  .proposition-item h4 {
    font-size: 1rem;
  }
  
  .proposition-item p {
    font-size: 0.9rem;
  }
  
  .stats-showcase {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.2rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
    margin-bottom: 0;
    min-width: 3.5rem;
    text-align: right;
  }
  
  .stat-label {
    font-size: 0.85rem;
    text-align: left;
    flex: 1;
  }
  
  .provider-quick-info {
    padding: 1.2rem;
  }
  
  .provider-quick-info h4 {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
  
  .step {
    gap: 0.8rem;
  }
  
  .step-number {
    width: 1.8rem;
    height: 1.8rem;
    font-size: 0.8rem;
    min-width: 1.8rem;
  }
  
  .step-text {
    font-size: 0.85rem;
  }
  
  .hero-premium-cta {
    font-size: 1rem;
    padding: 0.9rem 1.2rem;
    min-height: 3rem;
  }
  
  .value-highlights {
    gap: 0.6rem;
  }
  
  .highlight {
    font-size: 0.85rem;
    gap: 0.4rem;
  }
  
  .section-title {
    font-size: 1.6rem;
    padding: 0 10px;
    margin-bottom: 0.8rem;
  }
  
  .section-subtitle {
    font-size: 0.95rem;
    padding: 0 10px;
    margin-bottom: 2rem;
  }
  
  .compact-testimonials,
  .collapsible-section,
  .cta-section {
    padding: 60px 15px;
  }
  
  .testimonial-item {
    padding: 20px 15px;
    min-height: auto;
  }
  
  .feedback {
    font-size: 0.95rem;
    -webkit-line-clamp: 5;
    line-height: 1.5;
  }
  
  .quote-mark {
    font-size: 3rem;
  }
  
  .author-avatar {
    width: 45px;
    height: 45px;
  }
  
  .author-info h4 {
    font-size: 0.95rem;
  }
  
  .author-role, .author-location {
    font-size: 0.8rem;
  }
  
  .cta-section h2 {
    font-size: 2rem;
    padding: 0 10px;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .cta-section p {
    font-size: 1.1rem;
    padding: 0 10px;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .cta-btn {
    font-size: 1rem;
    padding: 0.9rem 1.2rem;
    min-height: 3rem;
  }
  
  .highlight-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  .highlight-item h4 {
    font-size: 1rem;
    margin-bottom: 5px;
  }
  
  .highlight-item p {
    font-size: 0.85rem;
  }
  
  .benefit-card,
  .category-card,
  .feature-card {
    padding: 20px;
  }
  
  .benefit-icon,
  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
  
  .benefit-card h3,
  .category-card h3,
  .feature-card h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .benefit-card p,
  .category-card > p,
  .feature-card > p {
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  .service-list li,
  .feature-list li {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
  
  .testimonial-author {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  
  .collapsible-toggle {
    font-size: 1rem;
    padding: 15px 12px;
    text-align: left;
  }
  
  .toggle-title {
    gap: 10px;
    text-align: left;
  }
  
  .toggle-title i {
    font-size: 1rem;
  }
  
  /* Improved touch targets for mobile */
  .hero-premium-cta,
  .cta-btn,
  .slider-nav,
  .collapsible-toggle,
  .testimonial-dots .dot {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .slider-nav {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }
  
  /* Fix for rotating text on mobile */
  .text-rotating {
    height: auto;
    min-height: 1.4em;
    display: block;
  }
  
  .rotating-text {
    white-space: normal;
    text-align: center;
    width: 100%;
    position: relative;
    display: block;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
  
  .rotating-text.active {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Fix for preview content on mobile */
  .preview-content {
    padding: 1rem;
  }
  
  .quick-stats .stat-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 1rem;
  }
  
  .quick-stats .stat-value {
    font-size: 1.3rem;
  }
  
  .quick-stats .stat-label {
    font-size: 0.7rem;
  }
  
  .notification-item {
    padding: 0.6rem;
    gap: 0.8rem;
  }
  
  .notification-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    font-size: 0.7rem;
  }
  
  .notification-name {
    font-size: 0.8rem;
  }
  
  .notification-service,
  .notification-amount,
  .notification-time {
    font-size: 0.7rem;
  }
}

/* Extra small devices (phones under 360px) */
@media (max-width: 360px) {
  .container {
    padding: 0 10px;
  }
  
  .hero-premium-title {
    font-size: 1.6rem;
  }
  
  .title-line-1 {
    font-size: 1.4rem;
  }
  
  .title-line-2 {
    font-size: 1.1rem;
  }
  
  .badge-industry, .badge-trusted, .badge-new {
    font-size: 0.8rem;
    padding: 0.7rem 0.9rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .section-subtitle {
    font-size: 0.9rem;
  }
  
  .cta-section h2 {
    font-size: 1.8rem;
  }
  
  .cta-section p {
    font-size: 1rem;
  }
  
  .benefit-card,
  .category-card,
  .feature-card,
  .testimonial-item {
    padding: 15px;
  }
}

/* Touch-friendly adjustments */
@media (hover: none) and (pointer: coarse) {
  .hero-premium-cta,
  .action-link,
  .carousel-dots .dot,
  .slider-nav,
  .testimonial-dots .dot,
  .collapsible-toggle {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-premium-cta {
    padding: 1.25rem 2rem;
  }
  
  .notification-item {
    min-height: 60px;
  }
  
  .collapsible-toggle {
    min-height: 60px;
  }
  
  .hint-animation {
    animation: none;
  }
  
  /* Remove hover effects on touch devices */
  .proposition-item:hover,
  .category-card:hover,
  .benefit-card:hover,
  .feature-card:hover,
  .testimonial-item:hover,
  .highlight-item:hover,
  .cta-btn:hover,
  .hero-premium-cta:hover {
    transform: none;
  }
  
  /* Keep only color/background changes on touch */
  .hero-premium-cta:active,
  .cta-btn:active,
  .collapsible-toggle:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

/* Print Styles */
@media print {
  .hero-premium {
    background: white !important;
    color: black !important;
    min-height: auto;
  }
  
  .hero-gradient,
  .hero-particles {
    display: none;
  }
  
  .btn, .cta-btn, .slider-nav, .hero-premium-cta, .collapsible-toggle {
    display: none !important;
  }
  
  .preview-container {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
  
  .collapsible-content {
    max-height: none !important;
    display: block !important;
  }
  
  .container {
    max-width: 100%;
    padding: 0;
  }
  
  .hero-premium-content {
    display: block;
    padding: 1rem 0;
  }
  
  .hero-premium-visual {
    display: none;
  }
  
  .platform-tagline {
    color: black !important;
    -webkit-text-fill-color: black;
    background: none;
  }
  
  .badge-industry, .badge-trusted, .badge-new {
    border: 1px solid #ccc !important;
    color: black !important;
    background: white !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .hero-premium {
    background: #000000;
  }
  
  .badge-industry,
  .badge-trusted,
  .badge-new {
    border: 2px solid currentColor;
  }
  
  .proposition-item,
  .testimonial-item,
  .benefit-card,
  .feature-card,
  .category-card {
    border: 2px solid #ccc;
  }
  
  .text-rotating .rotating-text {
    background: none;
    -webkit-text-fill-color: #ffcc00;
    color: #ffcc00;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hero-gradient,
  .particle,
  .rotating-text,
  .progress-bar,
  .counter-header i,
  .hint-animation,
  .collapsible-toggle,
  .proposition-item,
  .category-card,
  .benefit-card,
  .feature-card,
  .testimonial-item,
  .highlight-item,
  .cta-btn,
  .hero-premium-cta,
  .slider-nav {
    animation: none !important;
    transition: none !important;
  }
  
  .text-rotating {
    height: auto;
    overflow: visible;
  }
  
  .rotating-text {
    position: static;
    opacity: 1;
    transform: none;
    display: block;
  }
  
  .rotating-text:not(.active) {
    display: none;
  }
}
</style>