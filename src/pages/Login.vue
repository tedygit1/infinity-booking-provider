<template>
  <div
    class="auth-page font-poppins min-h-screen bg-gradient-to-br from-blue-500 via-sky-400 to-teal-400 flex items-center justify-end pr-24"
  >
    <!-- Auth Card (Moved Slightly Right) -->
    <div
      class="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 space-y-6 transform translate-x-[-50px]"
    >
      <h1 class="text-3xl font-bold text-center text-blue-700">
        👩‍🔧 Provider Access Portal
      </h1>

      <!-- Tabs -->
      <div class="tabs flex justify-center space-x-8 border-b pb-2">
        <button
          :class="activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500'"
          class="pb-1 transition-all duration-200"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          :class="activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500'"
          class="pb-1 transition-all duration-200"
          @click="activeTab = 'register'"
        >
          Sign Up
        </button>
      </div>

      <!-- Login Form -->
      <form
        v-if="activeTab === 'login'"
        @submit.prevent="handleLogin"
        class="space-y-5 mt-4"
      >
        <div>
          <label>Email Address</label>
          <input
            v-model="login.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            v-model="login.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" class="submit-btn">🔐 Login</button>

        <p class="text-center text-sm text-gray-500">
          Don’t have an account?
          <a
            href="#"
            @click.prevent="activeTab = 'register'"
            class="text-blue-600 hover:underline"
            >Register here</a
          >
        </p>
      </form>

      <!-- Register Form -->
      <form
        v-else
        @submit.prevent="handleRegister"
        class="space-y-5 mt-4"
      >
        <div>
          <label>Full Name</label>
          <input
            v-model="register.name"
            type="text"
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label>Email Address</label>
          <input
            v-model="register.email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            v-model="register.phone"
            type="tel"
            placeholder="+251 9..."
            required
          />
        </div>

        <div>
          <label>Location</label>
          <input
            v-model="register.location"
            type="text"
            placeholder="City / Region"
            required
          />
        </div>

        <div>
          <label>Years of Experience</label>
          <input
            v-model="register.experience"
            type="number"
            placeholder="e.g. 3"
            required
          />
        </div>

        <div>
          <label>Service Category</label>
          <select v-model="register.category" required>
            <option value="">Select your main service</option>
            <option>Home Maintenance</option>
            <option>Beauty & Spa</option>
            <option>Cleaning & Laundry</option>
            <option>Education & Tutoring</option>
            <option>Health & Fitness</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Skills / Description</label>
          <textarea
            v-model="register.skills"
            placeholder="Describe your expertise..."
            rows="3"
          ></textarea>
        </div>

        <div>
          <label>Password</label>
          <input
            v-model="register.password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>

        <button type="submit" class="submit-btn">
          🚀 Create Provider Account
        </button>

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <a
            href="#"
            @click.prevent="activeTab = 'login'"
            class="text-blue-600 hover:underline"
            >Login</a
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProviderAuth",
  data() {
    return {
      activeTab: "login",
      login: { email: "", password: "" },
      register: {
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        category: "",
        skills: "",
        password: "",
      },
    };
  },
  methods: {
    handleLogin() {
      alert(`Welcome back, ${this.login.email}!`);
    },
    handleRegister() {
      alert(`Thank you ${this.register.name}, your provider account has been registered!`);
    },
  },
};
</script>

<style scoped>
input,
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background-color: #fafafa;
  transition: all 0.3s;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #bfdbfe;
}
label {
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 5px;
}
.submit-btn {
  background-color: #2563eb;
  color: white;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
  transition: all 0.3s;
}
.submit-btn:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}
</style>
