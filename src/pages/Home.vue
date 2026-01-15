<template>
  <div class="home">
    <!-- Enhanced Hero Section -->
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
            <!-- Trust Badges -->
            <div class="trust-badges">
              <span class="badge-industry">
                <i class="fas fa-trophy"></i>
                Infinity-Booking  
              </span>
              <span class="badge-trusted">
                <i class="fas fa-shield-alt"></i>
                Smart Scheduling System
              </span>
            </div>
            
            <!-- Main Headline -->
            <h1 class="hero-premium-title">
              <span class="title-line-1">Infinity-Bookings-provider to customer way </span>
              <span class="title-line-2">
                <span class="text-rotating">
                  <span class="rotating-text active">Connect. Book. Grow.</span>
                  <span class="rotating-text">Your Service Platform</span>
                  <span class="rotating-text">Seamless Operations</span>
                </span>
              </span>
            </h1>
            
            <!-- Improved Value Proposition -->
            <div class="improved-proposition">
              <div class="proposition-grid">
                <div class="proposition-item">
                  <i class="fas fa-bolt"></i>
                  <div>
                    <h4>Instant Connections</h4>
                    <p>Meet clients who need your services, right now.</p>
                  </div>
                </div>
                <div class="proposition-item">
                  <i class="fas fa-calendar-check"></i>
                  <div>
                    <h4>Smart Booking</h4>
                    <p>Calendar-driven scheduling that works for you.</p>
                  </div>
                </div>
                <div class="proposition-item">
                  <i class="fas fa-chart-line"></i>
                  <div>
                    <h4>Grow Your Business</h4>
                    <p>Tools to scale from solo to enterprise.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Primary CTA -->
            <div class="hero-premium-actions">
              <div class="cta-buttons-row">
                <router-link to="/register" class="hero-premium-cta">
                  <i class="fas fa-rocket"></i>
                  Start Free Now
                </router-link>
                
                <router-link to="/login" class="hero-premium-cta secondary">
                  <i class="fas fa-play-circle"></i>
                  View Live Demo
                </router-link>
              </div>
              
              <div class="value-highlights">
                <div class="highlight">
                  <i class="fas fa-check-circle"></i>
                  <span>No setup fees • Free plan available</span>
                </div>
                <div class="highlight">
                  <i class="fas fa-check-circle"></i>
                  <span>Setup in 10 minutes • Mobile-ready</span>
                </div>
              </div>
            </div>
            
            <!-- Provider Testimonials Carousel -->
            <div class="provider-testimonials">
              <div class="testimonial-carousel">
                <div class="testimonial-slide" :class="{ active: activeTestimonialSlide === 0 }">
                  <div class="testimonial-content">
                    "Tripled bookings in 3 months!"
                  </div>
                  <div class="testimonial-author">
                    <span class="author-name">Sarah M.</span>
                    <span class="author-role">• Home Cleaning</span>
                  </div>
                </div>
                <div class="testimonial-slide" :class="{ active: activeTestimonialSlide === 1 }">
                  <div class="testimonial-content">
                    "Effortless client management"
                  </div>
                  <div class="testimonial-author">
                    <span class="author-name">James L.</span>
                    <span class="author-role">• Salon Owner</span>
                  </div>
                </div>
              </div>
              <div class="carousel-dots">
                <span class="dot" :class="{ active: activeTestimonialSlide === 0 }" @click="activeTestimonialSlide = 0"></span>
                <span class="dot" :class="{ active: activeTestimonialSlide === 1 }" @click="activeTestimonialSlide = 1"></span>
              </div>
            </div>
          </div>
          
          <!-- Visual Preview -->
          <div class="hero-premium-visual">
            <div class="preview-container">
              <div class="preview-window">
                <div class="window-header">
                  <div class="window-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                  <div class="window-title">Live Dashboard</div>
                </div>
                
                <div class="preview-content">
                  <!-- Booking Notifications -->
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
                        </div>
                        <div class="notification-time">Just now</div>
                      </div>
                      <div class="notification-item">
                        <div class="notification-avatar">MG</div>
                        <div class="notification-details">
                          <div class="notification-name">Maria Garcia</div>
                          <div class="notification-service">Hair Styling</div>
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
                        <div class="stat-label">Today</div>
                      </div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-value">$2,840</div>
                        <div class="stat-label">Revenue</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Service Categories -->
                  <div class="service-categories-preview">
                    <div class="categories-title">Top Services</div>
                    <div class="categories-tags">
                      <span class="category-tag">Cleaning</span>
                      <span class="category-tag">Repairs</span>
                      <span class="category-tag">Beauty</span>
                      <span class="category-tag">Tutoring</span>
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

    <!-- Compact Testimonials Section -->
    <section class="compact-testimonials">
      <div class="container">
        <h2 class="section-title">What Our Service Providers & Customers Say</h2>
        <p class="section-subtitle">
          Real stories from real people who transformed their service business.
        </p>

        <div class="testimonials-slider">
          <button class="slider-nav prev" @click="prevTestimonials" :disabled="testimonialIndex === 0">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="testimonials-viewport">
            <div class="testimonials-track" :style="{ transform: `translateX(-${testimonialIndex * 100}%)` }">
              <div class="testimonial-pair" v-for="(pair, pairIndex) in testimonialPairs" :key="pairIndex">
                <div class="testimonial-item" v-for="testimonial in pair" :key="testimonial.id">
                  <div class="testimonial-content">
                    <div class="quote-mark">"</div>
                    <p class="feedback">{{ testimonial.feedback }}</p>
                  </div>
                  <div class="testimonial-author">
                    <img :src="testimonial.image" alt="User" class="author-avatar" />
                    <div class="author-info">
                      <h4>{{ testimonial.name }}</h4>
                      <p>{{ testimonial.role }}</p>
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

    <!-- Final CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Grow Your Service Business?</h2>
        <p>
          Join thousands of successful providers. Start your journey today — it's free to begin.
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="cta-btn primary">
            <i class="fas fa-rocket"></i> Start Free Now
          </router-link>
          <router-link to="/login" class="cta-btn secondary">
            <i class="fas fa-play-circle"></i> See Live Demo
          </router-link>
        </div>
        <div class="cta-highlights">
          <div class="highlight-item">
            <i class="fas fa-bolt"></i>
            <span>Setup in 10 minutes</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-user-friends"></i>
            <span>No credit card required</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-mobile-alt"></i>
            <span>Mobile-ready platform</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-headset"></i>
            <span>24/7 support</span>
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
}

/* Trust Badges */
.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.badge-industry, .badge-trusted {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-industry {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.badge-trusted {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* Hero Title */
.hero-premium-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.title-line-1 {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.title-line-2 {
  display: block;
  position: relative;
}

.text-rotating {
  display: inline-block;
  position: relative;
  height: 1.2em;
  overflow: hidden;
  vertical-align: bottom;
}

.rotating-text {
  display: block;
  position: absolute;
  white-space: nowrap;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.5s ease;
}

.rotating-text.active {
  opacity: 1;
  transform: translateY(0);
}

/* Improved Value Proposition */
.improved-proposition {
  margin-bottom: 2.5rem;
}

.proposition-grid {
  display: grid;
  gap: 1.5rem;
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
}

.proposition-item h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.proposition-item p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* Hero Actions */
.hero-premium-actions {
  margin-bottom: 3rem;
}

.cta-buttons-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.hero-premium-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.hero-premium-cta.secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-premium-cta.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.value-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.highlight i {
  color: #10b981;
}

/* Provider Testimonials Carousel */
.provider-testimonials {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.testimonial-carousel {
  position: relative;
  height: 60px;
  overflow: hidden;
}

.testimonial-slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.testimonial-slide.active {
  opacity: 1;
  transform: translateY(0);
}

.testimonial-content {
  font-size: 0.875rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-align: center;
}

.testimonial-author {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.author-name {
  font-weight: 600;
  color: #818cf8;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.carousel-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dots .dot.active {
  background: #6366f1;
  transform: scale(1.2);
}

/* Hero Visual */
.hero-premium-visual {
  position: relative;
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
}

.preview-container:hover {
  transform: perspective(1000px) rotateY(0deg);
}

.preview-window {
  overflow: hidden;
}

.window-header {
  background: rgba(30, 41, 59, 0.8);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
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
}

.window-title {
  font-size: 0.875rem;
  opacity: 0.8;
}

.preview-content {
  padding: 1.5rem;
}

/* Booking Notifications */
.booking-notifications {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
}

.notification-header i {
  color: #f59e0b;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.75rem;
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
}

.notification-details {
  flex: 1;
}

.notification-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
}

.notification-service {
  font-size: 0.75rem;
  opacity: 0.7;
}

.notification-time {
  font-size: 0.75rem;
  opacity: 0.6;
  flex-shrink: 0;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

/* Service Categories Preview */
.service-categories-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.categories-title {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
}

.categories-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Live Booking Counter */
.live-booking-counter {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.counter-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
}

.counter-header i {
  color: #10b981;
  animation: pulse 2s infinite;
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
}

.counter-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
  animation: progressAnimation 2s ease-out;
}

@keyframes progressAnimation {
  from { width: 0%; }
  to { width: 75%; }
}

.counter-label {
  font-size: 0.75rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

/* ========== COLLAPSIBLE SECTIONS ========== */

.collapsible-section {
  padding: 50px 20px;
  background: white;
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
}

.toggle-title i {
  color: #6366f6;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
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
}

/* ========== CATEGORIES GRID ========== */

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 30px auto 0;
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
}

.category-card:hover img {
  transform: scale(1.1) rotate(5deg);
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
  transition: transform 0.2s ease;
}

.service-list li:hover {
  transform: translateX(5px);
  color: #3b82f6;
}

.service-list li i {
  color: #10b981;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
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
}

.benefit-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
}

.benefit-card p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* ========== FEATURES GRID ========== */

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
}

.feature-card > p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-list {
  list-style: none;
  text-align: left;
}

.feature-list li {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease;
}

.feature-list li:hover {
  transform: translateX(5px);
  color: #3b82f6;
}

.feature-list li i {
  color: #10b981;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
}

.feature-list li:hover i {
  transform: scale(1.2);
  color: #059669;
}

/* ========== COMPACT TESTIMONIALS ========== */

.compact-testimonials {
  padding: 100px 20px;
  background: white;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1rem;
}

.testimonials-slider {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1000px;
  margin: 50px auto;
  position: relative;
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

.testimonials-viewport {
  flex: 1;
  overflow: hidden;
  border-radius: 20px;
}

.testimonials-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  min-width: 100%;
  padding: 20px;
}

.testimonial-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
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
}

.testimonial-item:hover::before {
  transform: translateY(0);
}

.quote-mark {
  font-size: 3.5rem;
  color: #3b82f6;
  opacity: 0.2;
  line-height: 1;
  margin-bottom: -15px;
}

.testimonial-item .feedback {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 25px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
  transition: transform 0.3s ease;
}

.testimonial-item:hover .author-avatar {
  transform: scale(1.1);
}

.author-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

.author-info p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.rating {
  color: #fbbf24;
  font-size: 0.9rem;
}

.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.testimonial-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.testimonial-dots .dot.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.testimonial-dots .dot:hover {
  background: #3b82f6;
  transform: scale(1.2);
}

/* ========== CTA SECTION ========== */

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

.cta-highlights {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.highlight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  opacity: 0.9;
  text-align: center;
  min-width: 120px;
}

.highlight-item i {
  color: #ffcc00;
  font-size: 1.5rem;
  margin-bottom: 5px;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .hero-premium-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .hero-premium-text {
    max-width: 100%;
  }
  
  .preview-container {
    transform: none !important;
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 1024px) {
  .testimonial-pair {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .testimonials-slider {
    max-width: 500px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .hint-text {
    display: none;
  }
  
  .cta-highlights {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .hero-premium-title {
    font-size: 2.5rem;
  }
  
  .hero-premium-content {
    padding: 2rem 0;
  }
  
  .cta-buttons-row {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-premium-cta {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .proposition-item {
    text-align: left;
  }
  
  .trust-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
    padding: 0 20px;
  }
  
  .categories-grid,
  .benefits-grid,
  .features-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .testimonial-pair {
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
  
  .cta-highlights {
    flex-direction: column;
    gap: 15px;
  }
  
  .collapsible-toggle {
    font-size: 1.1rem;
    padding: 15px 20px;
  }
  
  .toggle-title i {
    font-size: 1.2rem;
  }
  
  .slider-nav {
    display: none;
  }
  
  .testimonials-viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  
  .testimonials-track {
    display: flex;
  }
  
  .testimonial-pair {
    min-width: 100%;
    scroll-snap-align: start;
  }
}

@media (max-width: 480px) {
  .hero-premium-title {
    font-size: 2rem;
  }
  
  .provider-testimonials {
    padding: 1rem;
  }
  
  .notification-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .notification-details {
    text-align: center;
  }
  
  .preview-container {
    margin: 0 -10px;
    border-radius: 1rem 1rem 0 0;
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
  
  .benefit-card,
  .category-card,
  .feature-card,
  .testimonial-item {
    padding: 20px;
  }
  
  .testimonial-author {
    flex-direction: column;
    text-align: center;
  }
  
  .author-avatar {
    margin-bottom: 10px;
  }
  
  .collapsible-section,
  .compact-testimonials,
  .cta-section {
    padding: 60px 15px;
  }
  
  .collapsible-toggle {
    font-size: 1rem;
    padding: 12px 15px;
  }
  
  .toggle-title {
    gap: 10px;
  }
  
  .toggle-title i {
    font-size: 1rem;
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
}
</style>