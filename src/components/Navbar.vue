<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="logo-text">CS Platform</router-link>
    </div>

    <ul class="nav-links">
      <li>
        <router-link to="/" class="link" :class="{ active: $route.name === 'Home' }">Home</router-link>
      </li>
      <li>
        <router-link to="/providers" class="link" :class="{ active: $route.name === 'Providers' }">Providers</router-link>
      </li>
      <li>
        <router-link to="/about" class="link" :class="{ active: $route.name === 'About' }">About</router-link>
      </li>
      <li>
        <router-link to="/how-it-works" class="link" :class="{ active: $route.name === 'HowItWorks' }">
          How It Works
        </router-link>
      </li>
      <li>
        <router-link to="/contact" class="link" :class="{ active: $route.name === 'Contact' }">Contact</router-link>
      </li>
      <li>
        <router-link
          to="/login"
          class="login-btn"
          :class="{ active: $route.name === 'Login' }"
        >
          Login / Sign Up
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
/* === Navbar Base Style === */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem 1rem 3rem;
  z-index: 1000;
  backdrop-filter: blur(6px);
  box-sizing: border-box;
}

/* === Logo === */
.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.logo-text:hover {
  color: #ffcc00;
}

/* === Links === */
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin-right: 1rem; /* slight margin to keep from right edge */
}

.link {
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ffcc00;
}

.active {
  color: #ffcc00;
  font-weight: 600;
}

/* === Login Button === */
.login-btn {
  background: #ffcc00;
  color: black !important;
  padding: 0.55rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s;
  margin-left: 0.8rem; /* adds breathing room from other links */
}

.login-btn:hover {
  background: #ffd633;
  transform: scale(1.05);
}

/* === Responsive Design === */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
