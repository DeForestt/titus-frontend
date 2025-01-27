<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Create an Account
      </h1>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            v-model="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            v-model="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          <lable
              for="repassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
              Re-enter password
          </lable>
          <input
              id="repassword"
              type="password"
              placeholder="Re-enter password"
              v-model="repassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <!-- error message -->
        <div class="mb-6" v-if="error">
          <p class="text-red-500 text-sm">{{ error }}</p>
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="px-6 py-2 text-black bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const repassword = ref("");
const error = ref(null);

const auth = getAuth();
const router = useRouter();

const register = async () => {
  try {
    error.value = null;
    if (password.value !== repassword.value) {
      error.value = "Passwords do not match";
      return;
    }
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (e) {
    error.value = e.message;
  }
};
</script>

