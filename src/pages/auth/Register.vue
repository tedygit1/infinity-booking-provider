<!-- src/pages/Auth/Register.vue - Telegram OTP Version (KEEPS ORIGINAL WORKING CODE) -->
<template>
  <div class="auth-page">
    <!-- Visual Section -->
    <div class="auth-visual">
      <div class="visual-overlay"></div>
      <div class="visual-content">
        <div class="visual-logo">
          <span class="logo-icon">∞</span>
          <span class="logo-text">Infinity-Booking</span>
        </div>
        <h2 class="visual-title">{{ step === 1 ? 'Start Your Journey' : 'Verify Your Phone' }}</h2>
        <p class="visual-subtitle">
          {{ step === 1 
            ? 'Join our platform and grow your service business' 
            : 'Enter the 6-digit code sent to your Telegram'
          }}
        </p>
        
        <!-- Step Indicators -->
        <div class="step-indicators">
          <div class="step" :class="{ 'active': step >= 1, 'completed': step > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">Details</div>
          </div>
          <div class="step-line" :class="{ 'active': step >= 2 }"></div>
          <div class="step" :class="{ 'active': step >= 2 }">
            <div class="step-number">2</div>
            <div class="step-label">Verify</div>
          </div>
        </div>
        
        <div class="feature-list" v-if="step === 1">
          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <span>Reach new customers</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💼</span>
            <span>Manage your bookings</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📈</span>
            <span>Grow your business</span>
          </div>
        </div>
        
        <div class="otp-info" v-if="step === 2 && otpSent">
          <div class="phone-display">
            <span class="phone-icon">📱</span>
            <span class="phone-number">{{ formattedPhoneNumber }}</span>
          </div>
          <p class="otp-timer" v-if="otpCountdown > 0">
            Resend OTP in {{ otpCountdown }}s
          </p>
          <button 
            v-else 
            @click="resendOTP" 
            class="resend-btn"
            :disabled="resendLoading"
          >
            {{ resendLoading ? 'Sending...' : 'Resend OTP' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Registration Form -->
    <div class="auth-form-section">
      <div class="auth-form-container">
        <div class="form-header">
          <h1 class="form-title">
            {{ step === 1 ? 'Create Account' : 'Verify Phone' }}
          </h1>
          <p class="form-subtitle">
            {{ step === 1 
              ? 'Join as a service provider' 
              : 'Enter the verification code'
            }}
          </p>
        </div>

        <!-- STEP 1: Registration Form (EXACTLY AS BEFORE) -->
        <form 
          v-if="step === 1" 
          class="auth-form" 
          @submit.prevent="sendOTP"
        >
          <!-- Personal Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="fullname" class="form-label">Full Name *</label>
              <input
                id="fullname"
                v-model="signup.fullname"
                type="text"
                placeholder="Enter your full name"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.fullname }"
                @blur="validateField('fullname')"
              />
              <div v-if="fieldErrors.fullname" class="field-error">{{ fieldErrors.fullname }}</div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
              <input
                id="email"
                v-model="signup.email"
                type="email"
                placeholder="Enter your email"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.email }"
                @blur="validateField('email')"
              />
              <div v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="phonenumber" class="form-label">Phone Number *</label>
              <input
                id="phonenumber"
                v-model="signup.phonenumber"
                type="tel"
                placeholder="+251 XXX XXX XXX"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.phonenumber }"
                @blur="validateField('phonenumber')"
              />
              <div v-if="fieldErrors.phonenumber" class="field-error">{{ fieldErrors.phonenumber }}</div>
            </div>

            <div class="form-group">
              <label for="location" class="form-label">Location *</label>
              <input
                id="location"
                v-model="signup.location"
                type="text"
                placeholder="Your city or area"
                required
                class="form-input"
                :class="{ 'error': fieldErrors.location }"
                @blur="validateField('location')"
              />
              <div v-if="fieldErrors.location" class="field-error">{{ fieldErrors.location }}</div>
            </div>
          </div>

          <!-- Optional Fields -->
          <div class="form-row">
            <div class="form-group">
              <label for="fin" class="form-label">FIN Number</label>
              <input
                id="fin"
                v-model="signup.FIN"
                type="text"
                placeholder="Optional"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="service-category" class="form-label">Service Category *</label>
              <div class="select-wrapper">
                <select
                  id="service-category"
                  v-model="signup.serviceCategoryId"
                  required
                  class="form-select"
                  :class="{ 'error': fieldErrors.serviceCategoryId }"
                  @change="validateField('serviceCategoryId')"
                  @focus="loadCategoriesIfNeeded"
                >
                  <option value="">Select your service</option>
                  <option 
                    v-for="category in categories" 
                    :key="category._id" 
                    :value="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div v-if="fieldErrors.serviceCategoryId" class="field-error">{{ fieldErrors.serviceCategoryId }}</div>
            </div>
          </div>

          <!-- Experience -->
          <div class="form-group">
            <label for="experience" class="form-label">Work Experience</label>
            <textarea
              id="experience"
              v-model="signup.workExperience"
              placeholder="Tell us about your professional experience..."
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>

          <!-- Certificate Upload -->
          <div class="form-group">
            <label class="form-label">Certificate</label>
            <div class="file-upload-area" @click="triggerFileInput">
              <input 
                ref="fileInput"
                type="file" 
                @change="handleCertificateUpload" 
                accept=".pdf,.jpg,.png,.jpeg"
                class="file-input"
              />
              <div class="upload-content">
                <span class="upload-icon">📎</span>
                <div class="upload-text">
                  <div class="upload-title">
                    {{ signup.certificate ? signup.certificate.name : 'Upload certificate (PDF, JPG, PNG)' }}
                  </div>
                  <div class="upload-subtitle">Max file size: 5MB</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Fields -->
          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">Password *</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="signup.password"
                  placeholder="Create a password"
                  required
                  class="form-input"
                  :class="{ 'error': fieldErrors.password }"
                  @blur="validateField('password')"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="toggle-icon">{{ showPassword ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              <div v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password *</label>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="signup.confirmPassword"
                  placeholder="Confirm your password"
                  required
                  class="form-input"
                  :class="{ 'error': fieldErrors.confirmPassword }"
                  @blur="validateField('confirmPassword')"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="toggleConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="toggle-icon">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              <div v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</div>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="signup.accept" 
                required
                class="checkbox-input"
              />
              <span class="checkbox-text">
                I agree to the 
                <a href="#" class="link">Terms & Conditions</a> 
                and 
                <a href="#" class="link">Privacy Policy</a>
              </span>
            </label>
            <div v-if="fieldErrors.accept" class="field-error">{{ fieldErrors.accept }}</div>
          </div>

          <!-- Send OTP Button (was Create Account) -->
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="otpLoading"
            :class="{ 'loading': otpLoading }"
          >
            <span v-if="otpLoading" class="btn-spinner"></span>
            <span>{{ otpLoading ? 'Processing...' : 'Continue to Verification' }}</span>
          </button>

          <!-- Error Message -->
          <div v-if="errorMessage" class="message error-message" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Login Link -->
          <div class="auth-switch">
            <p>Already have an account? 
              <router-link to="/login" class="switch-link">Sign in</router-link>
            </p>
          </div>
        </form>

        <!-- STEP 2: OTP Verification (NEW) -->
        <form 
          v-else 
          class="auth-form" 
          @submit.prevent="verifyOTPAndRegister"
        >
          <div class="otp-verification">
            <div class="otp-instruction">
              <p>Enter the 6-digit verification code sent to your Telegram account.</p>
              <p class="phone-display-text">Phone: <strong>{{ formattedPhoneNumber }}</strong></p>
            </div>
            
            <div class="otp-input-container">
              <div 
                v-for="index in 6" 
                :key="index" 
                class="otp-digit"
                :class="{ 'filled': otpDigits[index-1] }"
                @click="focusOTPInput"
              >
                {{ otpDigits[index-1] || '' }}
              </div>
              <input
                ref="otpInput"
                v-model="otpValue"
                type="text"
                maxlength="6"
                pattern="[0-9]*"
                inputmode="numeric"
                class="otp-hidden-input"
                @input="handleOTPInput"
                @paste="handleOTPPaste"
                autocomplete="off"
              />
            </div>

            <div class="otp-actions">
              <button
                type="button"
                @click="step = 1"
                class="back-btn"
              >
                ← Change phone number
              </button>
              
              <button
                type="button"
                @click="resendOTP"
                class="resend-btn"
                :disabled="otpCountdown > 0 || resendLoading"
              >
                {{ resendLoading ? 'Sending...' : 'Resend Code' }}
              </button>
            </div>
          </div>

          <!-- Telegram Help Section -->
          <div class="telegram-help" v-if="!otpSent">
            <p class="telegram-help-text">
              <strong>Not receiving code?</strong> Make sure you've linked your phone with Telegram bot.
            </p>
            <button 
              type="button" 
              @click="openTelegramBotNow" 
              class="telegram-help-btn"
            >
              <span class="telegram-icon">🤖</span>
              Open Telegram Bot
            </button>
          </div>

          <!-- Verify & Register Button -->
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="verificationLoading || otpDigits.length !== 6"
            :class="{ 'loading': verificationLoading }"
          >
            <span v-if="verificationLoading" class="btn-spinner"></span>
            <span>{{ verificationLoading ? 'Verifying...' : 'Verify & Complete Registration' }}</span>
          </button>

          <!-- Error Message -->
          <div v-if="errorMessage" class="message error-message" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="message success-message">
            {{ successMessage }}
          </div>

          <!-- Back to step 1 -->
          <div class="auth-switch">
            <p>
              <button @click="step = 1" class="switch-link" type="button">
                ← Back to registration details
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Telegram Modal -->
    <div v-if="showTelegramModal" class="telegram-modal-overlay">
      <div class="telegram-modal">
        <div class="telegram-modal-header">
          <span class="telegram-modal-icon">🤖</span>
          <h3>Link Your Phone with Telegram Bot</h3>
          <button @click="closeTelegramModal" class="telegram-modal-close">&times;</button>
        </div>
        
        <div class="telegram-modal-content">
          <p>To receive verification codes, you need to link your phone number with our Telegram bot.</p>
          
          <div class="telegram-steps">
            <div class="telegram-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Open Telegram</h4>
                <p>Make sure Telegram is installed on your phone</p>
              </div>
            </div>
            
            <div class="telegram-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Click the button below</h4>
                <p>It will open our Telegram bot automatically</p>
              </div>
            </div>
            
            <div class="telegram-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Start the bot</h4>
                <p>Click "Start" in the Telegram chat</p>
              </div>
            </div>
            
            <div class="telegram-step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Register your phone</h4>
                <p>Follow the bot instructions to register: <strong>{{ formattedPhoneNumber }}</strong></p>
              </div>
            </div>
          </div>
          
          <div class="telegram-modal-actions">
            <button @click="openTelegramBotDirect" class="telegram-open-btn">
              <span class="tg-icon">📱</span>
              Open Telegram Bot Now
            </button>
            
            <button @click="copyTelegramLink" class="telegram-copy-btn">
              <span class="copy-icon">📋</span>
              Copy Bot Link
            </button>
          </div>
          
          <div class="telegram-modal-note">
            <p><strong>Note:</strong> After linking your phone, come back here and click "Continue Registration"</p>
          </div>
        </div>
        
        <div class="telegram-modal-footer">
          <button @click="closeTelegramModalAndContinue" class="telegram-continue-btn">
            I've Linked My Phone - Continue Registration
          </button>
          <button @click="closeTelegramModal" class="telegram-cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/index.js";

const router = useRouter();

// Step management (1 = form, 2 = OTP verification)
const step = ref(1);

// OTP State
const otpValue = ref('');
const otpDigits = ref(Array(6).fill(''));
const otpInput = ref(null);
const otpSent = ref(false);
const otpCountdown = ref(0);

// Telegram bot state
const showTelegramModal = ref(false);
const telegramBotUsername = "@InfinityBookingBot";
const telegramBotLink = `https://t.me/${telegramBotUsername.replace('@', '')}`;

// Loading states
const otpLoading = ref(false);
const verificationLoading = ref(false);
const resendLoading = ref(false);

// Reactive data - EXACTLY AS BEFORE
const signup = ref({
  fullname: '',
  email: '',
  phonenumber: '',
  location: '',
  FIN: '',
  serviceCategoryId: '', // EXACTLY AS BEFORE
  workExperience: '',
  certificate: null,
  password: '',
  confirmPassword: '',
  accept: false,
});

const categories = ref([]);
const categoriesLoaded = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const fieldErrors = ref({
  fullname: '',
  email: '',
  phonenumber: '',
  location: '',
  serviceCategoryId: '', // EXACTLY AS BEFORE
  password: '',
  confirmPassword: '',
  accept: '',
});

// File input ref
const fileInput = ref(null);

// ========== VALIDATION FUNCTIONS - EXACTLY AS BEFORE ==========
const validateField = (field) => {
  const value = signup.value[field];
  
  switch (field) {
    case 'fullname':
      fieldErrors.value.fullname = value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      break;
    case 'email':
      const emailRegex = /^\S+@\S+\.\S+$/;
      fieldErrors.value.email = !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      break;
    case 'phonenumber':
      fieldErrors.value.phonenumber = value.trim().length < 10 ? 'Please enter a valid phone number' : '';
      break;
    case 'location':
      fieldErrors.value.location = value.trim().length < 2 ? 'Please enter your location' : '';
      break;
    case 'serviceCategoryId':
      fieldErrors.value.serviceCategoryId = !value ? 'Please select a service category' : '';
      break;
    case 'password':
      fieldErrors.value.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
      break;
    case 'confirmPassword':
      fieldErrors.value.confirmPassword = value !== signup.value.password ? 'Passwords do not match' : '';
      break;
    case 'accept':
      fieldErrors.value.accept = !value ? 'Please accept the terms and conditions' : '';
      break;
  }
};

const validateForm = () => {
  Object.keys(fieldErrors.value).forEach(field => {
    if (field !== 'FIN' && field !== 'workExperience' && field !== 'certificate') {
      validateField(field);
    }
  });
  
  return !Object.values(fieldErrors.value).some(error => error !== '');
};

// ========== FILE HANDLING - EXACTLY AS BEFORE ==========
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleCertificateUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 5MB';
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = 'Please upload PDF, JPG, or PNG files only';
      return;
    }
    
    signup.value.certificate = file;
    errorMessage.value = '';
  }
};

// ========== HELPER FUNCTIONS - EXACTLY AS BEFORE ==========
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// ========== FORMAT PHONE NUMBER ==========
const formattedPhoneNumber = computed(() => {
  const phone = signup.value.phonenumber;
  if (!phone) return '';
  
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // Format as Ethiopian number
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '+251' + digits.slice(1);
  } else if (digits.length === 9) {
    digits = '+251' + digits;
  } else if (digits.startsWith('251') && digits.length === 12) {
    digits = '+' + digits;
  } else if (digits.startsWith('+251') && digits.length === 13) {
    // Already formatted
  }
  
  return digits;
});

// ========== CATEGORIES LOADING - EXACTLY AS BEFORE ==========
const loadCategoriesIfNeeded = () => {
  if (!categoriesLoaded.value && categories.value.length === 0) {
    http.get("/categories")
      .then(response => {
        categories.value = Array.isArray(response.data) ? response.data : [];
        categoriesLoaded.value = true;
      })
      .catch(error => {
        console.error('Failed to load categories:', error);
        // Provide fallback options silently
        categories.value = [
          { _id: '1', name: 'Beauty & Salon' },
          { _id: '2', name: 'Home Services' },
          { _id: '3', name: 'Education & Tutoring' },
          { _id: '4', name: 'Health & Wellness' },
          { _id: '5', name: 'Business Services' }
        ];
        categoriesLoaded.value = true;
      });
  }
};

// ========== OTP FUNCTIONS ==========
const focusOTPInput = () => {
  otpInput.value?.focus();
};

const handleOTPInput = () => {
  otpValue.value = otpValue.value.replace(/\D/g, '');
  otpDigits.value = otpValue.value.split('').slice(0, 6);
  
  while (otpDigits.value.length < 6) {
    otpDigits.value.push('');
  }
  
  if (otpDigits.value.length === 6 && otpDigits.value.every(d => d !== '')) {
    setTimeout(() => {
      verifyOTPAndRegister();
    }, 300);
  }
};

const handleOTPPaste = (event) => {
  const paste = event.clipboardData.getData('text');
  const numbers = paste.replace(/\D/g, '');
  
  if (numbers.length === 6) {
    otpValue.value = numbers;
    handleOTPInput();
    event.preventDefault();
    
    setTimeout(() => {
      verifyOTPAndRegister();
    }, 300);
  }
};

// ========== TELEGRAM FUNCTIONS ==========
const openTelegramBotDirect = () => {
  window.open(telegramBotLink, '_blank');
};

const openTelegramBotNow = () => {
  showTelegramModal.value = true;
};

const closeTelegramModal = () => {
  showTelegramModal.value = false;
};

const closeTelegramModalAndContinue = () => {
  showTelegramModal.value = false;
  sendOTP();
};

const copyTelegramLink = () => {
  navigator.clipboard.writeText(telegramBotLink)
    .then(() => {
      successMessage.value = 'Telegram bot link copied to clipboard!';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    })
    .catch(err => {
      console.error('Failed to copy link:', err);
      errorMessage.value = 'Failed to copy link';
    });
};

// ========== SEND OTP (STEP 1) ==========
const sendOTP = async () => {
  if (!validateForm()) {
    errorMessage.value = 'Please fix the errors above';
    return;
  }

  otpLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await http.post("/auth/register/request-otp", {
      phonenumber: formattedPhoneNumber.value
    });

    console.log('OTP Response:', response.data);

    if (response.data.success) {
      otpSent.value = true;
      step.value = 2;
      
      // Start countdown
      otpCountdown.value = 60;
      const timer = setInterval(() => {
        otpCountdown.value--;
        if (otpCountdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      
      // Focus OTP input
      nextTick(() => {
        setTimeout(() => {
          focusOTPInput();
        }, 100);
      });
      
      successMessage.value = 'OTP sent! Check your Telegram.';
      
    } else if (response.data.requiresTelegramLink) {
      showTelegramModal.value = true;
      errorMessage.value = response.data.message;
      
    } else {
      errorMessage.value = response.data.message || 'Failed to send OTP';
    }
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    
    if (error.response?.data?.message) {
      errorMessage.value = Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ')
        : error.response.data.message;
      
      if (error.response.data.requiresTelegramLink) {
        showTelegramModal.value = true;
      }
    } else {
      errorMessage.value = 'Failed to send OTP. Please try again.';
    }
  } finally {
    otpLoading.value = false;
  }
};

// ========== RESEND OTP ==========
const resendOTP = async () => {
  if (otpCountdown.value > 0) {
    errorMessage.value = `Please wait ${otpCountdown.value} seconds before resending`;
    return;
  }

  resendLoading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await http.post("/auth/register/request-otp", {
      phonenumber: formattedPhoneNumber.value
    });

    if (response.data.success) {
      successMessage.value = 'OTP resent!';
      
      otpCountdown.value = 60;
      const timer = setInterval(() => {
        otpCountdown.value--;
        if (otpCountdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      
    } else {
      errorMessage.value = response.data.message || 'Failed to resend OTP';
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    errorMessage.value = 'Failed to resend OTP. Please try again.';
  } finally {
    resendLoading.value = false;
  }
};

// ========== VERIFY OTP & REGISTER (STEP 2) ==========
const verifyOTPAndRegister = async () => {
  if (otpDigits.value.length !== 6 || otpDigits.value.some(d => !d)) {
    errorMessage.value = 'Please enter a valid 6-digit OTP';
    return;
  }

  verificationLoading.value = true;
  errorMessage.value = '';

  try {
    const otp = otpDigits.value.join('');
    
    const formData = new FormData();
    
    // ✅ REQUIRED FIELDS - EXACTLY AS BEFORE
    formData.append('fullname', signup.value.fullname.trim());
    formData.append('email', signup.value.email.trim());
    formData.append('phonenumber', formattedPhoneNumber.value);
    formData.append('otp', otp);
    formData.append('location', signup.value.location.trim());
    
    // ✅ OPTIONAL FIELDS - EXACTLY AS BEFORE
    if (signup.value.FIN) formData.append('FIN', signup.value.FIN.trim());
    
    // ✅ SERVICE CATEGORY - EXACTLY AS BEFORE
    if (signup.value.serviceCategoryId) {
      const selectedCategory = categories.value.find(cat => cat._id === signup.value.serviceCategoryId);
      if (selectedCategory) {
        // EXACTLY AS BEFORE - sending category name
        formData.append('serviceCategories', selectedCategory.name);
      }
    }
    
    if (signup.value.workExperience) formData.append('workExperience', signup.value.workExperience.trim());
    if (signup.value.certificate) formData.append('certificate', signup.value.certificate);
    formData.append('password', signup.value.password);
    formData.append('confirmPassword', signup.value.confirmPassword);

    console.log('Sending registration with OTP...');
    
    const response = await http.post(
      "/auth/register/provider/verify-otp",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log('✅ Registration Response:', response.data);

    if (response.data.success || response.data.token) {
      successMessage.value = "🎉 Registration successful! Your account is now under review. You'll receive an email notification once approved.";
      
      if (response.data.token) {
        localStorage.setItem('provider_token', response.data.token);
      }
      
      // Clear the form
      setTimeout(() => {
        signup.value = {
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
        };
        
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }, 1000);

      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 4000);

    } else {
      errorMessage.value = response.data.message || 'Registration completed';
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.response?.data?.message) {
      const errorMsg = Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ')
        : error.response.data.message;
      
      errorMessage.value = errorMsg;
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } finally {
    verificationLoading.value = false;
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.auth-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ===== VISUAL SECTION ===== */
.auth-visual {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
}

.visual-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.visual-content {
  position: relative;
  z-index: 2;
  max-width: 440px;
  text-align: center;
}

.visual-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.logo-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.visual-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.visual-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* Step Indicators */
.step-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.step-line {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.step-line.active {
  background: rgba(255, 255, 255, 0.9);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* OTP Info */
.otp-info {
  margin-top: 24px;
}

.phone-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.phone-icon {
  font-size: 1.2rem;
}

.phone-number {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.otp-timer {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 8px;
}

.resend-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resend-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== FORM SECTION ===== */
.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8fafc;
  overflow-y: auto;
}

.auth-form-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

/* ===== FORM STYLES ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

/* ===== OTP VERIFICATION ===== */
.otp-verification {
  text-align: center;
}

.otp-instruction {
  margin-bottom: 24px;
}

.otp-instruction p {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 8px;
}

.phone-display-text {
  font-size: 0.9rem;
  color: #374151;
  margin-top: 12px;
}

.otp-input-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
}

.otp-digit {
  width: 50px;
  height: 60px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  background: #ffffff;
  transition: all 0.2s ease;
  cursor: text;
}

.otp-digit.filled {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-digit:hover {
  border-color: #9ca3af;
}

.otp-hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px 0;
}

.back-btn:hover {
  color: #374151;
}

/* ===== TELEGRAM HELP ===== */
.telegram-help {
  background: #fefce8;
  border: 1px solid #fde047;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.telegram-help-text {
  font-size: 0.85rem;
  color: #854d0e;
  margin-bottom: 12px;
}

.telegram-help-btn {
  background: #0088cc;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.telegram-help-btn:hover {
  background: #0077b3;
}

.telegram-icon {
  font-size: 1.1rem;
}

/* ===== FILE UPLOAD ===== */
.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #f0f9ff;
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 1.5rem;
}

.upload-text {
  flex: 1;
}

.upload-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.upload-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
}

/* ===== PASSWORD FIELDS ===== */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  font-size: 1.1rem;
}

/* ===== CHECKBOX ===== */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.4;
}

.checkbox-input {
  margin-top: 2px;
  accent-color: #667eea;
}

.checkbox-text {
  flex: 1;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* ===== BUTTON STYLES ===== */
.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  cursor: wait;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ===== MESSAGE STYLES ===== */
.message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.4;
  text-align: center;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.success-message {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 4px;
}

/* ===== AUTH SWITCH ===== */
.auth-switch {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.auth-switch p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.switch-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.switch-link:hover {
  text-decoration: underline;
}

/* ===== TELEGRAM MODAL ===== */
.telegram-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.telegram-modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.telegram-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.telegram-modal-icon {
  font-size: 2rem;
}

.telegram-modal-header h3 {
  margin: 0;
  flex: 1;
  font-size: 1.3rem;
}

.telegram-modal-close {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
}

.telegram-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.telegram-modal-content {
  padding: 24px;
}

.telegram-steps {
  margin: 24px 0;
}

.telegram-step {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.telegram-step .step-number {
  background: #667eea;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.telegram-step .step-content h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 1rem;
}

.telegram-step .step-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.telegram-modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.telegram-open-btn {
  background: #0088cc;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.telegram-open-btn:hover {
  background: #0077b3;
}

.telegram-copy-btn {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.telegram-copy-btn:hover {
  background: #e0f2fe;
}

.tg-icon, .copy-icon {
  font-size: 1.2rem;
}

.telegram-modal-note {
  background: #fefce8;
  border: 1px solid #fde047;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
}

.telegram-modal-note p {
  margin: 0;
  color: #854d0e;
  font-size: 0.9rem;
}

.telegram-modal-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.telegram-continue-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.telegram-continue-btn:hover {
  background: #0da271;
}

.telegram-cancel-btn {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.telegram-cancel-btn:hover {
  background: #f9fafb;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .otp-input-container {
    gap: 8px;
  }
  
  .otp-digit {
    width: 45px;
    height: 55px;
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  
  .auth-visual {
    padding: 32px 24px;
    min-height: 300px;
  }
  
  .visual-content {
    max-width: 100%;
  }
  
  .visual-title {
    font-size: 1.75rem;
  }
  
  .auth-form-section {
    padding: 32px 24px;
  }
  
  .auth-form-container {
    padding: 32px 24px;
  }
  
  .otp-digit {
    width: 40px;
    height: 50px;
  }
  
  .telegram-modal {
    max-height: 80vh;
  }
}

@media (max-width: 480px) {
  .auth-visual {
    padding: 24px 20px;
    min-height: 280px;
  }
  
  .visual-title {
    font-size: 1.5rem;
  }
  
  .auth-form-section {
    padding: 24px 20px;
  }
  
  .auth-form-container {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .otp-input-container {
    gap: 6px;
  }
  
  .otp-digit {
    width: 35px;
    height: 45px;
    font-size: 1.2rem;
  }
  
  .otp-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .telegram-modal-header {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .telegram-modal-header h3 {
    font-size: 1.1rem;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>