<!-- src/pages/Home.vue -->
<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Infinity Booking: The Complete Platform for Ethiopian Service Businesses</h1>
          <p class="hero-subtitle">
            Connect with clients, manage appointments, accept local payments, and grow your business — all from one professional platform designed specifically for Ethiopia.
          </p>
          
          <div class="hero-cta">
            <button @click="goToRegister" class="btn-primary">
              Start Your Free 30-Day Trial
            </button>
            <button @click="goToDemo" class="btn-secondary">
              See Platform Demo
            </button>
          </div>
          
          <div class="hero-note">
            <p>No credit card required • Cancel anytime • Ethiopian support team</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Overview -->
    <section class="overview">
      <div class="container">
        <div class="section-header">
          <h2>What Infinity Booking Offers</h2>
          <p>A comprehensive platform built to address the specific needs of Ethiopian service providers</p>
        </div>
        
        <div class="overview-content">
          <div class="overview-item">
            <div class="overview-title">Digital Client Connection</div>
            <p>Create your professional business profile and share your unique booking link. Clients can book appointments 24/7 through WhatsApp, Telegram, or your website. No more missed calls or scheduling conflicts.</p>
          </div>
          
          <div class="overview-item">
            <div class="overview-title">Local Payment Integration</div>
            <p>Accept payments through Telebirr, CBE Birr, bank transfers, and cash — all tracked in one dashboard. Receive instant notifications when clients pay, and automatically reconcile payments with appointments.</p>
          </div>
          
          <div class="overview-item">
            <div class="overview-title">Business Management Dashboard</div>
            <p>Manage your entire operation from one central dashboard. View daily appointments, track revenue, manage client information, and access business insights that help you make informed decisions.</p>
          </div>
          
          <div class="overview-item">
            <div class="overview-title">Growth & Analytics Tools</div>
            <p>Understand your business performance with detailed analytics. Identify peak hours, track service popularity, monitor client retention, and discover opportunities to increase your revenue.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="workflow">
      <div class="container">
        <div class="section-header">
          <h2>How Your Business Operates with Infinity Booking</h2>
          <p>A streamlined process designed for efficiency and growth</p>
        </div>
        
        <div class="workflow-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Setup Your Business Profile</h3>
              <p>Register your business in minutes. Add your services, set pricing, define working hours, and configure your preferred payment methods. Your profile becomes your digital storefront.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Share Your Booking Link</h3>
              <p>Share your personalized booking link with clients through social media, messaging apps, or your website. Clients can view your availability and book appointments at their convenience.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Manage Appointments & Payments</h3>
              <p>Receive instant notifications for new bookings. Clients can pay via their preferred method. Your dashboard automatically updates with confirmed appointments and payment status.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Analyze & Optimize</h3>
              <p>Use our analytics tools to understand your business performance. Identify trends, optimize your schedule, adjust pricing, and implement strategies to grow your client base.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Example -->
    <section class="dashboard-preview">
      <div class="container">
        <div class="section-header">
          <h2>Your Business Command Center</h2>
          <p>Everything you need to manage your service business, organized in one intuitive interface</p>
        </div>
        
        <div class="dashboard-example">
          <div class="dashboard-tabs">
            <button :class="['tab', { active: activeTab === 'appointments' }]" @click="activeTab = 'appointments'">
              Appointments
            </button>
            <button :class="['tab', { active: activeTab === 'revenue' }]" @click="activeTab = 'revenue'">
              Revenue
            </button>
            <button :class="['tab', { active: activeTab === 'clients' }]" @click="activeTab = 'clients'">
              Clients
            </button>
          </div>
          
          <div class="dashboard-content">
            <!-- Appointments View -->
            <div v-if="activeTab === 'appointments'" class="view appointments-view">
              <div class="view-header">
                <h3>Today's Schedule</h3>
                <div class="view-stats">
                  <div class="stat">Total: 12 appointments</div>
                  <div class="stat">Confirmed: 10</div>
                  <div class="stat">Pending: 2</div>
                </div>
              </div>
              
              <div class="appointments-list">
                <div class="appointment">
                  <div class="appointment-time">09:00 AM</div>
                  <div class="appointment-details">
                    <div class="client-name">Meseret Girma</div>
                    <div class="service">Hair Styling - 60 minutes</div>
                    <div class="client-contact">+251 91 234 5678</div>
                  </div>
                  <div class="appointment-status confirmed">Confirmed</div>
                </div>
                
                <div class="appointment">
                  <div class="appointment-time">11:30 AM</div>
                  <div class="appointment-details">
                    <div class="client-name">Hana Mekonnen</div>
                    <div class="service">Manicure & Pedicure - 90 minutes</div>
                    <div class="client-contact">+251 92 345 6789</div>
                  </div>
                  <div class="appointment-status confirmed">Confirmed</div>
                </div>
                
                <div class="appointment">
                  <div class="appointment-time">02:00 PM</div>
                  <div class="appointment-details">
                    <div class="client-name">Samuel Kebede</div>
                    <div class="service">Beard Trim - 30 minutes</div>
                    <div class="client-contact">+251 93 456 7890</div>
                  </div>
                  <div class="appointment-status pending">Pending Payment</div>
                </div>
              </div>
              
              <div class="view-actions">
                <button class="btn-action">View Full Schedule</button>
                <button class="btn-action primary">Add New Appointment</button>
              </div>
            </div>
            
            <!-- Revenue View -->
            <div v-if="activeTab === 'revenue'" class="view revenue-view">
              <div class="view-header">
                <h3>Revenue Overview</h3>
                <div class="view-stats">
                  <div class="stat">Today: ETB 8,450</div>
                  <div class="stat">This Week: ETB 42,800</div>
                  <div class="stat">This Month: ETB 156,300</div>
                </div>
              </div>
              
              <div class="revenue-breakdown">
                <div class="breakdown-item">
                  <div class="breakdown-title">Telebirr Payments</div>
                  <div class="breakdown-amount">ETB 5,200</div>
                  <div class="breakdown-percentage">62%</div>
                </div>
                
                <div class="breakdown-item">
                  <div class="breakdown-title">CBE Birr Payments</div>
                  <div class="breakdown-amount">ETB 2,100</div>
                  <div class="breakdown-percentage">25%</div>
                </div>
                
                <div class="breakdown-item">
                  <div class="breakdown-title">Cash Payments</div>
                  <div class="breakdown-amount">ETB 1,150</div>
                  <div class="breakdown-percentage">13%</div>
                </div>
              </div>
              
              <div class="payment-notes">
                <p>All payments are automatically recorded and reconciled with appointments. You can generate detailed reports for any time period.</p>
              </div>
            </div>
            
            <!-- Clients View -->
            <div v-if="activeTab === 'clients'" class="view clients-view">
              <div class="view-header">
                <h3>Client Management</h3>
                <div class="view-stats">
                  <div class="stat">Total Clients: 245</div>
                  <div class="stat">Active This Month: 68</div>
                  <div class="stat">New This Week: 12</div>
                </div>
              </div>
              
              <div class="clients-list">
                <div class="client">
                  <div class="client-info">
                    <div class="client-name">Meseret Girma</div>
                    <div class="client-details">4 appointments • ETB 5,200 total • Last visit: Nov 15</div>
                    <div class="client-contact">meseretg@email.com • +251 91 234 5678</div>
                  </div>
                  <div class="client-actions">
                    <button class="btn-small">View History</button>
                    <button class="btn-small">Send Reminder</button>
                  </div>
                </div>
                
                <div class="client">
                  <div class="client-info">
                    <div class="client-name">Hana Mekonnen</div>
                    <div class="client-details">2 appointments • ETB 3,800 total • Last visit: Nov 12</div>
                    <div class="client-contact">hana.m@email.com • +251 92 345 6789</div>
                  </div>
                  <div class="client-actions">
                    <button class="btn-small">View History</button>
                    <button class="btn-small">Send Reminder</button>
                  </div>
                </div>
              </div>
              
              <div class="client-insights">
                <p>Client retention rate: 78% • Average appointment value: ETB 1,200 • Most popular service: Hair Styling</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-features">
          <div class="feature">
            <h4>Real-time Updates</h4>
            <p>Your dashboard updates instantly when clients book appointments or make payments.</p>
          </div>
          
          <div class="feature">
            <h4>Mobile Access</h4>
            <p>Access your dashboard from any device — desktop, tablet, or smartphone.</p>
          </div>
          
          <div class="feature">
            <h4>Secure & Private</h4>
            <p>Your business data is protected with enterprise-level security measures.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Business Benefits -->
    <section class="benefits">
      <div class="container">
        <div class="section-header">
          <h2>Why Ethiopian Service Providers Choose Infinity Booking</h2>
          <p>Practical benefits that make a real difference to your business operations</p>
        </div>
        
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Reduce Administrative Work</h3>
            <p>Automate scheduling, reminders, and payment tracking. Save hours each week that you can dedicate to serving clients and growing your business.</p>
          </div>
          
          <div class="benefit-card">
            <h3>Increase Revenue</h3>
            <p>Accept bookings 24/7, reduce no-shows with automated reminders, and upsell services through your professional booking interface.</p>
          </div>
          
          <div class="benefit-card">
            <h3>Build Professional Credibility</h3>
            <p>Present a modern, professional image to clients with your branded booking page and organized appointment management.</p>
          </div>
          
          <div class="benefit-card">
            <h3>Make Data-Driven Decisions</h3>
            <p>Access clear business insights about your most profitable services, busiest times, and client preferences.</p>
          </div>
          
          <div class="benefit-card">
            <h3>Simplify Payment Collection</h3>
            <p>Streamline payment tracking across multiple methods. Know exactly what's been paid and what's outstanding at any moment.</p>
          </div>
          
          <div class="benefit-card">
            <h3>Scale Your Operations</h3>
            <p>As your business grows, our platform scales with you. Add staff members, new services, and additional locations seamlessly.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="success">
      <div class="container">
        <div class="section-header">
          <h2>Real Business Transformations</h2>
          <p>Ethiopian service providers who have grown their businesses with Infinity Booking</p>
        </div>
        
        <div class="success-stories">
          <div class="story">
            <div class="story-content">
              <h3>Selam's Beauty Salon - Addis Ababa</h3>
              <p>"Before Infinity Booking, I was managing appointments through phone calls and a paper notebook. I regularly double-booked or missed appointments. Now, my clients book online, pay through Telebirr, and my schedule is always up to date. I've increased my client base by 60% while reducing administrative time by 15 hours per week."</p>
              <div class="story-metrics">
                <div class="metric">+60% more clients</div>
                <div class="metric">-15 hours admin/week</div>
                <div class="metric">98% payment success rate</div>
              </div>
            </div>
          </div>
          
          <div class="story">
            <div class="story-content">
              <h3>Daniel's Cleaning Service - Adama</h3>
              <p>"Managing a team of 8 cleaners with varying schedules was challenging. Infinity Booking allows clients to book specific services, and my team receives automatic notifications. Payment tracking was previously a major issue — now everything is recorded and reconciled automatically. We've expanded to 12 employees in 6 months."</p>
              <div class="story-metrics">
                <div class="metric">12 employees managed</div>
                <div class="metric">350+ monthly bookings</div>
                <div class="metric">100% payment tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing">
      <div class="container">
        <div class="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your business needs. No hidden fees, no long-term contracts.</p>
        </div>
        
        <div class="pricing-plans">
          <div class="plan">
            <div class="plan-header">
              <h3>Free Trial</h3>
              <div class="plan-price">ETB 0</div>
              <div class="plan-period">30 days</div>
            </div>
            
            <div class="plan-features">
              <p>Perfect for exploring the platform and setting up your business</p>
              <ul>
                <li>Up to 50 appointments per month</li>
                <li>Basic booking page</li>
                <li>Email and SMS reminders</li>
                <li>Manual payment tracking</li>
                <li>Standard support</li>
              </ul>
            </div>
            
            <button @click="goToRegister" class="btn-plan">
              Start Free Trial
            </button>
          </div>
          
          <div class="plan featured">
            <div class="plan-badge">Most Popular</div>
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="plan-price">ETB 299<span>/month</span></div>
              <div class="plan-period">After free trial</div>
            </div>
            
            <div class="plan-features">
              <p>Complete platform access for growing service businesses</p>
              <ul>
                <li>Unlimited appointments</li>
                <li>Telebirr & CBE Birr integration</li>
                <li>Advanced business analytics</li>
                <li>Staff management tools</li>
                <li>Priority Ethiopian support</li>
                <li>Custom booking page</li>
                <li>Automated reports</li>
              </ul>
            </div>
            
            <button @click="goToRegister" class="btn-plan primary">
              Get Started
            </button>
          </div>
        </div>
        
        <div class="pricing-note">
          <p>All plans include: Secure data storage • Mobile access • Ethiopian business support • No setup fees</p>
          <p>Need a custom plan for multiple locations or large teams? <a href="/contact">Contact our sales team</a></p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2>Start Growing Your Service Business Today</h2>
          <p>Join hundreds of Ethiopian service providers who are already using Infinity Booking to streamline their operations and increase their revenue.</p>
          
          <div class="cta-benefits">
            <div class="benefit">30-day free trial with full platform access</div>
            <div class="benefit">Personal onboarding assistance</div>
            <div class="benefit">Ethiopian support team available in Amharic and English</div>
            <div class="benefit">No commitment - cancel anytime</div>
          </div>
          
          <div class="cta-actions">
            <button @click="goToRegister" class="btn-cta">
              Create Your Free Account
            </button>
            <button @click="goToContact" class="btn-cta secondary">
              Schedule a Demo
            </button>
          </div>
          
          <div class="cta-contact">
            <p>Questions? Contact our Ethiopian support team: <strong>support@infinitybooking.et</strong> or <strong>+251 11 123 4567</strong></p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      activeTab: 'appointments'
    }
  },
  methods: {
    goToRegister() {
      this.$router.push('/register');
    },
    goToDemo() {
      window.open('/demo', '_blank');
    },
    goToContact() {
      this.$router.push('/contact');
    }
  }
}
</script>

<style scoped>
/* =============== Base Styles =============== */
.home {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1a202c;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #2d3748;
}

.section-header p {
  font-size: 1.125rem;
  color: #718096;
  max-width: 700px;
  margin: 0 auto;
}

/* =============== Buttons =============== */
.btn-primary {
  background: #2d3748;
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #4a5568;
}

.btn-secondary {
  background: transparent;
  color: #2d3748;
  border: 2px solid #2d3748;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f7fafc;
}

.btn-action {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-action.primary {
  background: #2d3748;
  color: white;
  border-color: #2d3748;
}

.btn-small {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-plan {
  width: 100%;
  padding: 14px;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
}

.btn-plan.primary {
  background: #2d3748;
  color: white;
  border-color: #2d3748;
}

.btn-cta {
  background: #2d3748;
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cta.secondary {
  background: transparent;
  color: #2d3748;
  border: 2px solid #2d3748;
}

/* =============== Hero Section =============== */
.hero {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 100px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #2d3748;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-cta {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.hero-note p {
  color: #718096;
  font-size: 0.875rem;
}

/* =============== Platform Overview =============== */
.overview {
  padding: 80px 0;
  background: white;
}

.overview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.overview-item {
  padding: 0;
}

.overview-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2d3748;
}

.overview-item p {
  color: #4a5568;
  line-height: 1.7;
}

/* =============== Workflow Section =============== */
.workflow {
  padding: 80px 0;
  background: #f7fafc;
}

.workflow-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #2d3748;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2d3748;
}

.step-content p {
  color: #4a5568;
  line-height: 1.7;
}

/* =============== Dashboard Preview =============== */
.dashboard-preview {
  padding: 80px 0;
  background: white;
}

.dashboard-example {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dashboard-tabs {
  display: flex;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s;
}

.tab.active {
  color: #2d3748;
  border-bottom-color: #2d3748;
  background: white;
}

.dashboard-content {
  padding: 30px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.view-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.view-stats {
  display: flex;
  gap: 20px;
}

.view-stats .stat {
  font-size: 0.875rem;
  color: #4a5568;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 4px;
}

/* Appointments View */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.appointment {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.appointment-time {
  min-width: 80px;
  font-weight: 600;
  color: #2d3748;
}

.appointment-details {
  flex: 1;
  margin: 0 20px;
}

.client-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2d3748;
}

.service {
  color: #4a5568;
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.client-contact {
  color: #718096;
  font-size: 0.75rem;
}

.appointment-status {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.appointment-status.confirmed {
  background: #c6f6d5;
  color: #22543d;
}

.appointment-status.pending {
  background: #fed7d7;
  color: #742a2a;
}

.view-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

/* Revenue View */
.revenue-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.breakdown-title {
  flex: 1;
  font-weight: 600;
  color: #2d3748;
}

.breakdown-amount {
  margin: 0 20px;
  font-weight: 600;
  color: #2d3748;
}

.breakdown-percentage {
  padding: 4px 12px;
  background: #2d3748;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.payment-notes {
  padding: 20px;
  background: #f7fafc;
  border-radius: 6px;
  color: #4a5568;
  font-size: 0.875rem;
}

/* Clients View */
.clients-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.client {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.client-info {
  flex: 1;
}

.client-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
}

.client-details {
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.client-contact {
  color: #718096;
  font-size: 0.75rem;
}

.client-actions {
  display: flex;
  gap: 8px;
}

.client-insights {
  padding: 20px;
  background: #f7fafc;
  border-radius: 6px;
  color: #4a5568;
  font-size: 0.875rem;
  text-align: center;
}

/* Dashboard Features */
.dashboard-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature {
  text-align: center;
}

.feature h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2d3748;
}

.feature p {
  color: #4a5568;
  line-height: 1.6;
}

/* =============== Benefits Section =============== */
.benefits {
  padding: 80px 0;
  background: #f7fafc;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.benefit-card {
  padding: 30px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: transform 0.3s, box-shadow 0.3s;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.benefit-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2d3748;
}

.benefit-card p {
  color: #4a5568;
  line-height: 1.7;
}

/* =============== Success Stories =============== */
.success {
  padding: 80px 0;
  background: white;
}

.success-stories {
  max-width: 800px;
  margin: 0 auto;
}

.story {
  margin-bottom: 40px;
  padding: 30px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #2d3748;
}

.story-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2d3748;
}

.story-content p {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 20px;
}

.story-metrics {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.story-metrics .metric {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #4a5568;
}

/* =============== Pricing Section =============== */
.pricing {
  padding: 80px 0;
  background: #f7fafc;
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto 40px;
}

.plan {
  padding: 30px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  position: relative;
}

.plan.featured {
  border-color: #2d3748;
  box-shadow: 0 10px 15px -3px rgba(45, 55, 72, 0.1);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.75rem;
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
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
}

.plan-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.plan-price span {
  font-size: 1rem;
  color: #718096;
}

.plan-period {
  color: #718096;
  font-size: 0.875rem;
}

.plan-features p {
  color: #4a5568;
  margin-bottom: 20px;
  font-weight: 500;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  padding: 8px 0;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.plan-features li:last-child {
  border-bottom: none;
}

.pricing-note {
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
  max-width: 600px;
  margin: 0 auto;
}

.pricing-note a {
  color: #2d3748;
  text-decoration: underline;
}

/* =============== Final CTA =============== */
.final-cta {
  padding: 80px 0;
  background: #2d3748;
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-content > p {
  font-size: 1.125rem;
  color: #cbd5e0;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-benefits .benefit {
  padding: 12px 0;
  border-bottom: 1px solid #4a5568;
  color: #e2e8f0;
}

.cta-benefits .benefit:last-child {
  border-bottom: none;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.cta-contact {
  color: #cbd5e0;
  font-size: 0.875rem;
}

.cta-contact strong {
  color: white;
}

/* =============== Responsive Design =============== */
@media (max-width: 768px) {
  .hero {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .step {
    flex-direction: column;
    gap: 16px;
  }
  
  .dashboard-tabs {
    flex-direction: column;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .view-stats {
    flex-wrap: wrap;
  }
  
  .appointment {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .appointment-details {
    margin: 0;
  }
  
  .client {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .client-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .pricing-plans {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .btn-cta {
    width: 100%;
  }
  
  .story-metrics {
    flex-direction: column;
  }
}
</style>