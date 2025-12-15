<template>
  <section class="team-page">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1>Meet Our Team</h1>
        <p class="subtitle">
          We're a passionate group of builders based in Ethiopia, united by a mission to simplify service booking for everyone.
        </p>
      </header>

      <!-- Mission -->
      <div class="mission-statement">
        <p>
          Infinity-Booking was born from a simple idea: <strong>connecting service providers and customers should be effortless, secure, and fair.</strong>
        </p>
        <p>
          From our base in Addis Ababa, we design and build tools that empower local professionals — from tutors in Mekelle to technicians in Hawassa — to grow their businesses with confidence.
        </p>
      </div>

      <!-- Team Grid -->
      <div class="team-grid">
        <TeamMember
          name="Abebe Kebede"
          role="Founder & CEO"
          bio="Former educator turned tech entrepreneur. Believes technology should serve local communities first."
          :avatar="placeholderAvatar"
        />
        <TeamMember
          name="Selamawit Gebre"
          role="Lead Product Designer"
          bio="Crafts intuitive experiences with a focus on accessibility and Ethiopian user needs."
          :avatar="placeholderAvatar"
        />
        <TeamMember
          name="Dawit Tadesse"
          role="Senior Backend Engineer"
          bio="Architect of our secure, scalable platform. Passionate about developer tooling."
          :avatar="placeholderAvatar"
        />
        <TeamMember
          name="Hiwot Lemma"
          role="Frontend Lead"
          bio="Builds responsive, performant interfaces that work flawlessly across all devices."
          :avatar="placeholderAvatar"
        />
        <TeamMember
          name="Yonas Assefa"
          role="Customer Success"
          bio="Your voice inside Infinity-Booking. Ensures providers get the support they need."
          :avatar="placeholderAvatar"
        />
        <TeamMember
          name="Join Us!"
          role="We're Hiring"
          bio="Help us build the future of service booking in Africa. Open roles in engineering, design, and support."
          :avatar="plusIcon"
          is-link
          link-url="/careers"
        />
      </div>

      <!-- Footer Note -->
      <div class="team-footer">
        <p>
          We’re proud to be building <strong>for Ethiopia, from Ethiopia</strong> — with global standards and local heart.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Reusable placeholder (replace with real avatars later)
const placeholderAvatar = 'https://placehold.co/400x400/4f46e5/white?text=👤'
const plusIcon = 'https://placehold.co/400x400/1e293b/64748b?text=+'
</script>

<style scoped>
.team-page {
  background: #0f172a;
  color: #e2e8f0;
  padding: 3rem 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
}

.page-header h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: #cbd5e1;
  max-width: 700px;
  margin: 0 auto;
}

.mission-statement {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 3rem;
  color: #cbd5e1;
}

.mission-statement p {
  margin: 1rem 0;
  font-size: 1rem;
}

.mission-statement strong {
  color: #c7d2fe;
}

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Team Footer */
.team-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #94a3b8;
}

.team-footer strong {
  color: #a5b4fc;
}
</style>