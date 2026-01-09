<!-- src/pages/auth/ForgotPassword.vue -->
<template>
  <div class="forgot-page">
    <div class="forgot-card">
      <h2>Forgot Password?</h2>
      <p class="subtitle">
        Enter your phone number to receive a reset code via Telegram.
      </p>

      <form class="form" @submit.prevent="sendResetOtp">
        <input
          v-model="phone"
          type="text"
          placeholder="Phone Number (e.g., +998901234567)"
          required
        />
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? "Sending OTP..." : "Send Code via Telegram" }}
        </button>
        <p class="back-text" @click="goToLogin">← Back to Login</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();
const phone = ref("");
const loading = ref(false);
const error = ref("");

async function sendResetOtp() {
  const phoneNumber = phone.value.trim();
  if (!phoneNumber) {
    error.value = "Please enter your phone number.";
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    // ✅ Send OTP via Telegram using the correct endpoint
    await http.post("/auth/forgot-password", {
      phone: phoneNumber,
    });

    // Store phone in localStorage/session so ResetPassword can use it
    localStorage.setItem("reset_phone", phoneNumber);

    alert("✅ OTP sent! Check your Telegram messages.");
    router.push("/auth/reset-password");

  } catch (err) {
    error.value = err.response?.data?.message || "Failed to send OTP. Please try again.";
    console.error("OTP request error:", err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
}
</script>

<style scoped>
.forgot-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #93c5fd, #a7f3d0);
  padding: 2rem;
}
.forgot-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 420px;
  width: 100%;
  text-align: center;
}
h2 {
  color: #2563eb;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
}
.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.back-text {
  margin-top: 1rem;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
}
.error {
  color: #ef4444;
  font-size: 0.85rem;
}
</style>