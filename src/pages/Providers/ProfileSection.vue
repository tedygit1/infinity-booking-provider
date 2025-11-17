<!-- src/pages/Providers/ProfileSection.vue -->
<template>
  <div class="profile-section">
    <!-- Header with Status Badge -->
    <div class="profile-header">
      <h2>Manage Your Profile</h2>
      <div class="header-right">
        <div class="status-badge" :class="providerStatus">
          {{ providerStatus }}
        </div>
        <button @click="editMode = !editMode" class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>
    </div>

    <div class="profile-content">
      <!-- Left: Profile Image (Always editable) -->
      <div class="profile-picture-wrapper">
        <div class="profile-picture" @click="triggerFileInput">
          <img v-if="profileImage" :src="profileImage" alt="Profile" />
          <div v-else class="placeholder"><i class="fa-solid fa-user"></i></div>
          <button class="edit-icon"><i class="fa-solid fa-pen"></i></button>
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
        </div>
        <div v-if="uploadingPhoto" class="uploading-overlay">
          <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
      </div>

      <!-- Right: Profile Fields -->
      <div class="profile-info">
        <h3>Personal Information</h3>
        <div class="field"><label>Full Name:</label><input v-model="fullname" :disabled="!editMode" /></div>
        <div class="field"><label>Email:</label><input v-model="email" disabled /></div>
        <div class="field"><label>Phone:</label><input v-model="phonenumber" :disabled="!editMode" /></div>
        <div class="field"><label>Location:</label><input v-model="location" :disabled="!editMode" /></div>
        <div class="field"><label>FIN:</label><input v-model="FIN" :disabled="!editMode" /></div>
        <div class="field"><label>Work Experience:</label><textarea v-model="workExperience" :disabled="!editMode" rows="3"></textarea></div>
        
        <!-- Service Categories -->
        <div class="field">
          <label>Service Categories:</label>
          <input 
            v-model="categoriesText" 
            disabled 
            placeholder="No categories added"
          />
        </div>
        
        <div v-if="certificate" class="field">
          <label>Certificate:</label>
          <a :href="certificate" target="_blank" class="certificate-link">View Certificate</a>
        </div>

        <button v-if="editMode" class="save-btn" @click="saveProfileFields" :disabled="saving">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Toast Notifications -->
    <transition-group name="toast-slide" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <i :class="getToastIcon(toast.type)"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import http from "@/api/index.js";

export default {
  name: 'ProfileSection',
  props: {
    provider: { 
      type: Object, 
      required: true, 
      default: () => ({}) 
    }
  },

  data() {
    return {
      fullname: '',
      email: '',
      phonenumber: '',
      location: '',
      FIN: '',
      workExperience: '',
      certificate: '',
      profileImage: null,
      editMode: false,
      uploadingPhoto: false,
      saving: false,
      categoriesText: '',
      toasts: []
    };
  },

  computed: {
    providerStatus() {
      return this.provider?.providerProfile?.status || this.provider?.status || 'pending';
    }
  },

  watch: {
    provider: {
      handler(newVal) {
        if (!newVal) return;
        const profile = newVal.providerProfile || {};
        this.fullname = newVal.fullname || '';
        this.email = newVal.email || '';
        this.phonenumber = profile.phonenumber || '';
        this.location = profile.location || '';
        this.FIN = profile.FIN || '';
        this.workExperience = profile.workExperience || '';
        this.certificate = profile.certificate || '';
        this.profileImage = newVal.profilePhoto || null;
        const categoriesFromServices = newVal.services?.map(s => s.category || s.categoryName).filter(Boolean) || [];
        this.categoriesText = categoriesFromServices.join(', ') || '';
      },
      immediate: true
    }
  },

  methods: {
    showToast(message, type = 'info') {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 4000);
    },

    getToastIcon(type) {
      const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
      };
      return icons[type] || icons.info;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async onFileChange(event) {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) {
        this.showToast('Please select a valid image file (JPEG/PNG).', 'error');
        return;
      }
      event.target.value = '';

      const reader = new FileReader();
      reader.onload = e => this.profileImage = e.target.result;
      reader.readAsDataURL(file);

      this.uploadingPhoto = true;
      try {
        const fd = new FormData();
        fd.append("photo", file);

        const res = await http.patch('/users/profile-photo/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data?.profilePhoto) {
          this.profileImage = res.data.profilePhoto;
          this.$emit('profileUpdated');
          this.showToast('✅ Profile photo updated successfully!', 'success');
        } else {
          throw new Error('No photo URL returned');
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
        this.profileImage = this.provider.profilePhoto || null;
        const msg = err.response?.data?.message || 'Failed to upload photo. Please try again.';
        this.showToast(msg, 'error');
      } finally {
        this.uploadingPhoto = false;
      }
    },

    // ==========================
    // 💾 UPDATE PROFILE USING /users/{id} (ONLY CHANGE HERE)
    // ==========================
    async saveProfileFields() {
      if (!this.fullname?.trim()) {
        this.showToast('Full name is required.', 'error');
        return;
      }

      // ✅ Get your ID (from provider prop)
      const providerId = this.provider?._id;
      if (!providerId) {
        this.showToast('User ID missing.', 'error');
        return;
      }

      this.saving = true;
      try {
        const payload = {
          fullname: this.fullname.trim(),
          phonenumber: this.phonenumber?.trim(),
          location: this.location?.trim(),
          FIN: this.FIN?.trim(),
          workExperience: this.workExperience?.trim()
        };

        // ✅ ONLY CHANGE: Use /users/{id} — not /users/profile
        await http.patch(`/users/${providerId}`, payload);

        this.showToast('✅ Profile updated successfully!', 'success');
        this.editMode = false;
        this.$emit('profileUpdated');
      } catch (err) {
        console.error('Profile update failed:', err);
        const msg = err.response?.data?.message || 'Failed to update profile. Please try again.';
        this.showToast(msg, 'error');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
/* ===== PROFILE SECTION ===== */
.profile-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  position: relative;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #475569;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.confirmed { background: #dcfce7; color: #166534; }
.status-badge.rejected { background: #fee2e2; color: #b91c1c; }

.profile-content {
  display: flex;
  gap: 48px;
}

.profile-picture-wrapper {
  flex: 0 0 180px;
  position: relative;
}

.profile-picture {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #cbd5e1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.profile-picture:hover {
  border-color: #22c55e;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 3rem;
  color: #cbd5e1;
}

.edit-icon {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: #22c55e;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.profile-picture input[type="file"] {
  display: none;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #22c55e;
}

.profile-info {
  flex: 1;
  min-width: 300px;
}

.profile-info h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.field input,
.field textarea {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fafafa;
  transition: all 0.2s;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #22c55e;
  background: white;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.field textarea {
  resize: vertical;
  min-height: 80px;
}

.field input:disabled,
.field textarea:disabled {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}

.save-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.certificate-link {
  color: #2563eb;
  text-decoration: underline;
}

/* Toast Styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  pointer-events: all;
}

.toast--success {
  background: linear-gradient(120deg, #16a34a, #22c55e);
}

.toast--error {
  background: linear-gradient(120deg, #dc2626, #ef4444);
}

.toast i {
  font-size: 1.2rem;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}
.toast-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .profile-section {
    padding: 20px;
  }
  
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-picture-wrapper {
    margin-bottom: 24px;
  }
}
</style>