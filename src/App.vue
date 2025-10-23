<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer /> <!-- ✅ Footer added -->
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue' // ✅ Import the Footer

export default {
  name: 'App',
  components: { Navbar, Footer } // ✅ Register it here
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
}
</style>
