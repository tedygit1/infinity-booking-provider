<template>
  <div class="reviews-container">
    <h2>Customer Reviews</h2>
    
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Fetching reviews...</p>
      <p v-if="debugMode && services.length > 0" class="debug-loading">
        Checking {{ services.length }} services for reviews...
      </p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchReviews" class="retry-btn">
        <i class="fa-solid fa-refresh"></i> Try Again
      </button>
    </div>
    
    <!-- No Reviews -->
    <div v-else-if="reviews.length === 0" class="no-reviews">
      <div class="empty-state">
        <div class="empty-icon">⭐</div>
        <h3>No Reviews Yet</h3>
        <p>You haven't received any reviews for your services yet.</p>
        <p class="hint">Reviews will appear here once customers complete their bookings and leave feedback.</p>
        
        <div class="services-list" v-if="services.length > 0">
          <h4>Your Services ({{ services.length }})</h4>
          <div class="service-items">
            <div v-for="service in services" :key="service.serviceId" class="service-item">
              <i class="fa-solid fa-scissors"></i>
              <div class="service-details">
                <span class="service-title">{{ service.title }}</span>
                <span class="service-id">{{ service.serviceId }}</span>
              </div>
            </div>
          </div>
          <p class="check-hint">Checking these services for reviews...</p>
        </div>
        
        <div v-else class="no-services">
          <i class="fa-solid fa-box-open"></i>
          <p>No services found. Create services first to receive reviews.</p>
        </div>
      </div>
    </div>
    
    <!-- Reviews List -->
    <div v-else class="reviews-list">
      <!-- Reviews Summary -->
      <div class="reviews-summary">
        <div class="summary-header">
          <h3>Customer Reviews</h3>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-number">{{ reviews.length }}</span>
              <span class="stat-label">Total Reviews</span>
            </div>
            <div class="stat-item" v-if="averageRating > 0">
              <span class="stat-number">{{ averageRating.toFixed(1) }}</span>
              <span class="stat-label">Average Rating</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ servicesWithReviews }}</span>
              <span class="stat-label">Services Reviewed</span>
            </div>
          </div>
        </div>
        
        <!-- Rating Distribution -->
        <div v-if="reviews.length > 1" class="rating-distribution">
          <div class="distribution-item" v-for="rating in [5,4,3,2,1]" :key="rating">
            <span class="rating-label">{{ rating }}★</span>
            <div class="distribution-bar">
              <div class="bar-fill" :style="{ 
                width: `${((ratingDistribution[rating] || 0) / reviews.length) * 100}%` 
              }"></div>
            </div>
            <span class="rating-count">{{ ratingDistribution[rating] || 0 }}</span>
          </div>
        </div>
      </div>
      
      <!-- Reviews -->
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="service-badge">
            <i class="fa-solid fa-scissors"></i>
            <span>{{ review.serviceName }}</span>
          </div>
          <div class="rating-badge">
            <span class="rating-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
            </span>
            <span class="rating-value">{{ review.rating }}.0</span>
          </div>
        </div>
        
        <div class="reviewer-info">
          <div class="avatar">
            <img :src="review.avatar || defaultAvatar" alt="User" @error="handleImageError" />
          </div>
          <div class="reviewer-details">
            <p class="name">{{ review.userName || 'Anonymous Customer' }}</p>
            <p v-if="review.date" class="date">
              <i class="fa-solid fa-calendar"></i> {{ formatDate(review.date) }}
            </p>
          </div>
        </div>
        
        <div class="review-content">
          <p>"{{ review.text }}"</p>
        </div>
        
        <div v-if="review.reply" class="review-reply">
          <div class="reply-label">
            <i class="fa-solid fa-reply"></i>
            <span>Your Reply</span>
            <span class="reply-date" v-if="review.replyDate">{{ formatDate(review.replyDate) }}</span>
          </div>
          <p>{{ review.reply }}</p>
        </div>
        
        <div class="review-actions" v-else>
          <button class="btn reply-btn" @click="replyToReview(review)">
            <i class="fa-solid fa-reply"></i> Reply to Review
          </button>
        </div>
        
        <div v-if="debugMode" class="review-debug">
          <small>Review ID: {{ review.id }} | Service ID: {{ review.serviceId }} | Source: {{ review.source }}</small>
        </div>
      </div>
    </div>
    
    <!-- Debug Toggle -->
    <div class="debug-toggle" @click="debugMode = !debugMode">
      <i class="fa-solid fa-bug"></i>
      {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import http from "@/api/index.js";

// State
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const services = ref([]);
const providerId = ref(null);
const debugMode = ref(false);
const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

// Computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((total, review) => total + (review.rating || 0), 0);
  return Math.round((sum / reviews.value.length) * 10) / 10;
});

const ratingDistribution = computed(() => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.value.forEach(review => {
    const rating = Math.round(review.rating) || 0;
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  return distribution;
});

const servicesWithReviews = computed(() => {
  const serviceIds = new Set();
  reviews.value.forEach(review => {
    if (review.serviceId) {
      serviceIds.add(review.serviceId);
    }
  });
  return serviceIds.size;
});

// Get current provider ID from localStorage
const getProviderId = () => {
  try {
    const providerJson = localStorage.getItem("loggedProvider");
    if (!providerJson) {
      console.error("❌ No provider found in localStorage");
      return null;
    }
    
    const provider = JSON.parse(providerJson);
    const id = provider?._id || provider?.id;
    
    if (!id) {
      console.error("❌ No provider ID found in provider object:", provider);
      return null;
    }
    
    console.log("✅ Provider ID found:", id);
    return id;
  } catch (err) {
    console.error("❌ Error getting provider ID:", err);
    return null;
  }
};

// Fetch all services for this provider
const fetchServices = async () => {
  try {
    console.log("📡 Fetching services...");
    const response = await http.get('/services');
    
    const data = response.data;
    services.value = Array.isArray(data) ? data : [];
    console.log(`✅ Loaded ${services.value.length} services`);
    
    if (services.value.length === 0) {
      console.log("📭 No services found for this provider");
    } else {
      console.log("📋 Services list:");
      services.value.forEach((service, index) => {
        const serviceId = service.serviceId || service._id || service.id;
        console.log(`  ${index + 1}. "${service.title || 'No title'}" - ID: ${serviceId}`);
      });
    }
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    if (err.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    }
    throw new Error(`Failed to load services: ${err.message}`);
  }
};

// Fetch reviews for a single service
const fetchServiceReviews = async (service) => {
  const serviceId = service.serviceId || service._id || service.id;
  if (!serviceId) {
    console.warn(`⚠️ Service has no ID:`, service);
    return [];
  }
  
  try {
    console.log(`🔍 Checking reviews for service: "${service.title}" (${serviceId})`);
    
    const response = await http.get(`/reviews/service/${serviceId}`);
    const data = response.data;
    
    let serviceReviews = [];
    
    // Handle different response formats
    if (Array.isArray(data)) {
      serviceReviews = data;
    } else if (data && Array.isArray(data.reviews)) {
      serviceReviews = data.reviews;
    } else if (data && Array.isArray(data.data)) {
      serviceReviews = data.data;
    } else if (data && data.reviews && typeof data.reviews === 'object') {
      // If reviews is an object, convert to array
      serviceReviews = Object.values(data.reviews);
    }
    
    console.log(`📝 Found ${serviceReviews.length} reviews for "${service.title}"`);
    
    // Transform reviews to consistent format
    return serviceReviews.map((review, index) => ({
      id: review.id || review._id || `review-${serviceId}-${index}`,
      serviceId: serviceId,
      serviceName: service.title || service.serviceName || 'Service',
      userName: review.customerName || 
               review.user?.name || 
               review.reviewerName || 
               review.customer?.name ||
               'Anonymous Customer',
      rating: review.rating || review.stars || 0,
      text: review.review || 
            review.message || 
            review.comment || 
            review.content || 
            review.feedback ||
            'No review text',
      date: review.date || 
            review.createdAt || 
            review.updatedAt || 
            review.timestamp ||
            new Date().toISOString(),
      avatar: review.avatar || 
              review.user?.avatar ||
              review.customer?.avatar,
      reply: review.reply || review.response || '',
      replyDate: review.replyDate || review.updatedAt,
      source: 'service'
    }));
    
  } catch (err) {
    // Don't throw error, just log and return empty array
    console.log(`ℹ️ No reviews found for service ${serviceId}:`, err.message);
    return [];
  }
};

// Fetch all reviews from all services
const fetchAllServiceReviews = async () => {
  const allReviews = [];
  
  for (const service of services.value) {
    const serviceReviews = await fetchServiceReviews(service);
    allReviews.push(...serviceReviews);
    
    // Small delay to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return allReviews;
};

// Main function to fetch reviews
const fetchReviews = async () => {
  try {
    loading.value = true;
    error.value = null;
    reviews.value = [];
    services.value = [];
    
    console.log("=".repeat(50));
    console.log("🔍 STARTING REVIEW FETCH PROCESS");
    console.log("=".repeat(50));
    
    // 1. Get provider ID
    providerId.value = getProviderId();
    if (!providerId.value) {
      throw new Error("Please log in to view reviews.");
    }
    
    console.log("👤 Provider ID:", providerId.value);
    
    // 2. Fetch all services
    await fetchServices();
    
    if (services.value.length === 0) {
      console.log("📭 No services to check for reviews");
      return;
    }
    
    console.log(`🔄 Checking ${services.value.length} services for reviews...`);
    
    // 3. Fetch reviews for each service
    const allReviews = await fetchAllServiceReviews();
    
    // 4. Remove duplicates (by ID)
    const uniqueReviews = [];
    const seenIds = new Set();
    
    allReviews.forEach(review => {
      if (review.id && !seenIds.has(review.id)) {
        seenIds.add(review.id);
        uniqueReviews.push(review);
      }
    });
    
    // 5. Sort by date (newest first)
    uniqueReviews.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
    
    reviews.value = uniqueReviews;
    
    console.log("=".repeat(50));
    console.log("📊 FETCH RESULTS");
    console.log("=".repeat(50));
    console.log(`✅ Services checked: ${services.value.length}`);
    console.log(`✅ Reviews found: ${reviews.value.length}`);
    console.log(`✅ Services with reviews: ${servicesWithReviews.value}`);
    
    if (reviews.value.length > 0) {
      console.log("\n📋 Reviews found:");
      reviews.value.forEach((review, index) => {
        console.log(`\n${index + 1}. ${review.serviceName}`);
        console.log(`   Rating: ${review.rating}★`);
        console.log(`   Customer: ${review.userName}`);
        console.log(`   Review: "${review.text.substring(0, 50)}${review.text.length > 50 ? '...' : ''}"`);
        console.log(`   Date: ${formatDate(review.date)}`);
        console.log(`   Service ID: ${review.serviceId}`);
      });
    } else {
      console.log("\n📭 No reviews found for any services");
    }
    
    console.log("=".repeat(50));
    
  } catch (err) {
    console.error("❌ ERROR FETCHING REVIEWS:", err);
    
    if (err.response?.status === 401) {
      error.value = "Authentication failed. Please log in again.";
    } else if (err.message.includes("Failed to load services")) {
      error.value = "Could not load your services. Please try again.";
    } else {
      error.value = err.message || "Failed to load reviews. Please try again.";
    }
    
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const handleImageError = (event) => {
  const randomSeed = Math.random().toString(36).substring(7);
  event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
};

// Reply function
const replyToReview = (review) => {
  const reply = prompt(`Reply to ${review.userName}'s review:\n\n"${review.text}"\n\nEnter your reply:`);
  if (reply && reply.trim()) {
    // TODO: Implement actual API call to save reply
    console.log("📤 Would send reply:", { reviewId: review.id, reply });
    alert("Reply functionality would save to database here.\n\nYour reply: " + reply);
  }
};

// Fetch on mount
onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.reviews-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

h2 {
  color: #0077ff;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.75rem;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0077ff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #666;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.debug-loading {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

/* Error */
.error {
  text-align: center;
  padding: 2.5rem;
  background: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 12px;
  color: #d32f2f;
}

.error i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.error p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.retry-btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

/* No Reviews */
.no-reviews {
  text-align: center;
  padding: 2rem;
}

.empty-state {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 0.75rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hint {
  font-size: 0.95rem;
  font-style: italic;
  color: #868e96;
  margin-top: 1rem;
}

.services-list {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: left;
}

.services-list h4 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.service-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f1f3f4;
  transition: background 0.2s;
}

.service-item:hover {
  background: #f8f9fa;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item i {
  color: #0077ff;
  margin-right: 1rem;
  font-size: 1.1rem;
}

.service-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.service-id {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}

.check-hint {
  font-size: 0.9rem;
  color: #868e96;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
}

.no-services {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.no-services i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
  display: block;
}

.no-services p {
  color: #6c757d;
  margin: 0;
}

/* Reviews Summary */
.reviews-summary {
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.summary-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.summary-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0077ff;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rating-distribution {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.distribution-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.rating-label {
  width: 45px;
  font-weight: 700;
  color: #666;
  font-size: 1rem;
}

.distribution-bar {
  flex: 1;
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb400, #ff9500);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.rating-count {
  width: 45px;
  text-align: right;
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.review-card {
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: #0077ff;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.service-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #e8f4ff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #0077ff;
  font-weight: 600;
}

.service-badge i {
  font-size: 0.9rem;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  display: flex;
  gap: 0.15rem;
}

.star {
  color: #ddd;
  font-size: 1.1rem;
}

.star.filled {
  color: #ffb400;
}

.rating-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  background: #fff8e1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.avatar {
  flex-shrink: 0;
}

.avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0077ff;
  background: #f0f0f0;
}

.reviewer-details {
  flex: 1;
}

.name {
  font-weight: 700;
  color: #0077ff;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.date {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date i {
  font-size: 0.8rem;
}

.review-content {
  background: #f9f9f9;
  padding: 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  border-left: 4px solid #0077ff;
}

.review-content p {
  color: #333;
  line-height: 1.6;
  margin: 0;
  font-size: 1.05rem;
  font-style: italic;
}

.review-reply {
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  padding: 1.25rem;
  margin-top: 1rem;
}

.reply-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #2e7d32;
  font-weight: 600;
  font-size: 0.95rem;
}

.reply-date {
  margin-left: auto;
  font-size: 0.85rem;
  color: #666;
  font-weight: normal;
}

.review-reply p {
  color: #1b5e20;
  margin: 0;
  line-height: 1.5;
  font-size: 1rem;
}

.review-actions {
  margin-top: 1.25rem;
  text-align: right;
}

.reply-btn {
  background: #0077ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.reply-btn:hover {
  background: #0056cc;
  transform: translateY(-1px);
}

.review-debug {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #dee2e6;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #666;
}

/* Debug Toggle */
.debug-toggle {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #6c757d;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.debug-toggle:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .reviews-container {
    padding: 1rem;
  }
  
  h2 {
    font-size: 1.6rem;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .summary-stats {
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .stat-item {
    flex: 1;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .service-badge {
    width: 100%;
    justify-content: center;
  }
  
  .rating-badge {
    align-self: flex-end;
  }
  
  .reviewer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .avatar {
    align-self: center;
  }
  
  .reviewer-details {
    text-align: center;
    width: 100%;
  }
  
  .debug-toggle {
    bottom: 15px;
    right: 15px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .review-card {
    padding: 1.25rem;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .distribution-item {
    gap: 0.75rem;
  }
  
  .rating-label,
  .rating-count {
    width: 35px;
    font-size: 0.9rem;
  }
}
</style>