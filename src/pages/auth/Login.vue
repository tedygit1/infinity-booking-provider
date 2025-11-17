<!-- src/pages/Auth/Login.vue -->
<template>
  <div class="auth-page">
    <!-- Visual Section -->
    <div class="auth-image">
      <div class="overlay"></div>
      <img
        src="@/assets/log.jpg"
        alt="Provider managing bookings on Infinity-Booking"
        class="floating-image"
        loading="lazy"
      />
      <div class="image-text">
        <h2>Hey Beloved Provider</h2>
        <p>Login to manage your bookings, grow your services, and connect with clients.</p>
        <div class="motivations">
          <p><i class="fas fa-calendar-check"></i> Schedule your work hours easily</p>
          <p><i class="fas fa-users"></i> Reach hundreds of new customers</p>
          <p><i class="fas fa-bolt"></i> Boost your business productivity</p>
        </div>
      </div>
    </div>

    <!-- Login Form -->
    <div class="auth-container">
      <h1 class="title">Provider Login</h1>

      <form class="form" @submit.prevent="handleLogin">
        <input
          v-model="loginEmail"
          type="email"
          placeholder="Email"
          required
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          autocomplete="email"
        />

        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginPassword"
            placeholder="Password"
            required
            autocomplete="current-password"
          />
          <span class="toggle-password" @click="togglePassword" role="button" aria-label="Toggle password visibility">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>

        <div class="forgot-password">
          <span @click="goToForgotPassword" role="button">Forgot Password?</span>
        </div>

        <button type="submit" class="btn" :disabled="loginLoading" aria-busy="loginLoading">
          {{ loginLoading ? "Logging in..." : "Login" }}
        </button>

        <p class="switch-text">
          Don't have an account?
          <span @click="goToRegister" role="button">Register</span>
        </p>

        <!-- ✅ Error message (for validation or network errors) -->
        <div v-if="loginError" class="error-message" role="alert">
          ❌ {{ loginError }}
        </div>

        <!-- ✅ Status message (for account status: pending, rejected, confirmed) -->
        <div v-if="statusMessage" class="status-message" :class="statusType">
          {{ statusMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();
const loginEmail = ref("");
const loginPassword = ref("");
const showPassword = ref(false);
const loginLoading = ref(false);
const loginError = ref(null);
const statusMessage = ref(null);
const statusType = ref("");

async function handleLogin() {
  loginLoading.value = true;
  loginError.value = null;
  statusMessage.value = null;
  statusType.value = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    loginError.value = "Email and password are required";
    loginLoading.value = false;
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    loginError.value = "Please enter a valid email address";
    loginLoading.value = false;
    return;
  }

  try {
    const res = await http.post("/auth/login", { email, password });
    const token = res.data?.token;
    const user = res.data?.user;

    if (!token || !user?._id) {
      throw new Error("Invalid login response");
    }

    // ✅ Normalize and handle status
    const status = user.status?.toLowerCase().trim();

    if (status === 'pending' || status === 'under review') {
      statusMessage.value = "Your account is under review. Please wait for confirmation.";
      statusType.value = "pending";
    } else if (status === 'rejected' || status === 'denied') {
      statusMessage.value = "Your account has been rejected by admin.";
      statusType.value = "rejected";
    } else {
      statusMessage.value = "Your account has been confirmed. Successfully logged in!";
      statusType.value = "confirmed";

      localStorage.setItem("provider_token", token);
      localStorage.setItem("provider_id", user._id);
      
      localStorage.setItem("loggedProvider", JSON.stringify({
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        serviceCategoryId: user.serviceCategoryId,
        categoryId: user.categoryId,
        categoryName: user.categoryName,
        category: user.category
      }));

      setTimeout(() => {
        router.push({ name: "ProviderHome" });
      }, 1200);
    }
  } catch (err) {
    console.error("Login error:", err);
    loginError.value = err.response?.data?.message || "Wait until your account is reviewed by admin. You will be notified soon about the status of your account.";
  } finally {
    loginLoading.value = false;
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function goToRegister() {
  router.push("/register");
}

function goToForgotPassword() {
  router.push("/forgot-password");
}
</script>

<style scoped>
/* ===== BASE ===== */
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #93c5fd, #a7f3d0);
  font-family: "Poppins", sans-serif;
  padding: 1.8rem;
  overflow: hidden;
  margin: 0;
}

/* ===== IMAGE SECTION ===== */
.auth-image {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  height: 520px;
  animation: fadeIn 0.7s ease-out;
}

.auth-image img {
  width: 100%;
  max-width: 580px;
  border-radius: 28px;
  object-fit: cover;
  z-index: 2;
  opacity: 0.95;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.55), rgba(16, 185, 129, 0.55));
  z-index: 1;
  border-radius: 28px;
}

.image-text {
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  z-index: 3;
  max-width: 90%;
  padding: 0 1rem;
}

.image-text h2 {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.image-text p {
  font-size: 1.02rem;
  opacity: 0.95;
  margin-top: 1.5rem;
  line-height: 1.5;
}

.motivations {
  margin-top: 1.4rem;
  text-align: left;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.motivations p {
  font-size: 0.98rem;
  color: #f0fdf4;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
}

.motivations i {
  color: #facc15;
  font-size: 1.1rem;
}

.floating-image {
  animation: float 6s ease-in-out infinite;
}

/* ===== FORM SECTION ===== */
.auth-container {
  flex: 1;
  max-width: 440px;
  background: white;
  padding: 2.8rem;
  border-radius: 22px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
  margin-left: 3.5rem;
  text-align: center;
  animation: slideInRight 0.6s ease-out;
}

.title {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
  color: #2563eb;
  position: relative;
}
.title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background: #2563eb;
  margin: 0.6rem auto 0;
  border-radius: 3px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

input {
  width: 100%;
  padding: 1rem 1.1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1.02rem;
  outline: none;
  background: #f9fafb;
  box-sizing: border-box;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  background: #fff;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 46px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
  cursor: pointer;
  font-size: 1.2rem;
}

.forgot-password {
  text-align: right;
  font-size: 0.95rem;
  color: #2563eb;
  cursor: pointer;
  margin-top: -0.6rem;
}
.forgot-password span {
  transition: color 0.2s ease;
}
.forgot-password span:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.btn {
  background: linear-gradient(120deg, #2563eb, #3b82f6);
  color: white;
  padding: 1.05rem;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.1rem;
  letter-spacing: 0.4px;
}
.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  background: linear-gradient(120deg, #1d4ed8, #2563eb);
}
.btn:disabled {
  opacity: 0.85;
  cursor: not-allowed;
}

.switch-text {
  margin-top: 1.1rem;
  font-size: 0.98rem;
  color: #4b5563;
}
.switch-text span {
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  margin-left: 6px;
}
.switch-text span:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.error-message {
  color: #ef4444;
  margin-top: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}

/* ===== STATUS MESSAGE ===== */
.status-message {
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
}

.status-message.pending {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fed7aa;
}

.status-message.rejected {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.status-message.confirmed {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 899px) {
  .auth-page {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.8rem;
  }

  .auth-image {
    order: 2;
    width: 100%;
    height: 280px;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  }

  .overlay {
    border-radius: 24px;
  }

  .image-text {
    bottom: 30px;
    max-width: 95%;
  }

  .image-text h2 { font-size: 1.8rem; }
  .image-text p { font-size: 0.95rem; }

  .auth-container {
    order: 1;
    margin-left: 0;
    width: 100%;
    padding: 2.4rem;
    border-radius: 24px;
  }

  .title { font-size: 1.9rem; }
  input { padding: 1.1rem; font-size: 1.05rem; }
  .btn { padding: 1.15rem; font-size: 1.15rem; }
}

@media (max-width: 600px) {
  .auth-page { padding: 1.2rem; gap: 1.6rem; }
  .auth-image { height: 240px; }
  .image-text { bottom: 25px; }
  .image-text h2 { font-size: 1.6rem; }
  .auth-container { padding: 2.2rem; }
  .title { font-size: 1.7rem; }
  input { padding: 1.2rem; }
  .btn { padding: 1.2rem; }
}

@media (max-width: 420px) {
  .auth-image { height: 210px; }
  .image-text h2 { font-size: 1.45rem; }
  .image-text p { font-size: 0.9rem; }
  .auth-container { padding: 2rem; }
  .title { font-size: 1.55rem; }
  .form { gap: 1.2rem; }
  input { padding: 1.25rem; }
  .btn { font-size: 1.1rem; }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>