<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Onboarding
      </h1>
      
      <Form v-slot="$form" :initialValues :resolver @submit="onboard" class="flex flex-col gap-6 w-full">
        <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300">Church Information</h2>
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Church Name</label>
          <InputText placeholder="Enter church name" name="church.name" v-model="church.name" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Address</label>
          <InputText placeholder="Enter address" name="church.address" v-model="church.address" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">City</label>
            <InputText placeholder="City" name="church.city" v-model="church.city" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">State</label>
            <InputText placeholder="State" name="church.state" v-model="church.state" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">ZIP Code</label>
            <InputText placeholder="ZIP Code" name="church.zip_code" v-model="church.zip_code" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Phone</label>
            <InputText placeholder="Phone" name="church.phone" v-model="church.phone" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
        <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300">User Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">First Name</label>
            <InputText placeholder="First Name" name="user.name.first" v-model="user.name.first" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Last Name</label>
            <InputText placeholder="Last Name" name="user.name.last" v-model="user.name.last" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Phone</label>
          <InputText placeholder="Phone" name="user.phone" v-model="user.phone" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Role</label>
          <Dropdown name="user.role" v-model="user.role" :options="roles" class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white" />
        </div>
        <Button type="submit" label="Submit" severity="primary" class="w-full py-3 text-lg" />
        <Message v-if="error" severity="error" size="small" variant="filled">
          {{ error }}
        </Message>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { store, HTTP } from "../store";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import Button from "primevue/button";

const router = useRouter();
const auth = getAuth();

const church = ref({ name: "", address: "", city: "", state: "", zip_code: "", phone: "", email: "" });
const user = ref({ name: { first: "", last: "" }, phone: "", role: "admin" });
const error = ref(null);
const roles = ref(["admin", "staff"]);

const resolver = async ({ values }) => {
  const errors = {};
  if (!values.church.name) {
    errors["church.name"] = [{ message: "Church name is required" }];
  }
  
  if (!values.church.address) {
    errors["church.address"] = [{ message: "Address is required" }];
  }

  if (!values.church.city) {
    errors["church.city"] = [{ message: "City is required" }];
  }

  if (!values.church.state) {
    errors["church.state"] = [{ message: "State is required" }];
  }

  if (!values.church.zip_code) {
    errors["church.zip_code"] = [{ message: "ZIP Code is required" }];
  }

  if (!values.church.phone) {
    errors["church.phone"] = [{ message: "Phone is required" }];
  }

  if (!values.user.name.first) {
    errors["user.name.first"] = [{ message: "First name is required" }];
  }
  if (!values.user.name.last) {
    errors["user.name.last"] = [{ message: "Last name is required" }];
  }
  if (!values.user.phone) {
    errors["user.phone"] = [{ message: "Phone is required" }];
  }
  return { errors };
};

const onboard = async ({ valid }) => {
  if (!valid) return;
  const currentUser = auth.currentUser;
  if (!currentUser) {
    error.value = "You must be logged in to onboard.";
    return;
  }
  try {
    error.value = null;
    const rsp = await HTTP.post("/churches", { ...church.value });
    const church_id = rsp.data._id;
    const user_rsp = await HTTP.post("/users", { ...user.value, church_id, email: currentUser.email, auth_id: currentUser.uid });
    store.user = user_rsp.data;
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "An error occurred.";
  }
};
</script>

