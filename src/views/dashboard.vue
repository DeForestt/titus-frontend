<template>
  <Splitter style="height: 100vh" class="mb-8">
    <SplitterPanel class="flex flex-col" :size="70">
    <Tabs :value="tab">
        <TabList>
          <Tab value="members">Members</Tab>
          <Tab value="church_info">Church Info</Tab>
          <Tab value="user_info">User Info</Tab>
          <Tab value="financial_data">Financial Data</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value="members">
            <MembersList
              @selectUser="selectedMember = $event"
              @unselectUser="selectedMember = null"
            />
          </TabPanel>
          <TabPanel value="church_info">
            <ChurchInfo />
          </TabPanel>
          <TabPanel value="user_info">
            <UserInfo />
          </TabPanel>
          <TabPanel value="financial_data">
            <FinancialData />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SplitterPanel>
    
    <SplitterPanel class="flex" v-if="selectedMember" :size="30">
      <MemberInfo :member="selectedMember" />
    </SplitterPanel>
  </Splitter>
</template>

<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store";
import { getChurch, getMe, getMembers } from "../utils";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import MembersList from "../components/MembersList.vue";
import MemberInfo from "../components/MemberInfo.vue";
import ChurchInfo from "../components/ChurchInfo.vue";
import UserInfo from "../components/UserInfo.vue";
import FinancialData from "../components/FinancialData.vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

const auth = getAuth();
const router = useRouter();
const selectedMember = ref(null);
const tab = ref("members");

onBeforeMount(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("No user found");
      router.push("/sign-in");
      return;
    }
    let token = await user.getIdToken();
    store.user = await getMe(token);
    if (!store.user) {
      router.push("/onboarding");
    }
    store.church = await getChurch(token);
    if (!store.church) {
      router.push("/onboarding");
    }
    store.members = await getMembers(token);
  });
});
</script>
