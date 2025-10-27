<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <h1 class="title">Infinity-Booking</h1>

      <!-- Tab Buttons -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          :class="{ active: activeTab === 'signup' }"
          @click="activeTab = 'signup'"
        >
          Sign Up
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="activeTab === 'login'" class="form" @submit.prevent="handleLogin">
        <input v-model="login.email" type="email" placeholder="Email" required />
        <input v-model="login.password" type="password" placeholder="Password" required />
        <button type="submit" class="btn">Login</button>
        <p class="switch-text">
          Don’t have an account?
          <span @click="activeTab = 'signup'">Sign Up</span>
        </p>
      </form>

      <!-- Sign Up Form -->
      <form v-else class="form" @submit.prevent="handleSignup" enctype="multipart/form-data">
        <input v-model="signup.fullName" type="text" placeholder="Full Name" required />
        <input v-model="signup.email" type="email" placeholder="Email" required />
        <input v-model="signup.phone" type="tel" placeholder="Phone Number" required />
        <select v-model="signup.category" required>
          <option value="" disabled>Select Service Category</option>
          <option>home services</option>
          <option>beauty and salon</option>
          <option>education and tutoring</option>
          <option>Other</option>
        </select>
        <textarea
          v-model="signup.experience"
          placeholder="Your experience (e.g. 3)"
          rows="2"
          required
        ></textarea>
        <textarea
          v-model="signup.reason"
          placeholder="Your idea / why you want to register on Infinity-Booking"
          rows="2"
        ></textarea>
        <input v-model="signup.password" type="password" placeholder="Password" required />
        <input
          v-model="signup.confirm"
          type="password"
          placeholder="Confirm Password"
          required
        />
        <div class="file-upload">
          <label style="display:block; text-align:left; margin-bottom:6px;">Profile Image </label>
          <input @change="onFileChange" type="file" accept="image/*"/>
        </div>
        <input v-model="signup.nationalId" type="text" placeholder="National ID" />
        <input v-model="signup.city" type="text" placeholder="your location" required/>
        <label class="terms" style="display:flex; align-items:center; gap:8px; font-size:0.9rem;">
          <input v-model="signup.accept" type="checkbox" required />
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
        <button type="submit" class="btn">Create Account</button>
        <p class="switch-text">
          Already have an account?
          <span @click="activeTab = 'login'">Login</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("login");

/* login model */
const login = ref({ email: "", password: "" });

/* signup model */
const signup = ref({
  fullName: "",
  email: "",
  phone: "",
  category: "",
  experience: "",
  reason: "",
  password: "",
  confirm: "",
  accept: false,
  nationalId: "",
  city: "",
  profileFile: null
});

// ✅ Helpers to store users
function getUsers() {
  return JSON.parse(localStorage.getItem("providers") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("providers", JSON.stringify(users));
}

/* handlers */
function handleLogin() {
  if (!login.value.email || !login.value.password) {
    alert("Please enter email and password");
    return;
  }

  const users = getUsers();
  const user = users.find(
    u => u.email === login.value.email && u.password === login.value.password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("token", "provider_token");
  localStorage.setItem("currentUser", JSON.stringify({ email: user.email, fullName: user.fullName }));

  router.push({ name: "ProviderDashboard" });
}

function handleSignup() {
  if (!signup.value.fullName.trim()) { alert("Full name is required"); return; }
  if (!signup.value.email) { alert("Email is required"); return; }
  if (!signup.value.phone) { alert("Phone number is required"); return; }
  if (!signup.value.category) { alert("Please select a service category"); return; }
  if (!signup.value.experience) { alert("Please provide your experience"); return; }
  if (!signup.value.password || !signup.value.confirm) { alert("Password and confirm password are required"); return; }
  if (signup.value.password !== signup.value.confirm) { alert("Passwords do not match"); return; }
  if (!signup.value.profileFile) { alert("Please upload a profile image"); return; }
  if (!signup.value.accept) { alert("You must accept the Terms & Conditions"); return; }

  const users = getUsers();

  if (users.some(u => u.email === signup.value.email)) {
    alert("Email already registered");
    return;
  }

  const newUser = {
    fullName: signup.value.fullName,
    email: signup.value.email,
    phone: signup.value.phone,
    category: signup.value.category,
    experience: signup.value.experience,
    reason: signup.value.reason,
    nationalId: signup.value.nationalId,
    city: signup.value.city,
    password: signup.value.password
  };

  users.push(newUser);
  saveUsers(users);

  // ✅ Switch to login after signup and prefill email
  alert("Signup successful! Please login now.");
  activeTab.value = "login";   // Switch tab
  login.value.email = signup.value.email; // Prefill email
  login.value.password = "";   // Clear password for security
}

/* file change */
function onFileChange(e) {
  const f = e.target.files && e.target.files[0];
  signup.value.profileFile = f || null;
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 4rem 1rem 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #0077ff, #00c9a7);
  font-family: "Poppins", sans-serif;
}

.auth-container {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.title {
  color: #0077ff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.7rem 0;
  font-size: 1rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tabs button.active {
  color: #0077ff;
  font-weight: 600;
  border-color: #0077ff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form input,
.form select,
.form textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form input:focus,
.form select:focus,
.form textarea:focus {
  border-color: #0077ff;
  outline: none;
}

.btn {
  background: #0077ff;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #005fd1;
}

.switch-text {
  margin-top: 0.8rem;
  font-size: 0.9rem;
  color: #555;
}

.switch-text span {
  color: #0077ff;
  cursor: pointer;
  font-weight: 600;
}

.file-upload input[type="file"] {
  padding: 0.25rem 0;
}
</style>
