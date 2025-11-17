<!-- src/pages/ProvidersPage.vue -->
<template>
  <div class="providers-page font-poppins">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Meet Our Trusted Providers</h1>
        <p class="hero-text">
          From salon experts to home repair pros and tutors — discover skilled professionals who deliver quality service every time.
        </p>
        <p class="hero-text">
          All providers are verified by our team to ensure safety, reliability, and excellence.
        </p>
        <router-link to="/login" class="hero-cta">✨ Become a Provider</router-link>
      </div>
    </section>

    <!-- Providers Section -->
    <section class="providers-section">
      <div class="container">
        <h2 class="section-title">Our Verified Providers</h2>

        <div class="filters">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or service..."
            aria-label="Search providers"
          />
          <select v-model="selectedCategory" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option value="Beauty & Salon">Beauty & Salon</option>
            <option value="Home Service">Home Service</option>
            <option value="Education & Tutoring">Education & Tutoring</option>
          </select>
        </div>

        <div class="providers-grid" v-if="filteredProviders.length">
          <div
            v-for="provider in filteredProviders"
            :key="provider.id"
            class="provider-card"
          >
            <div class="provider-image">
              <img
                :src="provider.image"
                :alt="`${provider.name} - ${provider.category}`"
                loading="lazy"
                @error="handleImageError"
              />
            </div>
            <h3>{{ provider.name }}</h3>
            <p class="provider-category">{{ provider.category }}</p>
            <p class="provider-description">{{ provider.description }}</p>
            <div class="badges">
              <span v-if="provider.isTopRated" class="badge top-rated">⭐ Top Rated</span>
              <span v-if="provider.isNew" class="badge new">🆕 New</span>
              <span class="badge verified">✅ Verified</span>
            </div>
          </div>
        </div>

        <div v-else class="no-results">
          <i class="fas fa-search fa-3x"></i>
          <p>No providers match your search.</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Why Trust Our Providers?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-user-check fa-2x"></i>
            <h3>Verified Identity</h3>
            <p>Every provider is manually reviewed and verified by our team.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-star fa-2x"></i>
            <h3>Customer Reviews</h3>
            <p>Read honest feedback from real customers before booking.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-shield-alt fa-2x"></i>
            <h3>Secure Payments</h3>
            <p>Pay safely via Telebirr — funds released only after service completion.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-headset fa-2x"></i>
            <h3>24/7 Support</h3>
            <p>Our team is here to help with bookings, disputes, and questions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-title">Ready to Join Them?</h2>
        <p class="cta-text">
          Become a verified provider on Infinity-Booking and start growing your business today.
        </p>
        <router-link to="/login" class="cta-btn">🚀 Sign Up / Login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const selectedCategory = ref("");

// Realistic mock data (replace with API later)
const providers = ref([
  {
    id: 1,
    name: "Selamawit Bekele",
    category: "Beauty & Salon",
    description: "Professional hairstylist with 8+ years of experience. Specializes in bridal and modern cuts.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    isTopRated: true,
    isNew: false,
  },
  {
    id: 2,
    name: "Amanuel Tadesse",
    category: "Home Service",
    description: "Certified electrician and handyman. Fast, reliable, and affordable home repairs.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    isTopRated: false,
    isNew: true,
  },
  {
    id: 3,
    name: "Hiwot Mengistu",
    category: "Education & Tutoring",
    description: "Math & science tutor for grades 7–12. Former high school teacher with proven results.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    isTopRated: true,
    isNew: false,
  },
  {
    id: 4,
    name: "Yonas Lemma",
    category: "Beauty & Salon",
    description: "Barber & grooming expert. Clean cuts, fade designs, and beard styling.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    isTopRated: false,
    isNew: true,
  },
  {
    id: 5,
    name: "Tsion Berhane",
    category: "Home Service",
    description: "Professional cleaning service for homes and offices. Eco-friendly products used.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    isTopRated: true,
    isNew: false,
  },
  {
    id: 6,
    name: "Dawit Girma",
    category: "Education & Tutoring",
    description: "English & Amharic language tutor. Helps students prepare for exams and improve fluency.",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    isTopRated: false,
    isNew: false,
  },
]);

const filteredProviders = computed(() => {
  return providers.value.filter((p) => {
    const matchesCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

function handleImageError(e) {
  e.target.src = "https://randomuser.me/api/portraits/lego/3.jpg";
}
</script>

<style scoped>
/* Base */
.providers-page {
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
  color: white;
  text-align: center;
  padding: 90px 20px 70px;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
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
  margin-bottom: 1rem;
  opacity: 0.95;
}

.hero-cta {
  display: inline-block;
  background: #ffd54f;
  color: #1e293b;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 16px;
  text-decoration: none;
  font-size: 1.15rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
}

/* Providers Section */
.providers-section {
  background: #f8fafc;
  padding: 70px 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e3a8a;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.filters {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  font-size: 1rem;
  min-width: 200px;
  transition: all 0.2s;
}

.filters input:focus,
.filters select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.provider-card {
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
}

.provider-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.provider-image {
  height: 180px;
  overflow: hidden;
}

.provider-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.provider-card:hover .provider-image img {
  transform: scale(1.05);
}

.provider-card h3 {
  font-size: 1.3rem;
  color: #1e3a8a;
  margin: 16px 0 8px;
  font-weight: 700;
}

.provider-category {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.provider-description {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  padding: 0 16px 16px;
}

.badges {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0 16px 16px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.top-rated {
  background: #ecfdf5;
  color: #047857;
}

.new {
  background: #fffbeb;
  color: #92400e;
}

.verified {
  background: #dbeafe;
  color: #1d4ed8;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.no-results i {
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Features Section */
.features-section {
  background: white;
  padding: 70px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 28px;
  margin-top: 2rem;
}

.feature-card {
  background: #f8fafc;
  border-radius: 22px;
  padding: 30px 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.feature-card i {
  color: #3b82f6;
  margin-bottom: 16px;
  font-size: 2rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  color: #1e3a8a;
  margin: 16px 0 12px;
  font-weight: 700;
}

.feature-card p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.95;
  line-height: 1.7;
}

.cta-btn {
  display: inline-block;
  background: #ffd54f;
  color: #1e293b;
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

  .filters {
    flex-direction: column;
    align-items: center;
  }

  .filters input,
  .filters select {
    width: 100%;
    max-width: 320px;
  }

  .hero-cta,
  .cta-btn {
    width: 100%;
    max-width: 300px;
    padding: 16px;
  }
}

/* Accessibility */
.hero-cta:focus,
.cta-btn:focus {
  outline: 2px solid #ffd54f;
  outline-offset: 4px;
  border-radius: 16px;
}
</style>