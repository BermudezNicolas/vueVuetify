<template>
   <v-app>
      <NavBar v-if="!$vuetify.display.mobile"/>
      <MobileNavBar v-else/>
      <v-main class="main">     
        <router-view v-slot="{ Component }">
          <v-slide-x-reverse-transition mode="out-in">
            <component :is="Component" />
          </v-slide-x-reverse-transition>
        </router-view>       
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
import MobileNavBar from './components/MobileNavBar.vue';

const userStore = useUserStore();
let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        await userStore.setUserProfile(user)
      } else {
        console.log('no');
        userStore.userData = null; // Restablecer los datos del usuario
        const databaseStore = useDatabaseStore();
        databaseStore.$reset();
      }
    });
  }
);
  


</script>


<style>
.route-enter-from {
  opacity: 0;
  transform: translateY(100px)
}
.route-enter-active,
.route-leave-active {
  transition: all .2s ease-out
}
.route-leave-to {
  opacity: 0;
  transform: translateY(100px)
}


.main {
  background-color:rgb(42, 41, 41);
}


</style>