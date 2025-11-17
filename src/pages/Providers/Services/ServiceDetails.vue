<!-- src/pages/Providers/Services/ServiceDetails.vue -->
<template>
  <div class="service-details-page">
    <div class="banner-section">
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

    <div class="details-content">
      <div class="header">
        <h1>{{ service.title }}</h1>
        <div class="category-tag">{{ getCategoryName(service.categoryId || service.category) }}</div>
      </div>

      <p class="description">{{ service.description }}</p>

      <div class="pricing-payment">
        <div class="price">
          <span class="total-price">{{ service.totalPrice }} ETB</span>
          <span v-if="service.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
        </div>
        <div class="payment" v-if="service.paymentMethod">
          <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
        </div>
      </div>

      <div class="availability-section">
        <h3>Weekly Availability</h3>
        <div class="weekly-slots">
          <div v-for="(slots, date) in getWeeklySlots(service)" :key="date" class="date-group">
            <h4>{{ formatDate(date) }}</h4>
            <div class="slot-buttons">
              <button v-for="(slot, idx) in slots" :key="idx" class="slot-button">
                {{ formatTime(slot.start) }} – {{ formatTime(slot.end) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn edit-btn" @click="goToEdit">Edit</button>
        <button class="btn delete-btn" @click="confirmDelete">Delete</button>
        <button class="btn back-btn" @click="$router.back()">Back</button>
      </div>
    </div>

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
import http from "@/api/index.js";

export default {
  name: "ServiceDetails",
  data() {
    return {
      service: null,
      categories: [],
      showDeleteConfirm: false,
      deleting: false,
    };
  },
  async created() {
    await this.fetchCategories();
    await this.fetchService();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.warn("Failed to load categories");
      }
    },
    async fetchService() {
      const serviceId = this.$route.params.id;
      try {
        const res = await http.get(`/services/${serviceId}`);
        this.service = res.data;
        this.ensureAvailability();
      } catch (err) {
        alert("❌ Failed to load service details");
        this.$router.back();
      }
    },
    ensureAvailability() {
      const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      if (!this.service.availability) this.service.availability = {};
      days.forEach(day => {
        if (!this.service.availability[day]) this.service.availability[day] = { active: false, slots: [] };
      });
    },
    getCategoryName(idOrName) {
      if (!idOrName) return "Uncategorized";
      if (typeof idOrName === "string" && /[a-zA-Z]/.test(idOrName)) return idOrName;
      const cat = this.categories.find(c => c._id === idOrName);
      return cat ? cat.name : "Unknown";
    },
    getWeeklySlots(service) {
      if (!service || !service.availability) return {};
      const slots = {};
      const today = new Date();
      const dayMap = {0:'sunday',1:'monday',2:'tuesday',3:'wednesday',4:'thursday',5:'friday',6:'saturday'};
      for(let i=0;i<7;i++){
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayKey = dayMap[date.getDay()];
        const dayData = service.availability[dayKey];
        if(dayData?.active) slots[date.toISOString().split("T")[0]] = dayData.slots || [];
      }
      return slots;
    },
    formatDate(dateStr){
      const options={weekday:'short',month:'short',day:'numeric'};
      return new Date(dateStr).toLocaleDateString(undefined,options);
    },
    formatTime(timeStr){
      const [h,m] = timeStr.split(":").map(Number);
      const ampm = h>=12?'PM':'AM';
      const hour = h%12||12;
      return `${hour}:${m.toString().padStart(2,'0')} ${ampm}`;
    },
    goToEdit(){
      if(this.service?._id) this.$router.push(`/provider/services/edit/${this.service._id}`);
    },
    confirmDelete(){
      this.showDeleteConfirm = true;
    },
    async deleteService(){
      if(!this.service?._id) return;
      this.deleting = true;
      try{
        await http.delete(`/services/${this.service._id}`);
        alert("✅ Service deleted");
        this.$router.push("/provider/services");
      }catch(err){
        alert("❌ Failed to delete service");
      }finally{
        this.deleting=false;
      }
    }
  }
}
</script>

<style scoped>
.service-details-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
}
.banner-section {
  position: relative;
  height: 200px;
  margin-bottom: 24px;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}
.banner-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #dbeafe;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1d4ed8;
  font-size: 3rem;
}
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: #fff;
}
.status-badge.published{background:#16a34a;}
.status-badge.draft{background:#3b82f6;}
.status-badge.pending{background:#f97316;}

.details-content h1{
  font-size:2rem;
  margin:0 0 8px 0;
  color:#0f172a;
}
.category-tag{
  background:#f1f5f9;
  color:#475569;
  padding:4px 12px;
  border-radius:20px;
  font-size:0.85rem;
}
.description{
  margin:16px 0;
  color:#475569;
  line-height:1.6;
}
.pricing-payment{
  display:flex;
  gap:24px;
  margin-bottom:20px;
}
.price .total-price{font-weight:700;color:#0f172a;}
.price .booking-price{color:#64748b;margin-left:8px;}
.payment{display:flex;align-items:center;gap:6px;color:#64748b;}

.weekly-slots .date-group{margin-bottom:16px;}
.weekly-slots h4{font-size:0.95rem;font-weight:600;color:#334155;margin-bottom:8px;}
.slot-buttons{display:flex;flex-wrap:wrap;gap:8px;}
.slot-button{
  padding:8px 12px;
  border:1px solid #cbd5e1;
  border-radius:20px;
  background:white;
  font-size:0.875rem;
}
.slot-button:hover{background:#f1f5f9;border-color:#94a3b8;}

.actions{
  display:flex;
  gap:12px;
  margin-top:24px;
}
.btn{padding:10px 16px;border-radius:12px;font-weight:600;cursor:pointer;border:none;}
.edit-btn{background:#dbeafe;color:#1d4ed8;}
.edit-btn:hover{background:#bfdbfe;}
.delete-btn{background:#fee2e2;color:#dc2626;}
.delete-btn:hover{background:#fecaca;}
.back-btn{background:#f1f5f9;color:#475569;}
.back-btn:hover{background:#e2e8f0;}

/* Modal same as ServicesSection */
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .3s ease;}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0;}
.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);display:flex;justify-content:center;align-items:center;z-index:1100;backdrop-filter:blur(4px);padding:20px;}
.modal{background:white;border-radius:20px;max-width:500px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,.2);}
.delete-modal h3{margin:0 0 16px;font-size:1.5rem;color:#0f172a;}
.delete-modal p{color:#64748b;margin-bottom:24px;line-height:1.6;}
.modal-actions{display:flex;gap:16px;}
.cancel-btn{flex:1;background:#f1f5f9;color:#475569;padding:14px;border-radius:14px;font-weight:600;border:none;cursor:pointer;}
.delete-btn{flex:1;background:#ef4444;color:white;padding:14px;border-radius:14px;font-weight:600;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}
</style>
