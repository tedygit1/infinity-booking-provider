<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Header -->
    <header class="bg-white shadow rounded-lg p-5 mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-semibold text-green-700">Provider Dashboard</h1>
      <p class="text-gray-500">Welcome back, Provider 👋</p>
    </header>

    <!-- Dashboard Cards -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="provider-card">
        <h2>💅 My Services</h2>
        <p>Add, edit, or remove the services you offer to customers.</p>
        <button class="btn-green">Manage Services</button>
      </div>

      <div class="provider-card">
        <h2>📅 Booking Requests</h2>
        <p>View and respond to booking requests from customers.</p>
        <button class="btn-blue">View Requests</button>
      </div>

      <div class="provider-card">
        <h2>📝 Profile Settings</h2>
        <p>Update your details, work experience, and contact information.</p>
        <button class="btn-purple">Edit Profile</button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-500 text-sm mt-10">
      © 2025 Tigray Beauty & Home Service | Provider Panel
    </footer>
  </div>
</template>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
}

/* Provider Cards */
.provider-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.provider-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.provider-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #15803d;
}

.provider-card p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1.2rem;
}

.btn-green {
  background-color: #16a34a;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-green:hover {
  background-color: #15803d;
}

.btn-blue {
  background-color: #3b82f6;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-blue:hover {
  background-color: #2563eb;
}

.btn-purple {
  background-color: #7c3aed;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-purple:hover {
  background-color: #6d28d9;
}
</style>
