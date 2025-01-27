<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Onboarding
      </h1>
      <form @submit.prevent="onboard">
        <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
          Church Information
        </h2>
        <div class="mb-4">
          <label for="churchName" class="block text-sm font-medium mb-1">Church Name</label>
          <input
            id="churchName"
            type="text"
            v-model="church.name"
            placeholder="Church Name"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="churchAddress" class="block text-sm font-medium mb-1">Address</label>
          <input
            id="churchAddress"
            type="text"
            v-model="church.address"
            placeholder="Address"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="city" class="block text-sm font-medium mb-1">City</label>
          <input
            id="city"
            type="text"
            v-model="church.city"
            placeholder="City"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="state" class="block text-sm font-medium mb-1">State</label>
          <input
            id="state"
            type="text"
            v-model="church.state"
            placeholder="State"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="zipCode" class="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            id="zipCode"
            type="text"
            v-model="church.zip_code"
            placeholder="ZIP Code"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
          <input
            id="phone"
            type="text"
            v-model="church.phone"
            placeholder="Phone"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="text"
            v-model="church.email"
            placeholder="Email"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>

        <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">User Information</h2>
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium mb-1">First Name</label>
          <input
            id="firstName"
            type="text"
            v-model="user.name.first"
            placeholder="First Name"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium mb-1">Last Name</label>
          <input
            id="lastName"
            type="text"
            v-model="user.name.last"
            placeholder="Last Name"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
          <input
            id="userPhone"
            type="text"
            v-model="user.phone"
            placeholder="Phone"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div class="mb-4">
          <label for="role" class="block text-sm font-medium mb-1">Role</label>
          <select
            id="role"
            v-model="user.role"
            class="w-full px-4 py-2 border rounded-lg shadow-sm"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-black rounded-lg shadow-md focus:outline-none"
          >
            Submit
          </button>
        </div>
        <div class="mt-4" v-if="error">
          <p class="text-red-500">{{ error }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { store } from "../store";
import axios from "axios";

const router = useRouter();
const auth = getAuth();

const church = ref({
  name: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  phone: "",
  email: "",
});

const user = ref({
  name: {
    first: "",
    last: "",
  },
  phone: "",
  role: "admin",
});

const error = ref(null);

const onboard = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      error.value = "You must be logged in to onboard.";
      return;
    }

    const church_body = {
      ...church.value,
    }

  try {
    error.value = null;
    let rsp = await axios.post("http://localhost:8080/churches", church_body);
    const church_id = await rsp.data._id;


    const user_body = {
      ...user.value,
      church_id: church_id,
      email: currentUser.email,
      auth_id: currentUser.uid,
    };

    let user_rsp = await axios.post("http://localhost:8080/users", user_body);
    store.user = user_rsp.data;
    router.push("/dashboard");

  } catch (err) {
    error.value = err.response?.data?.message || "An error occurred.";
  }
};
</script>

