<!-- src/pages/Providers/ServicesSection.vue -->
<template>
  <div class="services-section">
    <div class="section-header">
      <h1 class="section-title">My Services</h1>
      <p class="section-subtitle">Manage your service offerings and availability</p>
    </div>

    <!-- Controls -->
    <div class="controls-bar">
      <div class="search-filter">
        <div class="search-input">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search services..."
          />
        </div>
        <select v-model="statusFilter" class="status-filter">
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <button class="btn add-service-btn" @click="openForm(null)">
        <i class="fa-solid fa-plus"></i> Add New Service
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && services.length === 0" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading your services...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredServices.length === 0" class="empty-state">
      <i class="fa-solid fa-box-open"></i>
      <h3>No services found</h3>
      <p v-if="searchQuery || statusFilter">
        Try adjusting your filters.
      </p>
      <p v-else>
        You haven’t added any services yet.<br />
        Start by creating your first service!
      </p>
      <button class="btn primary-btn" @click="openForm(null)">Create Service</button>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="service._id"
        class="service-card"
        :class="{ 'status-draft': service.status === 'draft', 'status-pending': service.status === 'pending' }"
      >
        <!-- Banner -->
        <div class="card-banner">
          <img
            v-if="service.banner"
            :src="service.banner"
            :alt="service.title"
            class="banner-img"
          />
          <div v-else class="banner-placeholder">
            <i class="fa-solid fa-scissors"></i>
          </div>
          <div class="status-badge" :class="service.status">
            {{ service.status.charAt(0).toUpperCase() + service.status.slice(1) }}
          </div>
        </div>

        <!-- Content -->
        <div class="card-content">
          <!-- Edit Mode -->
          <div v-if="editingServiceId === service._id" class="edit-mode">
            <div class="edit-header">
              <h3>Edit Service</h3>
              <button class="btn cancel-btn" @click="cancelEdit(service._id)">
                Cancel
              </button>
            </div>

            <!-- Title -->
            <div class="form-group">
              <label>Title</label>
              <input
                v-model="service.title"
                type="text"
                class="form-control"
                placeholder="Service title"
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="service.description"
                class="form-control"
                rows="4"
                placeholder="Service description"
              ></textarea>
            </div>

            <!-- Pricing -->
            <div class="form-group">
              <label>Total Price (ETB)</label>
              <input
                v-model.number="service.totalPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>
            <div class="form-group">
              <label>Booking Deposit (ETB)</label>
              <input
                v-model.number="service.bookingPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>

            <!-- Payment Method -->
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="service.paymentMethod" class="form-control">
                <option value="">Select payment method</option>
                <option value="Telebirr">Telebirr</option>
                <option value="Chapa">Chapa</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <!-- Availability -->
            <div class="form-group">
              <h4>Availability</h4>
              <div class="day-controls">
                <div v-for="(dayData, dayKey) in service.availability" :key="dayKey" class="day-row">
                  <label class="day-toggle">
                    <input
                      type="checkbox"
                      :checked="dayData.active"
                      @change="toggleDay(service._id, dayKey)"
                    />
                    <span>{{ getDayLabel(dayKey) }}</span>
                  </label>
                  <div v-if="dayData.active" class="slot-controls">
                    <div v-for="(slot, index) in dayData.slots" :key="index" class="slot-item">
                      <input
                        v-model="slot.start"
                        type="time"
                        @change="validateSlot(service._id, dayKey, index)"
                      />
                      <span>to</span>
                      <input
                        v-model="slot.end"
                        type="time"
                        @change="validateSlot(service._id, dayKey, index)"
                      />
                      <button class="btn-remove-slot" @click="removeSlot(service._id, dayKey, index)">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <button class="btn-add-slot" @click="addSlot(service._id, dayKey)">
                      + Add Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="edit-actions">
              <button class="btn save-btn" @click="saveService(service._id)">
                Save Changes
              </button>
            </div>
          </div>

          <!-- View Mode -->
          <div v-else class="view-mode">
            <div class="card-header">
              <h3 class="service-title">{{ service.title }}</h3>
              <div class="category-tag">
                {{ getCategoryName(service.categoryId || service.category) }}
              </div>
            </div>
            <p class="service-description">
              {{ service.description.length > 100 ? service.description.slice(0, 100) + '...' : service.description }}
            </p>

            <div class="service-meta">
              <div class="price">
                <span class="total-price">{{ service.totalPrice }} ETB</span>
                <span v-if="service.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
              </div>
              <div class="payment" v-if="service.paymentMethod">
                <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
              </div>
            </div>

            <!-- Availability (Weekly) -->
            <div class="availability-section">
              <h4>Availability</h4>
              <div class="weekly-slots">
                <div v-for="(dateSlots, date) in getWeeklySlots(service)" :key="date" class="date-group">
                  <h5>{{ formatDate(date) }}</h5>
                  <div class="slot-buttons">
                    <button
                      v-for="(slot, idx) in dateSlots"
                      :key="idx"
                      class="slot-button"
                    >
                      {{ formatTime(slot.start) }} – {{ formatTime(slot.end) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="action-btn edit" @click.stop="startEdit(service._id)">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="action-btn delete" @click.stop="confirmDelete(service._id)">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
          <button class="action-btn preview" @click.stop="previewService(service._id)">
            <i class="fa-solid fa-eye"></i> Preview
          </button>
        </div>
      </div>
    </div>

    <!-- Service Form Modal (for new services only) -->
    <transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal service-form-modal" @click.stop>
          <div class="modal-header">
            <h2>{{ editingService ? 'Edit Service' : 'Create New Service' }}</h2>
            <button class="close-btn" @click="closeForm" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ServiceForm
            :service="editingService"
            @save="onServiceSaved"
            @close="closeForm"
          />
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal delete-modal" @click.stop>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this service? This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn cancel-btn" @click="showDeleteConfirm = false">Cancel</button>
            <button class="btn delete-btn" @click="deleteService" :disabled="deleting">
              <i v-if="deleting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ServiceForm from './ServiceForm.vue';
import http from "@/api/index.js";

export default {
  name: 'ServicesSection',
  components: { ServiceForm },
  data() {
    return {
      services: [],
      categories: [],
      loading: false,
      showForm: false,
      editingService: null,
      searchQuery: '',
      statusFilter: '',
      showDeleteConfirm: false,
      serviceToDelete: null,
      deleting: false,
      editingServiceId: null,
    };
  },

  computed: {
    filteredServices() {
      let result = this.services;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          this.getCategoryName(s.categoryId || s.category).toLowerCase().includes(q)
        );
      }
      if (this.statusFilter) {
        result = result.filter(s => s.status === this.statusFilter);
      }
      return result;
    }
  },

  async created() {
    await this.fetchCategories();
    await this.fetchServices();
  },

  methods: {
    closeForm() {
      this.showForm = false;
      this.editingService = null;
    },

    async fetchCategories() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.warn("Failed to load categories for display");
      }
    },

    getCategoryName(idOrName) {
      if (!idOrName) return "Uncategorized";
      if (typeof idOrName === 'string' && /[a-zA-Z]/.test(idOrName)) {
        return idOrName;
      }
      const cat = this.categories.find(c => c._id === idOrName);
      return cat ? cat.name : "Unknown";
    },

    async fetchServices() {
      this.loading = true;
      try {
        let providerId = null;
        try {
          const loggedProvider = JSON.parse(localStorage.getItem("loggedProvider") || "{}");
          providerId = loggedProvider._id;
        } catch (e) {
          console.warn("Malformed loggedProvider");
        }
        if (!providerId) {
          providerId = localStorage.getItem("provider_id");
        }
        if (!providerId) {
          throw new Error("Provider ID missing");
        }

        const res = await http.get(`/services?pid=${providerId}`);
        let services = Array.isArray(res.data) ? res.data : [];

        // ✅ Ensure all 7 days exist in availability AND assign fallback _id
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        services = services.map(service => {
          // 🔥 CRITICAL: Ensure _id exists and is truthy
          if (!service._id) {
            console.warn("Service missing _id, assigning temporary ID", service);
            service._id = 'temp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
          }

          const availability = { ...service.availability };
          daysOfWeek.forEach(day => {
            if (!availability[day]) {
              availability[day] = { active: false, slots: [] };
            }
          });
          return {
            _id: service._id,
            ...service,
            availability
          };
        });

        this.services = services;
      } catch (err) {
        console.error("Failed to fetch services:", err);
        alert("❌ Could not load your services. Please refresh.");
        this.services = [];
      } finally {
        this.loading = false;
      }
    },

    openForm(service) {
      this.editingService = service ? { ...service } : null;
      this.showForm = true;
    },

    async onServiceSaved(savedService) {
      await this.fetchServices();
      this.closeForm();
    },

    confirmDelete(id) {
      this.serviceToDelete = id;
      this.showDeleteConfirm = true;
    },

    async deleteService() {
      if (!this.serviceToDelete) return;
      this.deleting = true;
      try {
        await http.delete(`/infinity-booking/services/${this.serviceToDelete}`);
        await this.fetchServices();
        this.showDeleteConfirm = false;
        alert("✅ Service deleted successfully!");
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to delete service";
        alert(`❌ ${msg}`);
      } finally {
        this.deleting = false;
      }
    },

    previewService(serviceId) {
      if (!serviceId) {
        alert("❌ Service ID not available.");
        return;
      }
      this.$router.push(`/provider/services/${serviceId}`);
    },

    // ✅ IN-PLACE EDIT — with safety check
    startEdit(serviceId) {
      if (!serviceId) {
        console.error("Cannot edit service: missing or invalid ID");
        alert("This service cannot be edited (missing ID).");
        return;
      }
      this.editingServiceId = serviceId;
    },

    cancelEdit(serviceId) {
      this.editingServiceId = null;
    },

    async saveService(serviceId) {
      const service = this.services.find(s => s._id === serviceId);
      if (!service) return;

      // Prevent saving temporary services via in-place edit
      if (String(service._id).startsWith('temp-')) {
        alert("Please use 'Add New Service' to create services.");
        this.editingServiceId = null;
        return;
      }

      try {
        const updatedService = {
          ...service,
          slots: this.buildSlotsFromAvailability(service.availability)
        };
        await http.put(`/infinity-booking/services/${serviceId}`, updatedService);
        this.editingServiceId = null;
        alert("✅ Service updated!");
      } catch (err) {
        alert("❌ Failed to save service: " + (err.response?.data?.message || err.message));
      }
    },

    // ✅ WEEKLY SLOTS — moved to method
    getWeeklySlots(service) {
      if (!service || !service.availability) return {};
      const slots = {};
      const today = new Date();
      const dayMap = {0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday'};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayIndex = date.getDay();
        const dayKey = dayMap[dayIndex];
        
        const dayData = service.availability[dayKey];
        if (dayData?.active) {
          slots[date.toISOString().split('T')[0]] = dayData.slots || [];
        }
      }
      return slots;
    },

    // ✅ AVAILABILITY EDITING
    toggleDay(serviceId, dayKey) {
      const service = this.services.find(s => s._id === serviceId);
      if (!service) return;
      service.availability[dayKey].active = !service.availability[dayKey].active;
      if (!service.availability[dayKey].active) {
        service.availability[dayKey].slots = [];
      } else if (service.availability[dayKey].slots.length === 0) {
        service.availability[dayKey].slots = [{ start: "09:00", end: "17:00" }];
      }
    },

    addSlot(serviceId, dayKey) {
      const service = this.services.find(s => s._id === serviceId);
      if (!service) return;
      service.availability[dayKey].slots.push({ start: "09:00", end: "17:00" });
    },

    removeSlot(serviceId, dayKey, index) {
      const service = this.services.find(s => s._id === serviceId);
      if (!service) return;
      if (service.availability[dayKey].slots.length <= 1) {
        service.availability[dayKey].active = false;
        service.availability[dayKey].slots = [];
      } else {
        service.availability[dayKey].slots.splice(index, 1);
      }
    },

    validateSlot(serviceId, dayKey, index) {
      const service = this.services.find(s => s._id === serviceId);
      if (!service) return;
      const slot = service.availability[dayKey].slots[index];
      if (!slot.start || !slot.end) return;
      if (slot.start >= slot.end) {
        const [h, m] = slot.start.split(':').map(Number);
        const newEnd = new Date();
        newEnd.setHours(h, m + 60);
        slot.end = newEnd.toTimeString().slice(0, 5);
      }
    },

    buildSlotsFromAvailability(availability) {
      const allSlots = [];
      Object.entries(availability).forEach(([dayKey, dayData]) => {
        if (dayData.active) {
          dayData.slots.forEach(slot => {
            if (slot.start && slot.end) {
              const now = new Date();
              for (let i = 0; i < 7; i++) {
                const date = new Date(now);
                date.setDate(date.getDate() + i);
                const dayIndex = date.getDay();
                const dayMap = {0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday'};
                if (dayMap[dayIndex] === dayKey) {
                  allSlots.push({
                    date: date.toISOString().split('T')[0],
                    startTime: slot.start,
                    endTime: slot.end
                  });
                }
              }
            }
          });
        }
      });
      return allSlots;
    },

    getDayLabel(dayKey) {
      const labels = {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      };
      return labels[dayKey] || dayKey;
    },

    formatDate(dateString) {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    formatTime(timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    }
  }
};
</script>

<style scoped>
/* ✅ In-Place Edit Styles */
.edit-mode {
  background: #f8fafc;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  margin-top: 16px;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.day-row {
  margin-bottom: 16px;
}

.day-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 8px;
}

.day-toggle input {
  width: 18px;
  height: 18px;
}

.slot-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}

.slot-item input[type="time"] {
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 120px;
}

.btn-remove-slot {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-add-slot {
  background: #dbeafe;
  color: #1d4ed8;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 8px;
}

.edit-actions {
  margin-top: 20px;
  text-align: center;
}

.save-btn {
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
}

.save-btn:hover {
  background: #15803d;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

/* Weekly Slots */
.weekly-slots {
  margin-top: 12px;
}

.date-group {
  margin-bottom: 16px;
}

.date-group h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.slot-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slot-button {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.slot-button:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

/* Keep all your existing styles for cards, actions, modals, etc. */

.services-section {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 2.2rem;
  color: #0f172a;
  margin-bottom: 12px;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-filter {
  display: flex;
  gap: 16px;
  flex: 1;
  max-width: 500px;
}

.search-input {
  position: relative;
  flex: 1;
}

.search-input i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
}

.status-filter {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
}

.add-service-btn {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.add-service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-state i, .empty-state i {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #334155;
  margin-bottom: 12px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.primary-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.service-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.card-banner {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f0fdf4, #dcfce7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  font-size: 3rem;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.status-badge.published { background: #16a34a; }
.status-badge.draft { background: #3b82f6; }
.status-badge.pending { background: #f97316; }

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.service-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.category-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.service-description {
  color: #475569;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 48px;
}

.service-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.price .total-price {
  font-weight: 700;
  color: #0f172a;
  font-size: 1.2rem;
}

.price .booking-price {
  color: #64748b;
  font-size: 0.9rem;
  margin-left: 8px;
}

.payment {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.95rem;
}

.time-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0d9488;
  font-size: 0.95rem;
  background: #ecfdf5;
  padding: 8px 12px;
  border-radius: 12px;
  margin-top: 8px;
}

.card-actions {
  display: flex;
  padding: 0 20px 20px;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  font-size: 0.95rem;
}

.action-btn.edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-btn.edit:hover {
  background: #bfdbfe;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
}

.action-btn.preview {
  background: #f5f5f5;
  color: #333;
}

.action-btn.preview:hover {
  background: #e0e0e0;
}

/* Modals */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(4px);
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.service-form-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 1.2rem;
  transition: background 0.2s, color 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.delete-modal h3 {
  margin: 0 0 16px;
  font-size: 1.5rem;
  color: #0f172a;
}

.delete-modal p {
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 16px;
}

.cancel-btn {
  flex: 1;
  background: #f1f5f9;
  color: #475569;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.delete-btn {
  flex: 1;
  background: #ef4444;
  color: white;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter {
    flex-direction: column;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .modal {
    width: 95%;
    max-width: none;
  }
}
</style>