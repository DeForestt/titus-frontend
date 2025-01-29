<template>
<Splitter style="height: 100vh" class="mb-8" >
  <SplitterPanel class="flex items-center justify-center" :size="70">
    <MembersList
      @selectUser="selectedMember = $event"
      @unselectUser="selectedMember = null"
    />
  </SplitterPanel>
  <SplitterPanel class="flex"
    v-if="selectedMember" :size="30"
  > 
    <MemberInfo
      :member="selectedMember"
    />
  </SplitterPanel>
</Splitter>
</template>


<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { store, HTTP } from "../store";
import axios from "axios";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ChurchInfo from "../components/ChurchInfo.vue";
import UserInfo from "../components/UserInfo.vue";
import MembersList from "../components/MembersList.vue";
import MemberInfo from "../components/MemberInfo.vue";
import { getChurch, getMe, getMembers } from "../utils";

const auth = getAuth();
const router = useRouter();
const response = ref(null);
const selectedMember = ref(null);

onBeforeMount( () => {
  const user = auth.currentUser;
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("No user found");
      router.push("/sign-in");
      return;
    }
    let token = await user.getIdToken();
    store.user = await getMe(token);
    if (! store.user) {
      router.push("/onboarding");
    }
    store.church = await getChurch(token);
    if (! store.church) {
      router.push("/onboarding");
    }
    store.members = await getMembers(token);
  });

});

</script>

