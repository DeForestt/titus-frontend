<template>
  <ScrollPanel style="height: 100%; width: 100%;">
  <Card class="p-card" :style="{ width: '100%', height: '100%' }">
    <template #header>
      <div class="flex align-items-center justify-content-between">
        <h2 class="text-xl font-semibold">
          {{ store.church ? store.church.name : "Church Information" }}
        </h2>
      </div>
    </template>
    <template #content>
      <div v-if="store.church">
        <div class="p-field">
          <label class="font-medium">Church Name:</label>
          <p>{{ store.church.name }}</p>
          <p class="text-sm text-gray-500">id: {{ store.church._id.$oid }}</p>
        </div>
        <div class="p-field">
          <label class="font-medium">Address:</label>
          <p>
            {{ store.church.address }}, {{ store.church.city }}, {{ store.church.state }} {{ store.church.zip_code }}
          </p>
        </div>
        <div class="p-field">
          <label class="font-medium">Phone:</label>
          <p>{{ store.church.phone }}</p>
        </div>
        <div class="p-field">
          <label class="font-medium">Email:</label>
          <p>{{ store.church.email }}</p>
        </div>
      </div>

      <div v-else>
        <p>Loading church information...</p>
      </div>
    </template>
  </Card>
  </ScrollPanel>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from "../store";
import axios from "axios";
import Card from "primevue/card";
import ScrollPanel from "primevue/scrollpanel";

const getChurch = async (token) => {
  try {
    const res = await axios.get(`http://localhost:8080/churches/${store.user.church_id.$oid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch church info:", error);
    return null;
  }
};
</script>

<style scoped>
.p-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--surface-a);
}

.font-medium {
  font-weight: 500;
}
</style>

