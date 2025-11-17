<!-- src/pages/Auth/Register.vue -->
<template>
  <div class="auth-page">
    <!-- Left Section -->
    <div class="auth-left">
      <div class="left-content">
        <h2>Join <span>Infinity-Booking</span></h2>
        <p>
          Register to <span>Infinity-Booking</span><br />
          Showcase your professional skills and connect with customers looking for trusted providers.
        </p>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Provider illustration"
          class="animated-img"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Registration Card -->
    <div class="auth-container">
      <h1 class="title">Create Provider Account</h1>

      <form class="form" @submit.prevent="handleSignup">
        <input
          v-model="signup.fullname"
          type="text"
          placeholder="Full Name"
          required
          autocomplete="name"
        />
        <input
          v-model="signup.email"
          type="email"
          placeholder="Email"
          required
          autocomplete="email"
        />
        <input
          v-model="signup.phonenumber"
          type="tel"
          inputmode="numeric"
          placeholder="+2519XXXXXXXX or 09XXXXXXXX"
          required
        />
        <input
          v-model="signup.location"
          type="text"
          placeholder="Your Location (e.g., Addis Ababa)"
          required
        />
        <input
          v-model="signup.FIN"
          type="text"
          placeholder="FIN (optional)"
        />

        <!-- Service Selection (Preserving your original dropdown UI) -->
        <div class="service-select">
          <div class="service-dropdown" @click="toggleServiceDropdown" :class="{ open: serviceDropdownOpen }">
            <span v-if="!selectedCategoryName">Select your service category</span>
            <span v-else>{{ selectedCategoryName }}</span>
            <i class="fa fa-chevron-down dropdown-icon"></i>
          </div>
          <div v-if="serviceDropdownOpen" class="service-options">
            <div
              v-for="cat in categories"
              :key="cat._id"
              class="service-option"
              :class="{ selected: signup.serviceCategoryId === cat._id }"
              @click.stop="selectCategory(cat)"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>

        <textarea
          v-model="signup.workExperience"
          placeholder="Your experience (optional)"
          rows="2"
        ></textarea>

        <!-- Certificate Upload -->
        <div class="file-upload work-section" @click="$refs.certInput.click()">
          <input ref="certInput" @change="handleCertificateUpload" type="file" accept=".pdf,.jpg,.png" hidden />
          <div class="work-upload">
            <span v-if="!signup.certificate">Upload Certificate (optional)</span>
            <span v-else>{{ signup.certificate.name }}</span>
          </div>
        </div>

        <!-- Password Fields -->
        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="signup.password"
            placeholder="Password"
            required
          />
          <span class="toggle-password" @click="showPassword = !showPassword">
            <i v-if="showPassword" class="fa fa-eye-slash"></i>
            <i v-else class="fa fa-eye"></i>
          </span>
        </div>

        <div class="password-field">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="signup.confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <span class="toggle-password" @click="showConfirm = !showConfirm">
            <i v-if="showConfirm" class="fa fa-eye-slash"></i>
            <i v-else class="fa fa-eye"></i>
          </span>
        </div>

        <label class="terms">
          <input v-model="signup.accept" type="checkbox" required />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? "Registering..." : "Create Account" }}
        </button>

        <p class="switch-text">
          Already have an account?
          <span @click="goToLogin">Login</span>
        </p>
      </form>
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

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const serviceDropdownOpen = ref(false);
const categories = ref([]);
const toasts = ref([]);
const signup = ref({
  fullname: '',
  email: '',
  phonenumber: '',
  location: '',
  FIN: '',
  serviceCategoryId: '',
  workExperience: '',
  certificate: null,
  password: '',
  confirmPassword: '',
  accept: false,
});

// ✅ Preserve your original dropdown behavior
const selectedCategoryName = computed(() => {
  const cat = categories.value.find(c => c._id === signup.value.serviceCategoryId);
  return cat ? cat.name : '';
});

const toggleServiceDropdown = () => {
  serviceDropdownOpen.value = !serviceDropdownOpen.value;
};

const selectCategory = (cat) => {
  signup.value.serviceCategoryId = cat._id;
  serviceDropdownOpen.value = false;
};

// Toast system
const showToast = (message, type = 'info') => {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

const getToastIcon = (type) => {
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-circle-info'
  };
  return icons[type] || icons.info;
};

// Fetch categories on mount
onMounted(async () => {
  try {
    const res = await http.get("/categories");
    categories.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed to load categories:", err);
    showToast("Could not load service categories.", "error");
  }
});

const handleCertificateUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    signup.value.certificate = file;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const handleSignup = async () => {
  // Validation
  if (!signup.value.serviceCategoryId) {
    showToast("Please select a service category.", "error");
    return;
  }
  if (signup.value.password !== signup.value.confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }
  if (!signup.value.accept) {
    showToast("Please agree to the Terms & Conditions.", "error");
    return;
  }

  const formData = new FormData();
  formData.append('fullname', signup.value.fullname.trim());
  formData.append('email', signup.value.email.trim());
  formData.append('phonenumber', signup.value.phonenumber.trim());
  formData.append('location', signup.value.location.trim());
  if (signup.value.FIN) formData.append('FIN', signup.value.FIN.trim());
  formData.append('serviceCategoryId', signup.value.serviceCategoryId);
  if (signup.value.workExperience) formData.append('workExperience', signup.value.workExperience.trim());
  if (signup.value.certificate) formData.append('certificate', signup.value.certificate);
  formData.append('password', signup.value.password);
  formData.append('confirmPassword', signup.value.confirmPassword);

  try {
    loading.value = true;
    await http.post("/auth/register/provider", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    showToast("Registration request sent successfully!", "success");
    router.push('/login');
  } catch (err) {
    console.error("❌ Registration error:", err);
    const msg = err.response?.data?.message || "Registration failed. Please try again.";
    showToast(msg, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ===== YOUR ORIGINAL STYLES — FULLY PRESERVED ===== */
.auth-page {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e40af, #22d3ee);
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 0;
  margin: 0;
}

.auth-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.left-content {
  text-align: center;
  max-width: 420px;
  animation: fadeInUp 0.6s ease-out;
}

.left-content h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}
.left-content span {
  color: #facc15;
}
.left-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #f9fafb;
  line-height: 1.6;
}
.animated-img {
  width: 90%;
  max-width: 380px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  animation: float 6s ease-in-out infinite;
  margin-top: 1rem;
}

.auth-container {
  flex: 1;
  background: #fff;
  color: #111;
  border-radius: 20px 0 0 20px;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.25);
  padding: 3rem;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.5s ease-out;
}

.title {
  color: #1e40af;
  font-size: 1.9rem;
  margin-bottom: 1.8rem;
  font-weight: 700;
  text-align: center;
  position: relative;
}
.title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background: #1e40af;
  margin: 0.5rem auto;
  border-radius: 3px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

input,
textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 0.98rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}
input:focus,
textarea:focus {
  border-color: #1e40af;
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.15);
  background: #fff;
}

/* ✅ PRESERVE YOUR BEAUTIFUL DROPDOWN STYLE */
.service-select {
  position: relative;
}

.service-dropdown {
  padding: 0.9rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  transition: all 0.25s ease;
}
.service-dropdown:hover,
.service-dropdown.open {
  border-color: #1e40af;
  background: #fff;
}
.dropdown-icon {
  transition: transform 0.3s ease;
}
.service-dropdown.open .dropdown-icon {
  transform: rotate(180deg);
}

.service-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  margin-top: 6px;
  z-index: 100;
  max-height: 180px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.3rem 0;
}

.service-option {
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.98rem;
}
.service-option:hover {
  background-color: #f0f9ff;
}
.service-option.selected {
  background-color: #1e40af;
  color: #fff;
  font-weight: 600;
}

.password-field {
  position: relative;
}
.password-field input {
  padding-right: 44px;
}
.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #1e40af;
}
.toggle-password:hover {
  color: #2563eb;
}

.work-upload {
  border: 1px dashed #1e40af;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  color: #555;
  background: #f8fafc;
  transition: all 0.3s ease;
}
.work-upload:hover {
  background: #eff6ff;
  border-color: #2563eb;
  transform: translateY(-2px);
}

.btn {
  background: linear-gradient(120deg, #1e40af, #2563eb);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4);
}
.btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.92rem;
  color: #444;
  line-height: 1.5;
}
.terms input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #1e40af;
  cursor: pointer;
  margin-top: 2px;
}
.terms span {
  color: #333;
  font-weight: 500;
}

.switch-text {
  margin-top: 0.8rem;
  font-size: 0.95rem;
  text-align: center;
  color: #4b5563;
}
.switch-text span {
  color: #1e40af;
  cursor: pointer;
  font-weight: 600;
}
.switch-text span:hover {
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
.toast--success { background: linear-gradient(120deg, #16a34a, #22c55e); }
.toast--error { background: linear-gradient(120deg, #dc2626, #ef4444); }
.toast i { font-size: 1.2rem; }
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

/* ===== MOBILE-FIRST RESPONSIVE ===== */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
    padding: 1.5rem;
    min-height: auto;
  }

  .auth-left {
    padding: 1.8rem;
    background: rgba(255, 255, 255, 0.08);
    border-right: none;
    border-radius: 22px;
    margin-bottom: 2rem;
    width: 100%;
    order: 1;
  }

  .auth-container {
    width: 100%;
    max-width: 100%;
    border-radius: 22px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
    padding: 2.2rem;
    order: 2;
  }

  .left-content h2 { font-size: 1.9rem; }
  .left-content p { font-size: 0.98rem; }
  .animated-img { max-width: 320px; margin-top: 1.5rem; }
  .title { font-size: 1.8rem; }
}

@media (max-width: 600px) {
  .auth-page { padding: 1.2rem; }
  .auth-left { padding: 1.5rem; }
  .left-content h2 { font-size: 1.65rem; }
  .auth-container { padding: 2rem; }
  .title { font-size: 1.6rem; }
  input, textarea, .service-dropdown, .work-upload { padding: 1.1rem; font-size: 1.02rem; }
  .btn { padding: 1.15rem; font-size: 1.1rem; }
}

@media (max-width: 420px) {
  .auth-page { padding: 1rem; }
  .left-content h2 { font-size: 1.5rem; }
  .auth-container { padding: 1.8rem; }
  .title { font-size: 1.5rem; }
  input, textarea, .service-dropdown, .work-upload { padding: 1.2rem; }
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>