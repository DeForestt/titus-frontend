<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Hero Section -->
    <header class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to Titus</h1>
        <p class="text-lg mb-6">
          The ultimate tool for churches to manage budgets, track tithes and offerings, and handle membership seamlessly.
        </p>
        <router-link
          to="/register"
          class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 shadow-md"
        >
          Get Started
        </router-link>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-12 bg-gray-100 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">Budget Management</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Plan and manage your church's finances effectively with our intuitive budget tools.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">Tithes & Offerings</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Track and report on tithes and offerings to keep everyone informed and accountable.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">Membership Management</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Maintain detailed records of your members and communicate with them effortlessly.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-12 bg-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold mb-4">Start Managing Your Church with Titus Today</h2>
        <p class="mb-6">Sign up now and simplify your church's administration.</p>
        <router-link
          to="/register"
          class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 shadow-md"
        >
          Create an Account
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { getAuth, onAuthStateChanged } from "firebase/auth"
  import { onBeforeMount } from "vue"
  import { useRouter } from "vue-router"

  const auth = getAuth()
  const router = useRouter()

  onBeforeMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard")
      }
    })
  })

</script>

