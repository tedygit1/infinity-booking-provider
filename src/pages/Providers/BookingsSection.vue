<template>
  <div class="bookings-section">
    <div class="header">
      <h2 class="title">📅 Bookings</h2>
      <p class="subtitle">Manage your client bookings efficiently</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-box">
      <div class="spinner"></div>
      <p class="loading-text">Loading your bookings...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-box">
      <div class="error-icon">
        <i class="fa-solid fa-exclamation-triangle"></i>
      </div>
      <h3>Unable to load bookings</h3>
      <p>{{ error }}</p>
      <button class="btn retry-btn" @click="loadBookings">
        <i class="fa-solid fa-rotate"></i> Try Again
      </button>
    </div>

    <!-- No Bookings State -->
    <div v-else class="no-bookings">
      <div class="empty-icon">
        <i class="fa-regular fa-calendar-check"></i>
      </div>
      <h3>No bookings yet</h3>
      <p>When clients book your services, they'll appear here for you to manage.</p>
      <div class="empty-tips">
        <p><i class="fa-solid fa-lightbulb"></i> <strong>Tip:</strong> Promote your services to get more bookings!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import http from "@/api/index.js";

export default {
  name: 'BookingsSection',
  
  setup() {
    const loading = ref(true);
    const error = ref("");
    const bookings = ref([]);

    // Get provider ID from localStorage - FIXED VERSION
    const getProviderId = () => {
      try {
        // Try multiple possible storage locations
        const providerId = localStorage.getItem("provider_id");
        const loggedProvider = localStorage.getItem("loggedProvider");
        
        console.log("🔍 BookingsSection - Storage check:", {
          provider_id: providerId,
          loggedProvider: loggedProvider
        });

        if (providerId) {
          console.log("✅ Using provider_id:", providerId);
          return providerId;
        }

        if (loggedProvider) {
          const providerData = JSON.parse(loggedProvider);
          if (providerData._id) {
            console.log("✅ Using loggedProvider _id:", providerData._id);
            // Also store it for future use
            localStorage.setItem("provider_id", providerData._id);
            return providerData._id;
          }
        }

        // Check if we have a token but no provider ID
        const token = localStorage.getItem("provider_token");
        if (token) {
          console.log("⚠️ Have token but no provider ID - might need to refresh login");
          error.value = "Please refresh the page or login again.";
        } else {
          console.log("❌ No provider authentication found");
          error.value = "Please login to access your bookings.";
        }

        return null;
      } catch (err) {
        console.error("❌ Error getting provider ID:", err);
        error.value = "Authentication error. Please login again.";
        return null;
      }
    };

    const loadBookings = async () => {
      const providerId = getProviderId();
      
      if (!providerId) {
        loading.value = false;
        return;
      }

      loading.value = true;
      error.value = "";

      try {
        console.log("📡 BookingsSection - Loading bookings for provider:", providerId);
        
        // Try to get bookings for this provider
        const response = await http.get(`/bookings/provider/${providerId}`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          bookings.value = response.data;
          console.log("✅ Bookings loaded:", bookings.value.length);
        } else {
          // No bookings - this is normal
          bookings.value = [];
          console.log("ℹ️ No bookings found");
        }

      } catch (err) {
        console.error("❌ BookingsSection - Error loading bookings:", err);
        
        // Handle specific error cases
        if (err.response?.status === 403) {
          error.value = "Access denied. Please make sure you're logged in as the correct provider.";
          
          // Clear potentially corrupted auth data
          localStorage.removeItem("provider_id");
          console.log("🔒 Cleared provider_id due to 403 error");
          
        } else if (err.response?.status === 404) {
          // No bookings endpoint or no bookings - this is fine
          bookings.value = [];
          error.value = "";
          
        } else if (err.response?.status === 401) {
          error.value = "Session expired. Please login again.";
          // Redirect to login
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          
        } else {
          error.value = err.response?.data?.message || 
                       "Unable to load bookings. Please try again later.";
        }
        
      } finally {
        loading.value = false;
      }
    };

    // Debug function to check authentication status
    const checkAuthStatus = () => {
      console.log("🔐 BookingsSection - Current Auth Status:", {
        provider_token: localStorage.getItem("provider_token"),
        provider_id: localStorage.getItem("provider_id"),
        loggedProvider: localStorage.getItem("loggedProvider"),
        hasToken: !!localStorage.getItem("provider_token"),
        hasProviderId: !!localStorage.getItem("provider_id")
      });
    };

    onMounted(() => {
      console.log("🚀 BookingsSection component mounted");
      checkAuthStatus();
      loadBookings();
    });

    return {
      loading,
      error,
      bookings,
      loadBookings
    };
  }
};
</script>

<style scoped>
.bookings-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 2.1rem;
  color: #1e40af;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.5;
}

/* Loading */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: #f8fafc;
  border-radius: 20px;
  animation: fadeIn 0.5s ease;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #dbeafe;
  border-top-color: #1e40af;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #475569;
  font-size: 1.1rem;
}

/* Empty State */
.no-bookings {
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(30, 64, 175, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #1e40af;
  font-size: 2.2rem;
}

.no-bookings h3 {
  font-size: 1.7rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.no-bookings p {
  color: #64748b;
  font-size: 1.02rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.empty-tips {
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  max-width: 400px;
  margin: 20px auto 0;
}

.empty-tips p {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-tips i {
  color: #f59e0b;
}

/* Error State */
.error-box {
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #dc2626;
  font-size: 2.2rem;
}

.error-box h3 {
  font-size: 1.5rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.error-box p {
  color: #64748b;
  font-size: 1.02rem;
  margin-bottom: 24px;
}

.retry-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.retry-btn:hover {
  background: #1d4ed8;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .bookings-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .bookings-section {
    padding: 16px;
  }
  .title {
    font-size: 1.8rem;
  }
}
</style>