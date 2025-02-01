<template>
  <div class="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
    <!-- Header with Name and Edit Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        {{ member.name.first }} {{ member.name.last }}
      </h2>
      <!-- Small Member ID -->
      <p class="text-sm text-gray-500">ID: {{ member._id.$oid }}</p>
      <div class="flex gap-2">
        <Button
          :icon="editMode ? 'pi pi-check' : 'pi pi-pencil'"
          class="p-button-rounded p-button-text"
          @click="toggleEditMode"
        />
        <Button
          v-if="editMode"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          @click="cancelEdit"
        />
      </div>
    </div>

    <ScrollPanel style="height:100%">

    <!-- Add Tithing Record -->
    <Form v-if="!editMode" @submit="addTithingRecord" class="mt-4">
      <p class="text-sm font-semibold md:underline">Add Stewardship Record</p>
      
      <div class="flex gap-2">
        <InputNumber prefix="$" :min="0" v-model="tithingRecord.amount" placeholder="Amount" class="w-full" />
        <Select 
          v-model="tithingRecord.category" 
          :options="titheCategories" 
          optionLabel="name"
          optionValue="value"
          editable
          placeholder="Category"
          class="w-full" />
      </div>
      
      <div class="flex gap-2 mt-2">
        <Calendar 
          v-model="tithingRecord.date"
          class="w-full"
          showIcon />
        <Button type="submit" icon="pi pi-plus" class="p-button-success" />
      </div>
    </Form>

    <Divider />

        <!-- Editable Form -->
    <Form @submit="saveChanges" v-if="editMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="first-name">First Name</label>
        <InputText id="first-name" v-model="memberCopy.name.first" class="w-full" />
      </div>
      <div>
        <label for="last-name">Last Name</label>
        <InputText id="last-name" v-model="memberCopy.name.last" class="w-full" />
      </div>
      <div>
        <label for="email">Email</label>
        <InputText id="email" v-model="memberCopy.email" class="w-full" />
      </div>
      <div>
        <label for="phone">Phone</label>
        <InputText id="phone" v-model="memberCopy.phone" class="w-full" />
      </div>
      <div>
        <label for="role">Role</label>
        <InputText id="role" v-model="memberCopy.role" class="w-full" />
      </div>
      <div>
        <label for="active">Active</label>
        <ToggleButton
          id="active"
          v-model="memberCopy.active"
          onLabel="Yes"
          offLabel="No"
          class="w-full"
        />
      </div>
      <div class="col-span-2">
        <label for="address">Address</label>
        <InputText id="address" v-model="memberCopy.address" class="w-full" />
      </div>
      <div>
        <label for="city">City</label>
        <InputText id="city" v-model="memberCopy.city" class="w-full" />
      </div>
      <div>
        <label for="state">State</label>
        <InputText id="state" v-model="memberCopy.state" class="w-full" />
      </div>
      <div>
        <label for="zip-code">Zip Code</label>
        <InputText id="zip-code" v-model="memberCopy.zip_code" class="w-full" />
      </div>

      <!-- Action Buttons -->
      <div class="col-span-2 flex justify-end gap-2">
        <Button label="Save" icon="pi pi-check" class="p-button-success" @click="saveChanges" />
        <Button label="Cancel" icon="pi pi-times" class="p-button-danger" @click="cancelEdit" />
      </div>
    </Form>
    <!-- Read-Only Display -->
    <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <p><strong>Email:</strong> {{ member.email }}</p>
      <p><strong>Phone:</strong> {{ member.phone }}</p>
      <p><strong>Role:</strong> {{ member.role }}</p>
      <p><strong>Active:</strong> {{ member.active ? "Yes" : "No" }}</p>
      <p><strong>Address:</strong> {{ member.address }}</p>
      <p><strong>City:</strong> {{ member.city }}</p>
      <p><strong>State:</strong> {{ member.state }}</p>
      <p><strong>Zip Code:</strong> {{ member.zip_code }}</p>
    </div>

    <Divider />

    <!-- Toggle Tithing History -->
    <Button :label="`${showTithingHistory ? 'Hide' : 'View'} Stewardship History`" icon="pi pi-money-bill" class="p-button-text" @click="toggleTithingHistory" />

    <!-- Tithing History Table -->
    <DataTable v-if="showTithingHistory" :value="tithingRecords" class="p-datatable-sm mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Tithing History</h3>
          <Button icon="pi pi-refresh" class="p-button-text" @click="fetchTithingRecords" />
        </div>
      </template>
      <Column field="amount" header="Amount">
        <template #body="slotProps">
          ${{ slotProps.data.amount.toFixed(2) }}
        </template>
      </Column>
      <Column field="category" header="Category" />
      <Column field="date" header="Date">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date.$date.$numberLong) }}
        </template>
      </Column>
      <Column field="created_at" header="Created At">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at.$date.$numberLong) }}
        </template>
      </Column>
    </DataTable>
    </ScrollPanel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import ToggleButton from "primevue/togglebutton";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Divider from "primevue/divider";
import ScrollPanel from "primevue/scrollpanel";
import Select from "primevue/select";
import { Form } from "@primevue/forms";
import { HTTP } from "../store";
import { getAuth } from "firebase/auth";

// Props
const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
});

// State
const editMode = ref(false);
const showTithingHistory = ref(false);
const tithingRecords = ref([]);
const loadingTithing = ref(false);
const memberCopy = ref(JSON.parse(JSON.stringify(props.member))); // Deep copy for editing

const tithingRecord = ref({
  member_id: props.member._id,
  amount: 0,
  date: new Date(),
  category: null,
});

const titheCategories = ([
  { name: "Tithing", value: "tithing" },
  { name: "Offering", value: "offering" },
  { name: "Donation", value: "donation" },
  { name: "Other", value: "other" },
])

// Methods
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const toggleTithingHistory = () => {
  showTithingHistory.value = !showTithingHistory.value;
  if (showTithingHistory.value) fetchTithingRecords();
};

const fetchTithingRecords = async () => {
  try {
    loadingTithing.value = true;
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const response = await HTTP.get(`/tithing/member/${props.member._id.$oid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    tithingRecords.value = response.data;
  } catch (error) {
    console.error("Error fetching tithing records:", error);
    alert("Failed to fetch tithing records.");
  } finally {
    loadingTithing.value = false;
  }
};

const addTithingRecord = async () => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();

  let mutation = {
    member_id: tithingRecord.value.member_id,
    category: tithingRecord.value.category,
    amount: tithingRecord.value.amount,
    date: {
      $date: {
        $numberLong: tithingRecord.value.date.getTime().toString(),
      },
    },
  };

  try {
    await HTTP.post(`/tithing`, mutation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    tithingRecord.value = { member_id: props.member._id, amount: 0, date: new Date() };
    fetchTithingRecords();
  } catch (error) {
    console.error("Error adding tithing record:", error);
    alert("Failed to add tithing record.");
  }
};

const saveChanges = async () => {
  // get the diff between member and memberCopy
  const diff = {};
  for (const key in memberCopy.value) {
    if (memberCopy.value[key] !== props.member[key]) {
      diff[key] = memberCopy.value[key];
    }
  }
  // remove _id from diff
  delete diff._id;
  let auth = getAuth();
  let token = await auth.currentUser.getIdToken();
  
  // send the diff to the serve
  try {
    await HTTP.patch(`/members/${props.member._id.$oid}`, diff, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Object.assign(props.member, memberCopy.value);
    editMode.value = false;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }

};

const cancelEdit = () => {
  editMode.value = false;
  memberCopy.value = JSON.parse(JSON.stringify(props.member)); // Restore original data
};

// Format Date
const formatDate = (dateString) => {
  const date = new Date(parseInt(dateString));
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

// Load tithing history when the component is mounted
onMounted(fetchTithingRecords);
</script>

