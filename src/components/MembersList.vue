<template>
    <Card class="p-card" :style="{ width: '100%', height: '100%' }">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">Members List</h2>
        </div>
      </template>
      <template #content>
        <div>
          <DataTable scrollable stripedRows :value="store.members" size="small"
            :globalFilterFields="['name.first', 'name.last', 'email', 'phone', 'role']"
            v-model:filters="filters"
            @rowSelect="$emit('selectUser', $event.data)"
            @rowUnselect="$emit('unselectUser', $event.data)"
            v-model:selection="selectedMember"
            selectionMode="single"
          >
            <template #header>
              <div class="flex justify-between items-center w-full">
                <Button label="Add Member" icon="pi pi-plus" @click="addMember" />
                <div class="flex items-center">
                  <IconField>
                    <InputIcon icon="pi pi-search" class="p-mr-2">
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" v-model="filters['global'].value" class="p-mr-2" />
                  </IconField>
                </div>
              </div>
            </template>
            <!-- First Name -->
            <Column field="name.first" sortable frozen>
              <template #header>
                <div class="flex flex-col">
                  <span>First Name</span>
                  <InputText
                    v-model="newMember.name.first"
                    placeholder="First Name"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- Last Name -->
            <Column field="name.last" sortable frozen>
              <template #header>
                <div class="flex flex-col">
                  <span>Last Name</span>
                  <InputText
                    v-model="newMember.name.last"
                    placeholder="Last Name"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- Email -->
            <Column field="email" >
              <template #header>
                <div class="flex flex-col">
                  <span>Email</span>
                  <InputText
                    v-model="newMember.email"
                    placeholder="Email"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- Phone -->
            <Column field="phone" >
              <template #header>
                <div class="flex flex-col">
                  <span>Phone</span>
                  <InputText
                    v-model="newMember.phone"
                    placeholder="Phone"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- Role -->
            <Column field="role" >
              <template #header>
                <div class="flex flex-col">
                  <span>Role</span>
                  <InputText
                    v-model="newMember.role"
                    placeholder="Role"
                    class="mt-1"
                  />
                </div>
              </template>
            </Column>

            <!-- Active -->
            <Column field="active" >
              <template #header>
                <div class="flex flex-col">
                  <span>Active</span>
                  <select
                    v-model="newMember.active"
                    class="p-inputtext p-component mt-1"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </template>
              <template #body="slotProps">
                {{ slotProps.data.active ? "Yes" : "No" }}
              </template>
            </Column>

            <!-- Address -->
            <Column field="address" >
              <template #header>
                <div class="flex flex-col">
                  <span>Address</span>
                  <InputText
                    v-model="newMember.address"
                    placeholder="Address"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- City -->
            <Column field="city" >
              <template #header>
                <div class="flex flex-col">
                  <span>City</span>
                  <InputText
                    v-model="newMember.city"
                    placeholder="City"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- State -->
            <Column field="state" >
              <template #header>
                <div class="flex flex-col">
                  <span>State</span>
                  <InputText
                    v-model="newMember.state"
                    placeholder="State"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>

            <!-- Zip Code -->
            <Column field="zip_code" >
              <template #header>
                <div class="flex flex-col">
                  <span>Zip Code</span>
                  <InputText
                    v-model="newMember.zip_code"
                    placeholder="Zip Code"
                    class="mt-1"
                    required
                  />
                </div>
              </template>
            </Column>
          </DataTable>
          <!-- if no members -->
          <div v-if="store.members.length === 0" class="text-center mt-6">
            <p v-if="store.church" class="text-gray-500">
            No members found for {{ store.church.name }} {{ store.members.length }}
            </p>
            <p v-else class="text-gray-500">
              Loading members...
            </p>
          </div>
        </div>
      </template>
    </Card>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Card from "primevue/card";
import ScrollPanel from "primevue/scrollpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Checkbox from "primevue/checkbox";
import { FilterMatchMode } from "@primevue/core/api";
import { store, HTTP } from "../store";
import { getMembers } from "../utils";


const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedMember = ref(null);

const newMember = ref({
  name: {
    first: "",
    last: "",
  },
  email: "",
  phone: "",
  church_id: store.church?._id || null,
  role: "",
  active: true,
  address: "",
  city: "",
  state: "",
  zip_code: "",
});


const addMember = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  const token = await user.getIdToken();
  if (!store.church) {
    console.error("No church found");
    return;
  }
  newMember.value.church_id = store.church._id;

  try {
    const res = await HTTP.post("/members", newMember.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Refresh members list
    getMembers(token);
  } catch (error) {
    console.error("Failed to add member:", error);
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

.mt-6 {
  margin-top: 1.5rem;
}

.mt-1 {
  max-width: 100px;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>

