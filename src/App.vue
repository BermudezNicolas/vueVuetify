<template>
   <v-app>
      <NavBar></NavBar>
      <v-main>
        <v-snackbar
          v-model="userStore.logInSuccess"
          variant="tonal"
          color="primary"
        >
          <p class="text-center"> Welcome back  {{ userStore.userData.mail }}!!</p>
        </v-snackbar>
        {{ userStore.userData?.uid }}
        <RouterView></RouterView>
      </v-main>
   </v-app>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { RouterView } from 'vue-router';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './stores/user';
import { useDatabaseStore } from './stores/database';
import { onMounted} from "vue";

const userStore = useUserStore();
let auth;
onMounted( () => {
  auth = getAuth();
  onAuthStateChanged(auth,  (user) => {
    if (user) {
      console.log(user)
      userStore.userData = user;
    } else {
      console.log('no')
      const databaseStore = useDatabaseStore();
      databaseStore.$reset();
    }
  });
});

</script>
