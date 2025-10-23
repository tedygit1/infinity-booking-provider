<template>
  <div class="providers-page font-poppins">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Become a Provider on Infinity-Booking</h1>
        <p>
          Connect with clients, manage bookings, and receive payments securely — all through a professional platform that grows endlessly.
        </p>
        <p>
          Join a community of trusted service providers and expand your business with complete control.
        </p>
        
      </div>
    </section>

    <!-- Providers Section -->
    <section class="providers-section">
      <h2 class="section-title">Our Providers</h2>
      <div class="filters">
        <input v-model="searchQuery" type="text" placeholder="Search providers..." />
        <select v-model="selectedCategory">
          <option value="">All Categories</option>
          <option value="Beauty & Salon">Beauty & Salon</option>
          <option value="Home Service">Home Service</option>
          <option value="Education & Tutoring">Education & Tutoring</option>
        </select>
      </div>
      <div class="providers-grid">
        <div v-for="provider in filteredProviders" :key="provider.id" class="provider-card">
          <div class="provider-image">
            <img :src="provider.image" :alt="provider.name" />
          </div>
          <h3>{{ provider.name }}</h3>
          <p class="type">{{ provider.type }}</p>
          <p class="description">{{ provider.description }}</p>
          <div class="badges">
            <span v-if="provider.topRated" class="badge top-rated">Top Rated</span>
            <span v-if="provider.new" class="badge new">New</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Platform Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-user-check fa-2x"></i>
          <h3>Verified Providers</h3>
          <p>Ensure trust and quality with admin-approved provider profiles.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-chart-line fa-2x"></i>
          <h3>Analytics & Insights</h3>
          <p>Track your bookings, performance, and growth trends on your dashboard.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-hand-holding-usd fa-2x"></i>
          <h3>Secure Payments</h3>
          <p>Receive payments reliably via Telebirr, PayPal, and future card integrations.</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-comments fa-2x"></i>
          <h3>Customer Feedback</h3>
          <p>Build your reputation with ratings and reviews for better visibility.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Join Infinity-Booking?</h2>
      <p>Create your provider account today and start growing your business in a professional network that expands endlessly.</p>
      <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('')

const providers = ref([
  { id: 1, name: "Beauty Bliss Salon", type: "Beauty & Salon", image: "https://source.unsplash.com/600x400/?salon", description: "Professional hair styling and spa services.", topRated: true, new: false },
  { id: 2, name: "Glam Studio", type: "Beauty & Salon", image: "https://source.unsplash.com/600x400/?makeup", description: "Makeup, styling, and self-care experts.", topRated: false, new: true },
  { id: 3, name: "Royal Touch Spa", type: "Beauty & Salon", image: "https://source.unsplash.com/600x400/?spa", description: "Relax and rejuvenate with our spa treatments.", topRated: false, new: false },
  { id: 4, name: "Spark Cleaners", type: "Home Service", image: "https://source.unsplash.com/600x400/?cleaning", description: "Professional home cleaning service.", topRated: true, new: false },
  { id: 5, name: "FixIt Plumbing", type: "Home Service", image: "https://source.unsplash.com/600x400/?plumbing", description: "Expert plumbing and home repair services.", topRated: false, new: true },
  { id: 6, name: "ElectricAid", type: "Home Service", image: "https://source.unsplash.com/600x400/?electrician", description: "Certified electricians for your home.", topRated: false, new: false },
  { id: 7, name: "Bright Minds Academy", type: "Education & Tutoring", image: "https://source.unsplash.com/600x400/?teacher", description: "Personalized tutoring sessions.", topRated: true, new: false },
  { id: 8, name: "Elite Language Tutors", type: "Education & Tutoring", image: "https://source.unsplash.com/600x400/?language", description: "Language classes and mentoring.", topRated: false, new: true },
  { id: 9, name: "STEM Mentors", type: "Education & Tutoring", image: "https://source.unsplash.com/600x400/?math", description: "STEM-focused tutoring for students.", topRated: false, new: false },
])

const filteredProviders = computed(() => {
  return providers.value.filter(p => {
    const matchesCategory = selectedCategory.value ? p.type === selectedCategory.value : true
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})
</script>

<style scoped>
/* Hero Section with slightly different gradient */
.hero-section {
  background: linear-gradient(to right, #3b82f6, #1e40af); /* darker blue gradient */
  text-align: center;
  padding: 120px 20px 80px;
  position: relative;
}
.hero-overlay {
  position: absolute;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.25);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-content h1 { 
  font-size: 3rem; 
  margin-bottom: 1rem; 
  font-weight: 700; 
  color: #e0f7ff; 
}
.hero-content p { 
  font-size: 1.15rem; 
  margin-bottom: 1rem; 
  line-height: 1.7; 
  color: #f0f9ff; 
}
.cta-btn {
  background: #ffd54f;
  color: black;
  padding: 1rem 2rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  margin-top: 20px;
  transition: transform 0.3s, background 0.3s;
}
.cta-btn:hover { transform: scale(1.05); background: #ffe082; }

/* Providers Section */
.providers-section { padding: 80px 20px; text-align: center; }
.section-title { font-size: 2.2rem; margin-bottom: 2rem; color: #3b82f6; font-weight: 700; }
.filters { margin-bottom: 40px; display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }
.filters input, .filters select { padding: 10px 15px; border-radius: 10px; border: 1px solid #ccc; width: 200px; transition: all 0.3s; }
.filters input:focus, .filters select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.3); }
.providers-grid { display: flex; flex-wrap: wrap; gap: 25px; justify-content: center; }
.provider-card {
  background: white;
  border-radius: 20px;
  width: 260px;
  padding: 20px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.provider-card:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(0,0,0,0.15); }
.provider-card .provider-image { height: 180px; overflow: hidden; border-radius: 15px; margin-bottom: 15px; }
.provider-card img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s; } /* visible images */
.provider-card img:hover { transform: scale(1.05); }
.provider-card h3 { font-size: 1.2rem; color: #3b82f6; margin-bottom: 5px; }
.provider-card .type { font-weight: 500; color: #1e40af; margin-bottom: 8px; }
.provider-card .description { font-size: 0.95rem; color: #555; margin-bottom: 10px; }
.provider-card .badges { display: flex; justify-content: center; gap: 5px; }
.badge { padding: 3px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; }
.top-rated { background: #dcfce7; color: #166534; }
.new { background: #fef3c7; color: #78350f; }

/* Features Section */
.features-section { padding: 80px 20px; background: #f9fafb; text-align: center; }
.features-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 25px; }
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 25px 20px;
  width: 220px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.feature-card i { color: #3b82f6; margin-bottom: 12px; }
.feature-card h3 { font-size: 1.1rem; margin-bottom: 8px; color: #3b82f6; }
.feature-card p { font-size: 0.9rem; color: #555; }

/* CTA Section */
.cta-section {
  background: linear-gradient(to right, #3b82f6, #1e40af);
  color: white;
  text-align: center;
  padding: 90px 20px;
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .providers-grid, .features-grid { flex-direction: column; align-items: center; }
  .filters input, .filters select { width: 100%; max-width: 300px; }
}
</style>
