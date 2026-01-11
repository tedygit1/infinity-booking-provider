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
               Infinity-Booking ......Infinity Advantage 
              </span>
              <span class="badge-trusted">
                <i class="fas fa-shield-alt"></i>
                system operated, clean scheduler
              </span>
            </div>
            
            <!-- Main Headline -->
            <h1 class="hero-premium-title">
              <span class="title-line-1">Infinity-Bookings</span>
              <span class="title-line-2">
                <span class="text-rotating">
                  <span class="rotating-text active">Service Providers</span>
                  <span class="rotating-text">Business Growth</span>
                  <span class="rotating-text">Client Success</span>
                </span>
              </span>
            </h1>
            
            <!-- Value Proposition -->
            <p class="hero-premium-subtitle">
              Infinity-Booking is a professional service-booking platform built to connect service providers with clients through a clear, calendar-driven scheduling system. It enables providers to list services, define availability with precision, and manage bookings in an organized and reliable way.
              
            </p>
            
            <!-- Primary CTA -->
            <div class="hero-premium-actions">
              <div class="cta-buttons-row">
                <router-link to="/register" class="hero-premium-cta">
                  <i class="fas fa-user-plus"></i>
                  Start Free Account
                </router-link>
                
                <router-link to="/login" class="hero-premium-cta secondary">
                  <i class="fas fa-sign-in-alt"></i>
                  Login to Dashboard
                </router-link>
              </div>
              <p>  <strong>The platform is designed to support efficient daily operations, reduce scheduling friction, and create a smooth booking experience for clients. Whether you are an individual professional, a growing business, or a multi-location enterprise, Infinity-Booking provides the infrastructure, visibility, and control needed to operate confidently and scale sustainably</strong></p>
              <div class="secondary-actions">
                <a href="#how-it-works" class="action-link">
                  <i class="fas fa-info-circle"></i>
                  See How It Works
                </a>
                <a href="#features" class="action-link">
                  <i class="fas fa-list"></i>
                  Explore Features
                </a>
              </div>
            </div>
            
            <!-- Provider Testimonials Carousel -->
            <div class="provider-testimonials">
              <div class="testimonial-carousel">
                <div class="testimonial-slide" :class="{ active: activeTestimonialSlide === 0 }">
                  <div class="testimonial-content">
                    "Tripled my client base in 3 months!"
                  </div>
                  <div class="testimonial-author">
                    <span class="author-name">Sarah M.</span>
                    <span class="author-role">• Home Cleaning Provider</span>
                  </div>
                </div>
                <div class="testimonial-slide" :class="{ active: activeTestimonialSlide === 1 }">
                  <div class="testimonial-content">
                    "Best platform for managing my salon business"
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
                  <div class="window-title">Infinity-Booking Dashboard</div>
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
                    <div class="categories-title">Active Services</div>
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

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card" v-for="stat in stats" :key="stat.id">
          <h2><span ref="statCounter">{{ stat.start }}</span>{{ stat.suffix }}</h2>
          <p>{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
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

    <!-- Service Categories Section -->
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

    <!-- Platform Features Section -->
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

    <!-- Final CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Grow Your Service Business?</h2>
        <p>
          Join thousands of successful providers who trust Infinity-Booking to power their business growth.
          Start your journey today — it's free to begin.
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="cta-btn primary">
            <i class="fas fa-user-plus"></i> Start Free Account
          </router-link>
          <router-link to="/login" class="cta-btn secondary">
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
import { useRouter } from 'vue-router'

const router = useRouter()

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

// New variables for hero enhancements
const activeFaq = ref(1)
const currentTestimonial = ref(0)
const activeTestimonialSlide = ref(0)
const liveBookingCount = ref(0)
const bookingProgress = ref(75)

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length
}

const prevTestimonial = () => {
  currentTestimonial.value = currentTestimonial.value === 0 ? testimonials.length - 1 : currentTestimonial.value - 1
}

// New methods for hero enhancements
const nextTestimonialSlide = () => {
  activeTestimonialSlide.value = (activeTestimonialSlide.value + 1) % 2
}

// Enhanced hero section animations
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
  margin-bottom: 1.5rem;
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

/* Hero Subtitle */
.hero-premium-subtitle {
  font-size: 1.25rem;
  line-height: 1.7;
  opacity: 0.9;
  margin-bottom: 2.5rem;
}

.hero-premium-subtitle strong {
  color: #818cf8;
  font-weight: 600;
}

/* Benefits */
.hero-premium-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.benefit-item i {
  font-size: 1.5rem;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-item h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.benefit-item p {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* ========== NEW ADDITIONS STYLES ========== */

/* Featured Stats Ribbon */
.featured-stats-ribbon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  margin: 2rem 0;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.stat-ribbon-item {
  text-align: center;
  padding: 0 1.5rem;
}

.stat-ribbon-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #6366f1;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-ribbon-label {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 500;
}

.stat-ribbon-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* Service Type Selector */
.service-type-selector {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.selector-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.selector-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.selector-btn i {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #818cf8;
}

.selector-btn span {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.selector-btn.active,
.selector-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: white;
  transform: translateY(-2px);
}

/* Hero Actions */
.hero-premium-actions {
  margin-bottom: 3rem;
}

.hero-premium-cta {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
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

.hero-premium-cta .cta-sub {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: normal;
  margin-top: 0.5rem;
}

.secondary-actions {
  display: flex;
  gap: 1.5rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.action-link:hover {
  color: white;
}

/* Quick Search Widget */
.quick-search-widget {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-widget-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  position: relative;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #818cf8;
  font-size: 0.875rem;
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
}

.search-input input:focus {
  outline: none;
  border-color: #6366f1;
}

.search-btn {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 0.75rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
}

.popular-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.popular-tag {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-tag:hover {
  background: rgba(99, 102, 241, 0.3);
  color: white;
}

/* Social Proof */
.hero-premium-social-proof {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.proof-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.proof-icon {
  width: 40px;
  height: 40px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 1rem;
  flex-shrink: 0;
}

.proof-text {
  flex: 1;
}

.proof-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
}

.proof-desc {
  font-size: 0.75rem;
  opacity: 0.7;
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

/* ========== RESPONSIVE DESIGN FOR HERO SECTION ========== */

@media (max-width: 1200px) {
  .hero-premium-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .hero-premium-text {
    max-width: 100%;
  }
  
  .hero-premium-benefits {
    justify-content: center;
  }
  
  .preview-container {
    transform: none !important;
  }
  
  .selector-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .featured-stats-ribbon {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-ribbon-divider {
    width: 80%;
    height: 1px;
    margin: 0.5rem 0;
  }
}

@media (max-width: 768px) {
  .hero-premium-title {
    font-size: 2.5rem;
  }
  
  .hero-premium-subtitle {
    font-size: 1.125rem;
  }
  
  .hero-premium-benefits {
    grid-template-columns: 1fr;
  }
  
  .secondary-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-premium-social-proof {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .selector-buttons {
    grid-template-columns: 1fr;
  }
  
  .search-input-group {
    flex-direction: column;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .featured-stats-ribbon {
    padding: 0.75rem;
  }
  
  .stat-ribbon-item {
    padding: 0 0.75rem;
  }
  
  .stat-ribbon-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-premium-title {
    font-size: 2rem;
  }
  
  .hero-premium-cta {
    width: 100%;
    text-align: center;
  }
  
  .trust-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .service-type-selector {
    padding: 1rem;
  }
  
  .quick-search-widget {
    padding: 1rem;
  }
  
  .search-input input {
    padding: 0.625rem 1rem 0.625rem 2.25rem;
  }
  
  .popular-searches {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .popular-tag {
    white-space: nowrap;
  }
}

/* Touch-friendly adjustments */
@media (hover: none) and (pointer: coarse) {
  .selector-btn,
  .search-btn,
  .popular-tag {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .selector-btn {
    padding: 1rem 0.25rem;
  }
  
  .search-input input {
    min-height: 44px;
    font-size: 16px;
  }
}

/* ========== YOUR EXISTING SECTIONS STYLES - KEPT EXACTLY AS THEY ARE ========== */

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

/* Responsive Design for Existing Sections */
@media (max-width: 1024px) {
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
  
  .metric-row {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
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
  .hero-premium {
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