<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="relative w-full min-h-[500px] flex items-center justify-center text-white bg-cover bg-center">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center w-full max-w-7xl">
        <!-- Text Section -->
        <div class="w-full md:w-2/5 text-left">
          <h1 class="text-5xl font-bold text-gray-900 dark:text-white">Welcome to Titus</h1>
          <p class="text-lg mt-4 text-gray-900 dark:text-gray-300 drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
            The ultimate tool for churches to manage budgets, track tithes and offerings, and handle membership seamlessly.
          </p>
          <router-link to="/register">
            <Button label="Get Started" icon="pi pi-arrow-right" class="p-button-raised p-button-lg mt-6" />
          </router-link>
        </div>
        
        <!-- Image Section -->
        <div class="w-full md:w-3/5 flex justify-end">
          <img src="/hero-image.jpg" alt="Hero Image" class="w-full h-auto object-cover rounded-lg shadow-lg max-w-2xl" />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="py-16 bg-gray-100 dark:bg-gray-900">
      <div class="container mx-auto px-4 w-full max-w-7xl">
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Panel header="Budget Management" class="p-shadow-4 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Plan and manage your church's finances effectively with our intuitive budget tools.
            </p>
          </Panel>
          <Panel header="Tithes & Offerings" class="p-shadow-4 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Track and report on tithes and offerings to keep everyone informed and accountable.
            </p>
          </Panel>
          <Panel header="Membership Management" class="p-shadow-4 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Maintain detailed records of your members and communicate with them effortlessly.
            </p>
          </Panel>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-16 bg-blue-600 text-white text-center">
      <h2 class="text-3xl font-bold mb-4">Start Managing Your Church with Titus Today</h2>
      <p class="mb-6">Sign up now and simplify your church's administration.</p>
      <router-link to="/register">
        <Button label="Create an Account" icon="pi pi-user-plus" class="p-button-lg p-button-outlined" />
      </router-link>
    </section>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Panel from "primevue/panel";
</script>

