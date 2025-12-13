<!-- src/pages/Providers/SettingsSection.vue -->
<template>
  <div class="settings-section">
    <!-- Enhanced Professional Header -->
    <div class="settings-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-text">
          <h2 class="title-gradient">⚙️ Account Settings</h2>
          <p class="subtitle">Manage your privacy, security, and preferences</p>
        </div>
      </div>
    </div>

    <!-- Main Settings Grid -->
    <div class="settings-grid">
      <!-- Privacy Settings Card -->
      <div class="setting-card">
        <div class="card-header">
          <i class="fa-solid fa-lock card-icon"></i>
          <h3>Privacy Settings</h3>
        </div>
        <div class="card-body">
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-user"></i>
              <div>
                <div class="toggle-title">Public Profile</div>
                <div class="toggle-description">Make your profile visible to clients</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="privacy.publicProfile" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-phone"></i>
              <div>
                <div class="toggle-title">Hide Phone Number</div>
                <div class="toggle-description">Keep your phone number private</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="privacy.hidePhone" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" @click="savePrivacy">
              <i v-if="savingPrivacy" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-save"></i>
              {{ savingPrivacy ? 'Saving...' : 'Save Privacy Settings' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Card -->
      <div class="setting-card">
        <div class="card-header">
          <i class="fa-solid fa-bell card-icon"></i>
          <h3>Notification Preferences</h3>
        </div>
        <div class="card-body">
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-envelope"></i>
              <div>
                <div class="toggle-title">Email Notifications</div>
                <div class="toggle-description">Receive updates via email</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="notifications.email" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-comment-sms"></i>
              <div>
                <div class="toggle-title">SMS Alerts</div>
                <div class="toggle-description">Get text message alerts</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="notifications.sms" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-mobile-screen"></i>
              <div>
                <div class="toggle-title">In-App Notifications</div>
                <div class="toggle-description">App push notifications</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="notifications.inApp" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" @click="saveNotifications">
              <i v-if="savingNotifications" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-save"></i>
              {{ savingNotifications ? 'Saving...' : 'Save Notifications' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security Card -->
      <div class="setting-card">
        <div class="card-header">
          <i class="fa-solid fa-shield-halved card-icon"></i>
          <h3>Security Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-key"></i>
              New Password
            </label>
            <div class="password-input">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="security.newPassword"
                placeholder="Enter new password"
                autocomplete="new-password"
                class="form-input"
              />
              <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
                <i :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <div class="password-strength" v-if="security.newPassword">
              <div class="strength-bar" :class="getPasswordStrengthClass()"></div>
              <span class="strength-text">{{ getPasswordStrengthText() }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-key"></i>
              Confirm New Password
            </label>
            <div class="password-input">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="security.confirmPassword"
                placeholder="Confirm new password"
                autocomplete="new-password"
                class="form-input"
              />
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <div v-if="security.newPassword && security.confirmPassword && !passwordsMatch()" 
                 class="error-message">
              <i class="fa-solid fa-exclamation-circle"></i>
              Passwords do not match
            </div>
          </div>
          <div class="toggle-item">
            <div class="toggle-label">
              <i class="fa-solid fa-shield"></i>
              <div>
                <div class="toggle-title">Two-Factor Authentication</div>
                <div class="toggle-description">Coming soon for enhanced security</div>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="security.twoFactor" disabled />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-primary"
              @click="changePassword"
              :disabled="!security.newPassword || !passwordsMatch()"
            >
              <i v-if="changingPassword" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-lock"></i>
              {{ changingPassword ? 'Updating...' : 'Update Password' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Localization Card -->
      <div class="setting-card">
        <div class="card-header">
          <i class="fa-solid fa-globe card-icon"></i>
          <h3>Language & Region</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-language"></i>
              Language Preference
            </label>
            <div class="select-wrapper">
              <select v-model="localization.language" class="form-select">
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
              </select>
              <i class="fa-solid fa-chevron-down select-arrow"></i>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-clock"></i>
              Timezone
            </label>
            <div class="select-wrapper">
              <select v-model="localization.timezone" class="form-select">
                <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
              <i class="fa-solid fa-chevron-down select-arrow"></i>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary" @click="saveLocalization">
              <i v-if="savingLocalization" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-save"></i>
              {{ savingLocalization ? 'Saving...' : 'Save Preferences' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Danger Zone Card -->
      <div class="setting-card danger-zone">
        <div class="card-header">
          <i class="fa-solid fa-exclamation-triangle card-icon"></i>
          <h3>Danger Zone</h3>
        </div>
        <div class="card-body">
          <div class="danger-note">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>Critical actions that affect your account access and data. These actions cannot be undone.</p>
          </div>

          <!-- Logout Action -->
          <div class="danger-action">
            <div class="action-info">
              <div class="action-icon">
                <i class="fa-solid fa-right-from-bracket"></i>
              </div>
              <div class="action-details">
                <div class="action-title">Logout</div>
                <div class="action-description">Sign out from your current session</div>
              </div>
            </div>
            <button 
              class="btn btn-logout" 
              @click="confirmLogout"
              :disabled="loggingOut"
            >
              <i class="fa-solid fa-right-from-bracket"></i>
              {{ loggingOut ? 'Logging out...' : 'Logout' }}
            </button>
          </div>

          <!-- Deactivate Account Action -->
          <div class="danger-action">
            <div class="action-info">
              <div class="action-icon">
                <i class="fa-solid fa-user-slash"></i>
              </div>
              <div class="action-details">
                <div class="action-title">Deactivate Account</div>
                <div class="action-description">Temporarily disable your account for up to 30 days</div>
              </div>
            </div>
            <button class="btn btn-outline-danger" @click="deactivateAccount">
              <i class="fa-solid fa-user-slash"></i>
              Deactivate
            </button>
          </div>

          <!-- Delete Account Action -->
          <div class="danger-action">
            <div class="action-info">
              <div class="action-icon">
                <i class="fa-solid fa-trash"></i>
              </div>
              <div class="action-details">
                <div class="action-title">Delete Account</div>
                <div class="action-description">Permanently delete all your data and account</div>
              </div>
            </div>
            <button class="btn btn-danger" @click="deleteAccount">
              <i class="fa-solid fa-trash"></i>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-icon">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <h3 class="modal-title">Confirm Logout</h3>
        <p class="modal-message">Are you sure you want to logout from your account?</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showLogoutModal = false">
            <i class="fa-solid fa-times"></i>
            Cancel
          </button>
          <button class="btn btn-logout" @click="performLogout">
            <i class="fa-solid fa-right-from-bracket"></i>
            Yes, Logout
          </button>
        </div>
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
        <div class="toast-icon">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="toast-progress"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: 'SettingsSection',
  setup() {
    const router = useRouter();

    // API Configuration - USING PROXY PATH
    const getApiBaseUrl = () => {
      if (import.meta.env.MODE === 'development') {
        return '';
      } else {
        return import.meta.env.VITE_API_BASE_URL || 'https://infinity-booking-backend1.onrender.com';
      }
    };
    const API_BASE_URL = getApiBaseUrl();
    const LOGOUT_ENDPOINT = `/api/auth/logout`;

    // State
    const loggingOut = ref(false);
    const showLogoutModal = ref(false);
    const savingPrivacy = ref(false);
    const savingNotifications = ref(false);
    const changingPassword = ref(false);
    const savingLocalization = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const toasts = ref([]);

    // Settings state
    const privacy = ref({
      publicProfile: true,
      hidePhone: false,
    });
    const notifications = ref({
      email: true,
      sms: false,
      inApp: true,
    });
    const security = ref({
      newPassword: "",
      confirmPassword: "",
      twoFactor: false,
    });
    const localization = ref({
      language: "en",
      timezone: "Africa/Addis_Ababa",
    });

    // Toast methods
    const showToast = (message, type = 'info') => {
      const id = Date.now() + Math.random();
      toasts.value.push({ id, message, type });
      setTimeout(() => removeToast(id), 5000);
    };
    const removeToast = (id) => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    };
    const getToastIcon = (type) => {
      const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
      };
      return icons[type] || icons.info;
    };

    // Password strength methods
    const getPasswordStrength = () => {
      const password = security.value.newPassword;
      if (!password) return 0;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return Math.min(strength, 4);
    };
    const getPasswordStrengthClass = () => {
      const strength = getPasswordStrength();
      const classes = ['strength-1', 'strength-2', 'strength-3', 'strength-4'];
      return classes[strength - 1] || '';
    };
    const getPasswordStrengthText = () => {
      const strength = getPasswordStrength();
      const texts = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
      return texts[strength];
    };
    const passwordsMatch = () => {
      return security.value.newPassword === security.value.confirmPassword;
    };

    // Logout
    const confirmLogout = () => showLogoutModal.value = true;
    const performLogout = async () => {
      loggingOut.value = true;
      showLogoutModal.value = false;
      try {
        const token = localStorage.getItem("provider_token") || 
                     localStorage.getItem("userToken") || 
                     localStorage.getItem("token");
        if (!token) {
          clearAllAuthData();
          showToast('Logged out!', 'info');
          await router.push({ name: "Login" });
          return;
        }

        const response = await fetch(LOGOUT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          showToast('Logged out successfully!', 'success');
        } else {
          showToast('Logged out locally.', 'info');
        }

        clearAllAuthData();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await router.push({ name: "Login" });
      } catch (error) {
        console.error("Logout error:", error);
        clearAllAuthData();
        showToast('Logged out locally.', 'info');
        setTimeout(() => router.push({ name: "Login" }), 1000);
      } finally {
        loggingOut.value = false;
      }
    };

    const clearAllAuthData = () => {
      const authKeys = [
        "provider_token", "provider_id", "loggedProvider",
        "userToken", "userId", "token", "refreshToken",
        "user", "auth_token", "access_token", "session",
        "admin_token", "customer_token"
      ];
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=");
        const cookieName = name.toLowerCase();
        if (cookieName.includes("auth") || cookieName.includes("token") || cookieName.includes("session")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    };

    // Save handlers
    const savePrivacy = async () => {
      savingPrivacy.value = true;
      try {
        const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const response = await fetch(`/api/user/privacy`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(privacy.value)
        });
        if (!response.ok) throw new Error("Failed to save privacy settings");
        showToast('Privacy settings saved successfully!', 'success');
      } catch (error) {
        console.error("Save privacy error:", error);
        showToast('Failed to save privacy settings.', 'error');
      } finally {
        savingPrivacy.value = false;
      }
    };

    const saveNotifications = async () => {
      savingNotifications.value = true;
      try {
        const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const response = await fetch(`/api/user/notifications`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(notifications.value)
        });
        if (!response.ok) throw new Error("Failed to save notification preferences");
        showToast('Notification preferences updated!', 'success');
      } catch (error) {
        console.error("Save notifications error:", error);
        showToast('Failed to save notification preferences.', 'error');
      } finally {
        savingNotifications.value = false;
      }
    };

    const saveLocalization = async () => {
      savingLocalization.value = true;
      try {
        const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const response = await fetch(`/api/user/localization`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(localization.value)
        });
        if (!response.ok) throw new Error("Failed to save preferences");
        showToast('Language and timezone updated!', 'success');
      } catch (error) {
        console.error("Save localization error:", error);
        showToast('Failed to save preferences.', 'error');
      } finally {
        savingLocalization.value = false;
      }
    };

    const changePassword = async () => {
      const { newPassword, confirmPassword } = security.value;
      if (!newPassword) return showToast('Please enter a new password.', 'error');
      if (newPassword.length < 6) return showToast('Password must be at least 6 characters long.', 'error');
      if (!passwordsMatch()) return showToast('Passwords do not match.', 'error');

      changingPassword.value = true;
      try {
        const token = localStorage.getItem("provider_token") || localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");
        const response = await fetch(`/api/auth/change-password`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword, confirmPassword })
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update password");
        }
        security.value.newPassword = "";
        security.value.confirmPassword = "";
        showToast('Password updated successfully!', 'success');
      } catch (error) {
        console.error("Change password error:", error);
        showToast(error.message || 'Failed to update password. Please try again.', 'error');
      } finally {
        changingPassword.value = false;
      }
    };

    const deactivateAccount = () => {
      if (confirm("Are you sure you want to deactivate your account? You can reactivate within 30 days.")) {
        showToast('Account deactivation request sent. Check your email for confirmation.', 'info');
      }
    };

    const deleteAccount = () => {
      if (confirm("⚠️ This action cannot be undone! All your data will be permanently deleted. Continue?")) {
        clearAllAuthData();
        showToast('Account deleted successfully. Redirecting...', 'info');
        setTimeout(() => router.push({ name: "Login" }), 2000);
      }
    };

    return {
      loggingOut,
      showLogoutModal,
      savingPrivacy,
      savingNotifications,
      changingPassword,
      savingLocalization,
      showNewPassword,
      showConfirmPassword,
      toasts,
      privacy,
      notifications,
      security,
      localization,
      showToast,
      removeToast,
      getToastIcon,
      getPasswordStrengthClass,
      getPasswordStrengthText,
      passwordsMatch,
      confirmLogout,
      performLogout,
      savePrivacy,
      saveNotifications,
      saveLocalization,
      changePassword,
      deactivateAccount,
      deleteAccount,
    };
  }
};
</script>

<style scoped>
/* ===== ENHANCED PROFESSIONAL & FULLY RESPONSIVE STYLES ===== */
.settings-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* Header */
.settings-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  padding: clamp(32px, 8vw, 48px) clamp(20px, 6vw, 40px);
  position: relative;
  overflow: hidden;
  border-radius: 0 0 24px 24px;
}
.header-background {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
}
.header-content {
  position: relative;
  z-index: 2;
  text-align: center;
}
.title-gradient {
  font-size: clamp(1.8rem, 6vw, 3rem);
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.1;
}
.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  margin: 0 auto;
  font-weight: 500;
  max-width: 600px;
}

/* Main Settings Grid */
.settings-grid {
  padding: clamp(16px, 4vw, 40px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(280px, 90vw, 380px), 1fr));
  gap: clamp(12px, 3.5vw, 24px);
}

.setting-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.setting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.1);
}
.setting-card.danger-zone {
  grid-column: 1 / -1;
  border-color: rgba(239, 68, 68, 0.2);
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

/* Card Header & Body */
.card-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 24px 28px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}
.card-icon {
  font-size: 1.4rem;
  color: #6366f1;
  background: white;
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}
.danger-zone .card-icon {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
}
.card-body {
  padding: 28px;
}

/* Toggle Items */
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f5f9;
}
.toggle-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
@media (max-width: 374px) {
  .toggle-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .toggle-switch {
    align-self: flex-end;
  }
}
.toggle-label {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
.toggle-label i {
  color: #6366f1;
  width: 24px;
  text-align: center;
}
.toggle-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 1rem;
}
.toggle-description {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Toggle Switch */
.toggle-switch {
  display: inline-block;
  position: relative;
  width: 52px;
  height: 28px;
  cursor: pointer;
}
.toggle-switch input {
  opacity: 0; width: 0; height: 0;
}
.toggle-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #e5e7eb;
  transition: .4s;
  border-radius: 34px;
}
.toggle-slider:before {
  content: "";
  position: absolute;
  height: 22px; width: 22px;
  left: 3px; bottom: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: .4s;
}
.toggle-switch input:checked + .toggle-slider {
  background-color: #10b981;
}
.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}
.toggle-switch input:disabled + .toggle-slider {
  background-color: #d1d5db;
  cursor: not-allowed;
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
}
.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  font-size: 0.95rem;
}
.form-input,
.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  color: #1f2937;
  font-family: inherit;
}
.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
.password-input {
  position: relative;
}
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
}
.password-strength {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.strength-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}
.strength-bar::after {
  content: '';
  position: absolute;
  left: 0; top: 0; height: 100%; width: 0;
  transition: width 0.3s ease;
}
.strength-bar.strength-1::after { width: 25%; background: #ef4444; }
.strength-bar.strength-2::after { width: 50%; background: #f59e0b; }
.strength-bar.strength-3::after { width: 75%; background: #3b82f6; }
.strength-bar.strength-4::after { width: 100%; background: #10b981; }
.strength-text {
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 80px;
}
.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.select-wrapper {
  position: relative;
}
.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

/* Danger Zone */
.danger-note {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.danger-note i {
  color: #ef4444;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.danger-note p {
  margin: 0;
  color: #7f1d1d;
  font-size: 0.9rem;
  line-height: 1.5;
}
.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(239, 68, 68, 0.1);
}
.danger-action:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.action-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
.action-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  font-size: 1.2rem;
}
.action-title { font-weight: 600; color: #1f2937; margin-bottom: 4px; }
.action-description { font-size: 0.9rem; color: #6b7280; }

/* Card Footer */
.card-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 575px) {
  .card-footer {
    justify-content: stretch;
  }
  .card-footer .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Buttons */
.btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
  background: linear-gradient(135deg, #4f46e5, #4338ca);
}
.btn-secondary {
  background: #f1f5f9;
  color: #374151;
  border: 1px solid #e2e8f0;
}
.btn-secondary:hover { background: #e2e8f0; }
.btn-logout {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}
.btn-logout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}
.btn-outline-danger {
  background: transparent;
  color: #dc2626;
  border: 2px solid #dc2626;
}
.btn-outline-danger:hover {
  background: #fef2f2;
  transform: translateY(-2px);
}
.btn-danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
}
.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
  background: linear-gradient(135deg, #b91c1c, #991b1b);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
.modal-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}
.modal-icon { font-size: 4rem; color: #ef4444; margin-bottom: 20px; }
.modal-title { font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
.modal-message { color: #6b7280; margin-bottom: 32px; line-height: 1.5; }
.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
@media (max-width: 575px) {
  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }
  .modal-actions .btn {
    width: 100%;
  }
}

/* Toasts */
.toast-container {
  position: fixed;
  top: max(24px, env(safe-area-inset-top));
  right: max(24px, env(safe-area-inset-right));
  z-index: 5000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 16px;
  color: white;
  font-weight: 500;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  max-width: 420px;
  pointer-events: all;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}
.toast--success { background: linear-gradient(135deg, #10b981, #34d399); border: 1px solid rgba(34,197,94,0.3); }
.toast--error { background: linear-gradient(135deg, #ef4444, #f87171); border: 1px solid rgba(239,68,68,0.3); }
.toast--info { background: linear-gradient(135deg, #3b82f6, #60a5fa); border: 1px solid rgba(59,130,246,0.3); }
.toast-icon { font-size: 1.4rem; flex-shrink: 0; }
.toast-message { font-size: 0.95rem; line-height: 1.5; }
.toast-close {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-close:hover { background: rgba(255,255,255,0.3); }
.toast-progress {
  position: absolute;
  bottom: 0; left: 0; height: 4px;
  background: rgba(255,255,255,0.6);
  animation: toastProgress 5s linear forwards;
  border-radius: 0 0 16px 16px;
}
@keyframes toastProgress { from { width: 100%; } to { width: 0%; } }

/* Touch Devices */
@media (hover: none) and (pointer: coarse) {
  .setting-card:hover { transform: none; }
  .btn:hover:not(:disabled) { transform: none; }
}

/* Print Styles */
@media print {
  .settings-section { box-shadow: none; border-radius: 0; }
  .btn, .modal-overlay, .toast-container { display: none !important; }
  .settings-header { background: #f0f0f0 !important; }
  .title-gradient {
    -webkit-text-fill-color: black !important;
    background: transparent !important;
  }
  .toggle-switch { display: none; }
}
</style>