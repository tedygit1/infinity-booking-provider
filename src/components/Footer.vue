<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Brand Info -->
      <div class="footer-section brand">
        <h2 class="logo">Infinity-Booking</h2>
        <p class="desc">
          Connecting customers and trusted service providers worldwide — discover professionals for every need, anywhere.
        </p>
        <div class="social-icons">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a
            href="https://www.linkedin.com/in/tedros-welu-126b77378"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/providers">Providers</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <!-- Support -->
      <div class="footer-section support">
        <h3>Support</h3>
        <ul>
          <li><router-link to="/help-center">Help Center</router-link></li>
          <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
          <li><router-link to="/terms-of-service">Terms of Service</router-link></li>
          <li><router-link to="/feedback">Feedback</router-link></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <p><i class="fas fa-envelope"></i> info@csplatform.com</p>
        <p><i class="fas fa-phone"></i> +251 96 488 3260</p>
        <p><i class="fas fa-globe"></i> Available Worldwide</p>
      </div>
    </div>

    <hr class="divider" />

    <!-- Bottom Copyright -->
    <div class="footer-bottom">
      <p>© {{ currentYear }} <strong>Infinity-Booking</strong>. All rights reserved.</p>
      <button
        class="scroll-top"
        @click="scrollToTop"
        aria-label="Scroll to top"
        title="Back to top"
      >
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const currentYear = new Date().getFullYear();

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Optional: Auto-hide scroll button on scroll
let scrollBtn = null;
function handleScroll() {
  if (window.scrollY > 400) {
    scrollBtn?.classList.add('show');
  } else {
    scrollBtn?.classList.remove('show');
  }
}

onMounted(() => {
  scrollBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  padding: 2.5rem 1.5rem 1.2rem;
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ffcc00, #3b82f6);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.7rem;
  background: linear-gradient(90deg, #ffcc00, #ffd54f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  margin-bottom: 12px;
}

.desc {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Social Icons */
.social-icons {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.25s ease;
}

.social-icons a:hover {
  background: #ffcc00;
  color: #1e293b;
  transform: translateY(-3px);
}

/* Section Headers */
.footer-section h3 {
  color: #ffcc00;
  font-size: 1.15rem;
  margin-bottom: 16px;
  font-weight: 700;
}

/* Links */
.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a,
.footer-section router-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-block;
  padding: 4px 0;
}

.footer-section a:hover,
.footer-section router-link:hover {
  color: #ffcc00;
  transform: translateX(4px);
}

/* Contact Info */
.contact p {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact i {
  color: #ffcc00;
  width: 18px;
  text-align: center;
}

/* Divider */
.divider {
  border: 0;
  border-top: 1px solid #334155;
  margin: 2rem auto 1.2rem;
  max-width: 1200px;
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-bottom strong {
  color: #ffcc00;
}

/* Scroll Top Button */
.scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #ffcc00, #ffd54f);
  border: none;
  border-radius: 50%;
  color: #1e293b;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 100;
}

.scroll-top.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-top:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .footer-content {
    gap: 1.8rem;
    text-align: center;
  }

  .social-icons {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
  }

  .scroll-top {
    right: 20px;
    bottom: 20px;
  }
}
</style>