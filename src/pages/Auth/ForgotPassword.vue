<template>
  <div class="forgot-page">
    <div class="forgot-card">
      <!-- Step 1: Enter Phone Number -->
      <div v-if="step === 1" class="step-phone">
        <h2>Forgot Password?</h2>
        <p class="subtitle">
          Enter the phone number you have registered with to receive a reset code via Telegram.
        </p>

        <form class="form" @submit.prevent="sendOtp">
          <!-- Phone Input -->
          <div class="input-group">
            <label>Phone Number</label>
            <div class="phone-input-container">
              <div class="country-code">+251</div>
              <input
                v-model="phoneDigits"
                type="tel"
                placeholder="939097846"
                @input="formatPhoneNumber"
                required
                maxlength="9"
                :class="{ 'error-border': showError }"
              />
            </div>
            <div class="hint" :class="{ 'error-text': showError }">
              {{ phoneHint }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn" 
            :disabled="loading || !isValidPhone"
            :class="{ 'disabled': !isValidPhone }"
          >
            <span v-if="loading" class="button-loading">
              <span class="spinner"></span> Sending OTP...
            </span>
            <span v-else>Send OTP via Telegram</span>
          </button>
          
          <p class="back-link" @click="goToLogin">← Back to Login</p>
          
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <strong>Error:</strong> {{ errorMessage }}
              <div v-if="requiresTelegramLink" class="telegram-link-hint">
                <p>Please link your phone with @InfinityBookingBot first</p>
                <button class="telegram-link-btn" @click="openTelegramLink">
                  📱 Open Telegram to Link Account
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Step 2: Reset Password with OTP -->
      <div v-if="step === 2" class="step-reset">
        <h2>Reset Password</h2>
        <p class="subtitle">
          Enter the OTP sent to your Telegram and your new password.
        </p>
        
        <!-- Phone Display -->
        <div class="phone-display">
          <div class="label">Phone Number:</div>
          <div class="value">{{ fullPhoneDisplay }}</div>
          <button class="change-phone" @click="step = 1">Change</button>
        </div>

        <form class="form" @submit.prevent="resetPassword">
          <!-- OTP Input -->
          <div class="input-group">
            <label>OTP Code</label>
            <input
              v-model="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              required
              :class="{ 'error-border': otpError }"
              @input="validateOtp"
            />
            <div class="hint">Check your Telegram messages for the OTP</div>
          </div>

          <!-- New Password with show/hide toggle -->
          <div class="input-group">
            <label>New Password</label>
            <div class="password-input-container">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                required
                :class="{ 'error-border': passwordError }"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showNewPassword = !showNewPassword"
              >
                <span v-if="showNewPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <div class="hint">Minimum 6 characters</div>
          </div>

          <!-- Confirm Password with show/hide toggle -->
          <div class="input-group">
            <label>Confirm Password</label>
            <div class="password-input-container">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                required
                :class="{ 'error-border': passwordError }"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span v-if="showConfirmPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
          </div>

          <!-- Password Strength Indicator -->
          <div v-if="newPassword.length > 0" class="password-strength">
            <div class="strength-label">Password Strength:</div>
            <div class="strength-bar">
              <div 
                class="strength-segment" 
                :class="getStrengthClass(1)"
              ></div>
              <div 
                class="strength-segment" 
                :class="getStrengthClass(2)"
              ></div>
              <div 
                class="strength-segment" 
                :class="getStrengthClass(3)"
              ></div>
              <div 
                class="strength-segment" 
                :class="getStrengthClass(4)"
              ></div>
            </div>
            <div class="strength-text">{{ passwordStrengthText }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="button-group">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="resetLoading || !isResetFormValid"
            >
              <span v-if="resetLoading" class="button-loading">
                <span class="spinner"></span> Resetting...
              </span>
              <span v-else>Reset Password</span>
            </button>
            
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="resendOtp"
              :disabled="resendCooldown > 0 || loading"
            >
              <span v-if="resendCooldown > 0">
                Resend OTP ({{ resendCooldown }}s)
              </span>
              <span v-else>Resend OTP</span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="resetErrorMessage" class="error-message">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <strong>Error:</strong> {{ resetErrorMessage }}
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <strong>Success!</strong> {{ successMessage }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();

// Step management
const step = ref(1); // 1 = Enter phone, 2 = Reset password

// Phone step data
const phoneDigits = ref(""); // Only digits without +251 (9 digits)
const loading = ref(false);
const errorMessage = ref("");
const requiresTelegramLink = ref(false);
const showError = ref(false);

// Reset step data
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const resetLoading = ref(false);
const resetErrorMessage = ref("");
const successMessage = ref("");
const otpError = ref(false);
const passwordError = ref(false);
const resendCooldown = ref(0);

// Password visibility
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Computed properties
const fullPhoneNumber = computed(() => {
  if (!phoneDigits.value || phoneDigits.value.length !== 9) return "";
  return `+251${phoneDigits.value}`;
});

const fullPhoneDisplay = computed(() => {
  if (!phoneDigits.value) return "";
  const digits = phoneDigits.value;
  return `+251 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
});

const isValidPhone = computed(() => {
  const digits = phoneDigits.value;
  if (!digits || digits.length !== 9) return false;
  
  // Ethiopian mobile numbers: starts with 9 (mobile) and has 9 digits after +251
  const regex = /^9[0-9]{8}$/;
  return regex.test(digits);
});

const phoneHint = computed(() => {
  if (!phoneDigits.value) return "Format: +251 939097846";
  
  if (!isValidPhone.value) {
    showError.value = true;
    if (phoneDigits.value.length !== 9) {
      return `Please enter 9 digits (you entered ${phoneDigits.value.length})`;
    }
    return "Please enter a valid Ethiopian mobile number starting with 9";
  }
  
  showError.value = false;
  return `Your number: ${fullPhoneDisplay.value}`;
});

const isResetFormValid = computed(() => {
  return otp.value.length === 6 && 
         newPassword.value.length >= 6 && 
         newPassword.value === confirmPassword.value;
});

// Password strength calculator
const passwordStrength = computed(() => {
  const password = newPassword.value;
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) strength++; // Has uppercase
  if (/[0-9]/.test(password)) strength++; // Has number
  if (/[^A-Za-z0-9]/.test(password)) strength++; // Has special char
  
  return Math.min(strength, 4); // Max 4
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return texts[strength];
});

// Methods
function formatPhoneNumber() {
  // Remove all non-digits
  phoneDigits.value = phoneDigits.value.replace(/\D/g, '');
  
  // Limit to 9 digits (after +251)
  if (phoneDigits.value.length > 9) {
    phoneDigits.value = phoneDigits.value.slice(0, 9);
  }
  
  // If user enters number with leading 0 (like 0939097846), remove it
  if (phoneDigits.value.startsWith('0') && phoneDigits.value.length === 10) {
    phoneDigits.value = phoneDigits.value.slice(1);
  }
  
  // Clear errors when user types
  if (errorMessage.value) {
    errorMessage.value = "";
    requiresTelegramLink.value = false;
  }
}

function validateOtp() {
  // Only allow digits
  otp.value = otp.value.replace(/\D/g, '');
  
  // Limit to 6 digits
  if (otp.value.length > 6) {
    otp.value = otp.value.slice(0, 6);
  }
  
  // Clear OTP error
  otpError.value = false;
}

// Open Telegram link directly
function openTelegramLink() {
  const botUsername = "InfinityBookingBot"; // Change this to your actual bot username
  const telegramLink = `https://t.me/${botUsername}?start=link_phone`;
  
  // Open Telegram link in new tab
  window.open(telegramLink, '_blank');
  
  // Also show instructions
  alert(`Telegram opened! Please:\n1. Start a chat with @${botUsername}\n2. Send /start command\n3. Follow the instructions to link your phone number\n4. Come back here and try again.`);
}

async function sendOtp() {
  if (!isValidPhone.value) {
    errorMessage.value = "Please enter a valid 9-digit Ethiopian mobile number (like 939097846)";
    showError.value = true;
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";
    showError.value = false;
    requiresTelegramLink.value = false;

    console.log("📱 Sending OTP to:", fullPhoneNumber.value);

    // ✅ Send OTP with longer timeout
    const response = await http.post("/auth/forgot-password", {
      phonenumber: fullPhoneNumber.value,
    }, {
      timeout: 30000 // Override global timeout for this request
    });

    console.log("✅ OTP Response:", response.data);

    const responseData = response.data;
    
    if (responseData.success === false) {
      errorMessage.value = responseData.message || "Failed to send OTP";
      
      if (responseData.requiresTelegramLink) {
        requiresTelegramLink.value = true;
        // Auto-open Telegram link if user needs to link
        setTimeout(() => {
          if (requiresTelegramLink.value) {
            openTelegramLink();
          }
        }, 500);
      }
      return;
    }

    // Success - move to step 2
    step.value = 2;
    
    // Start resend cooldown (60 seconds)
    startResendCooldown();

  } catch (error) {
    console.error("❌ OTP Error:", error);
    handleOtpError(error);
  } finally {
    loading.value = false;
  }
}

async function resetPassword() {
  // Validation
  if (otp.value.length !== 6) {
    resetErrorMessage.value = "OTP must be 6 digits";
    otpError.value = true;
    return;
  }
  
  if (newPassword.value.length < 6) {
    resetErrorMessage.value = "Password must be at least 6 characters";
    passwordError.value = true;
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    resetErrorMessage.value = "Passwords do not match";
    passwordError.value = true;
    return;
  }

  try {
    resetLoading.value = true;
    resetErrorMessage.value = "";
    otpError.value = false;
    passwordError.value = false;

    console.log("🔗 Reset password for:", fullPhoneNumber.value);

    // ✅ Reset password with EXACT field names
    const response = await http.post("/auth/reset-password", {
      phonenumber: fullPhoneNumber.value,
      otp: otp.value,
      newPassword: newPassword.value,
    });

    console.log("✅ Reset Response:", response.data);

    // Success
    successMessage.value = response.data?.message || "Password reset successful!";
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push("/login");
    }, 3000);

  } catch (error) {
    console.error("❌ Reset Error:", error);
    handleResetError(error);
  } finally {
    resetLoading.value = false;
  }
}

async function resendOtp() {
  if (resendCooldown.value > 0) return;
  
  try {
    loading.value = true;
    resetErrorMessage.value = "";

    const response = await http.post("/auth/forgot-password", {
      phonenumber: fullPhoneNumber.value,
    }, {
      timeout: 30000
    });

    if (response.data.success === false) {
      resetErrorMessage.value = response.data.message || "Failed to resend OTP";
      
      if (response.data.requiresTelegramLink) {
        requiresTelegramLink.value = true;
        openTelegramLink();
      }
      return;
    }

    // Restart cooldown
    startResendCooldown();
    
    // Show success message
    successMessage.value = "OTP resent successfully!";

  } catch (error) {
    console.error("❌ Resend Error:", error);
    resetErrorMessage.value = "Failed to resend OTP. Please try again.";
  } finally {
    loading.value = false;
  }
}

function startResendCooldown() {
  resendCooldown.value = 60;
  
  const interval = setInterval(() => {
    resendCooldown.value--;
    
    if (resendCooldown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function handleOtpError(error) {
  if (error.code === 'CORS_ERROR') {
    errorMessage.value = "Connection error. Please check if the server is running.";
  } else if (error.code === 'ECONNABORTED') {
    errorMessage.value = "Telegram OTP is taking longer than expected. Please wait and check your Telegram messages.";
  } else if (error.code === 'NETWORK_ERROR') {
    errorMessage.value = "Network error. Please check your internet connection.";
  } else if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 404:
        errorMessage.value = data?.message || "Phone number not found. Please check if this number is registered.";
        break;
      case 400:
        errorMessage.value = data?.message || "Invalid phone number format.";
        break;
      case 500:
        errorMessage.value = "Server error. Please try again in 30 seconds.";
        break;
      default:
        errorMessage.value = data?.message || `Error ${status}`;
    }
    
    if (data?.requiresTelegramLink) {
      requiresTelegramLink.value = true;
      // Auto-open Telegram link
      setTimeout(() => {
        if (requiresTelegramLink.value) {
          openTelegramLink();
        }
      }, 500);
    }
  } else {
    errorMessage.value = "Unable to connect to server.";
  }
  
  showError.value = true;
}

function handleResetError(error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        resetErrorMessage.value = data?.message || "Invalid OTP or password.";
        otpError.value = true;
        break;
      case 404:
        resetErrorMessage.value = "Session expired. Please request a new OTP.";
        step.value = 1;
        break;
      case 500:
        resetErrorMessage.value = "Server error. Please try again.";
        break;
      default:
        resetErrorMessage.value = data?.message || `Error ${status}`;
    }
  } else if (error.code === 'NETWORK_ERROR') {
    resetErrorMessage.value = "Network error. Please check your connection.";
  } else {
    resetErrorMessage.value = "Failed to reset password. Please try again.";
  }
}

function getStrengthClass(segment) {
  const strength = passwordStrength.value;
  if (segment <= strength) {
    switch (strength) {
      case 1: return 'strength-weak';
      case 2: return 'strength-fair';
      case 3: return 'strength-good';
      case 4: return 'strength-strong';
      default: return 'strength-weak';
    }
  }
  return 'strength-empty';
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
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.forgot-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 480px;
  width: 100%;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  color: #1e3a8a;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-align: center;
}

.subtitle {
  color: #4b5563;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.phone-input-container {
  display: flex;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.phone-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phone-input-container.error-border {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.country-code {
  background: #f8fafc;
  padding: 0.875rem 1rem;
  font-weight: 600;
  color: #374151;
  border-right: 2px solid #d1d5db;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.phone-input-container input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-family: 'Monaco', 'Courier New', monospace;
  letter-spacing: 1px;
  background: white;
}

/* Password input container with show/hide toggle */
.password-input-container {
  position: relative;
  display: flex;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.password-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input-container.error-border {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-input-container input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  outline: none;
  font-size: 1.1rem;
  background: white;
  padding-right: 50px; /* Space for toggle button */
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #6b7280;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

input {
  padding: 0.875rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input.error-border {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  padding-left: 0.25rem;
}

.hint.error-text {
  color: #ef4444;
  font-weight: 500;
}

.btn {
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  border: none;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(to right, #059669, #10b981);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(to right, #047857, #0d9668);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.disabled {
  background: #9ca3af !important;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.button-group .btn {
  flex: 1;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.btn-secondary .spinner {
  border: 2px solid rgba(55, 65, 81, 0.3);
  border-top-color: #374151;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-link {
  color: #3b82f6;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #1e3a8a;
  text-decoration: underline;
}

.phone-display {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.phone-display .label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.phone-display .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Monaco', 'Courier New', monospace;
}

.change-phone {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
}

.change-phone:hover {
  background: #3b82f6;
  color: white;
}

/* Password Strength Indicator */
.password-strength {
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.strength-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.strength-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 0.25rem;
}

.strength-segment {
  height: 6px;
  flex: 1;
  border-radius: 3px;
  background: #e5e7eb;
  transition: all 0.3s;
}

.strength-segment.strength-empty {
  background: #e5e7eb;
}

.strength-segment.strength-weak {
  background: #ef4444;
}

.strength-segment.strength-fair {
  background: #f59e0b;
}

.strength-segment.strength-good {
  background: #3b82f6;
}

.strength-segment.strength-strong {
  background: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  text-align: right;
  color: #6b7280;
}

/* Error and Success Messages */
.error-message, .success-message {
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #10b981;
}

.error-icon, .success-icon {
  font-size: 1.25rem;
}

.error-content, .success-content {
  flex: 1;
}

.error-content strong, .success-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

/* Telegram Link Styling */
.telegram-link-hint {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
}

.telegram-link-hint p {
  margin: 0 0 0.75rem 0;
  color: #0369a1;
  font-size: 0.9rem;
}

.telegram-link-btn {
  width: 100%;
  padding: 0.75rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.telegram-link-btn:hover {
  background: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

@media (max-width: 640px) {
  .forgot-page {
    padding: 1rem;
  }
  
  .forgot-card {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .phone-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .change-phone {
    align-self: flex-end;
  }
}
</style>