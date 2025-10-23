<template>
  <div class="contact-page font-poppins">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Partner with Infinity-Booking</h1>
        <p>Join our platform to grow your services, reach more customers, and manage bookings efficiently.</p>
        
      </div>
    </section>

    <!-- Info & Provider Form -->
    <section class="info-section">
      <div class="grid-container">
        
        <!-- Info Cards -->
        <div class="info-cards">
          <div class="info-card">
            <h2>Grow Your Services</h2>
            <p>Reach customers across cities and regions, manage bookings, and build a strong reputation online.</p>
          </div>
          <div class="info-card">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> support@infinity-booking.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
          <div class="info-card">
            <h2>Follow Us</h2>
            <div class="social-icons">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
              <a href="#"><i class="fab fa-whatsapp"></i></a>
              <a href="#"><i class="fab fa-telegram"></i></a>
              <a href="#"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <!-- Provider Form -->
        <form class="provider-form" @submit.prevent="handleSubmit">
          <h2>Become a Provider</h2>
          <div class="form-group">
            <input v-model="form.name" type="text" required placeholder=" " />
            <label>Business / Service Name</label>
          </div>
          <div class="form-group">
            <input v-model="form.email" type="email" required placeholder=" " />
            <label>Email Address</label>
          </div>
          <div class="form-group">
            <textarea v-model="form.message" rows="5" placeholder=" "></textarea>
            <label>Message / Service Details</label>
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>

      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to Join Infinity-Booking?</h2>
      <p>Empower your business, expand your reach, and manage your services efficiently.</p>
      <router-link to="/login" class="cta-btn">📈 Sign Up / Login</router-link>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: { name: '', email: '', message: '' },
    };
  },
  methods: {
    handleSubmit() {
      alert(`Thank you, ${this.form.name}! Our team will contact you soon.`);
      this.form = { name: '', email: '', message: '' };
    },
  },
};
</script>

<style scoped>
.contact-page { font-family: 'Poppins', sans-serif; }

/* Hero Section */
.hero-section {
  background: linear-gradient(to right, #3b82f6, #1e40af);
  text-align: center; padding: 100px 20px;
  position: relative;
}
.hero-overlay {
  position: absolute; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.25); z-index:1;
}
.hero-content {
  position: relative; z-index:2; max-width:900px; margin:0 auto;
  color: #f0f9ff;
}
.hero-content h1 { font-size:3rem; margin-bottom:1rem; font-weight:700; }
.hero-content p { font-size:1.2rem; margin-bottom:1.5rem; line-height:1.7; }
.cta-btn {
  background:#ffd54f; color:black; padding:1rem 2rem; font-weight:600; border-radius:10px; text-decoration:none;
  transition: transform 0.3s, background 0.3s;
}
.cta-btn:hover { transform:scale(1.05); background:#ffe082; }

/* Info Section */
.info-section { background:white; padding:80px 20px; }
.grid-container { display:flex; flex-wrap:wrap; gap:40px; justify-content:center; max-width:1200px; margin:0 auto; }
.info-cards { display:flex; flex-direction:column; gap:30px; flex:1; min-width:280px; }
.info-card {
  background:white; padding:25px; border-radius:20px; box-shadow:0 6px 15px rgba(0,0,0,0.1);
  transition:transform 0.3s, box-shadow 0.3s;
}
.info-card:hover { transform:translateY(-8px); box-shadow:0 12px 25px rgba(0,0,0,0.15); }
.info-card h2 { color:#3b82f6; margin-bottom:10px; font-size:1.5rem; font-weight:700; }
.info-card p { color:#555; font-size:1rem; line-height:1.6; }

/* Social Icons */
.social-icons { display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; }
.social-icons a {
  display:inline-flex; align-items:center; justify-content:center; width:50px; height:50px;
  border-radius:50%; background:#f0f9ff; color:#3b82f6; font-size:1.5rem;
  transition: all 0.3s;
}
.social-icons a:hover {
  transform: translateY(-5px) scale(1.1); color:white; background:#3b82f6;
}

/* Form Styles */
.provider-form { flex:1; background:#f0f9ff; padding:30px; border-radius:25px; box-shadow:0 6px 15px rgba(0,0,0,0.1); transition:transform 0.3s, box-shadow 0.3s; }
.provider-form:hover { transform:translateY(-5px); box-shadow:0 12px 25px rgba(0,0,0,0.15); }
.provider-form h2 { text-align:center; color:#3b82f6; margin-bottom:20px; font-size:2rem; font-weight:700; }
.provider-form input, .provider-form textarea {
  width:100%; border:1px solid #ccc; border-radius:10px; padding:12px; margin-bottom:20px; outline:none;
  transition: all 0.3s;
}
.provider-form input:focus, .provider-form textarea:focus { border-color:#3b82f6; box-shadow:0 0 10px rgba(59,130,246,0.3); }
.form-group { position:relative; }
.form-group label {
  position:absolute; left:15px; top:12px; background:#f0f9ff; padding:0 5px; color:#777;
  pointer-events:none; transition:0.3s;
}
.provider-form input:focus + label,
.provider-form input:not(:placeholder-shown) + label,
.provider-form textarea:focus + label,
.provider-form textarea:not(:placeholder-shown) + label {
  top:-10px; left:10px; font-size:0.85rem; color:#3b82f6;
}
.submit-btn {
  width:100%; background:#3b82f6; color:white; padding:12px; font-weight:600; border-radius:10px; cursor:pointer;
  transition:all 0.3s;
}
.submit-btn:hover { background:#1e40af; transform:scale(1.03); }

/* CTA Section */
.cta-section {
  background: linear-gradient(to right, #3b82f6, #1e40af);
  text-align:center; padding:100px 20px; color:white;
}
.cta-section h2 { font-size:3rem; font-weight:700; margin-bottom:20px; }
.cta-section p { font-size:1.2rem; margin-bottom:30px; }

/* Responsive */
@media(max-width:768px) {
  .grid-container { flex-direction:column; }
  .social-icons { justify-content:center; }
}
</style>
