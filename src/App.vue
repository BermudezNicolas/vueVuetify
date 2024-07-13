<template>
   <v-app>
      <NavBar v-if="!$vuetify.display.mobile"/>
      <MobileNavBar v-else/>
       <v-main class="main">     
        <router-view v-slot="{ Component }">
          <v-progress-linear  v-model="value" :buffer-value="bufferValue" color="primary"></v-progress-linear>
          <v-slide-y-transition mode="out-in">
            <component :is="Component" />
          </v-slide-y-transition>
        </router-view>       
      </v-main>
   </v-app>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { RouterView, useRoute } from 'vue-router';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './stores/user';
import { useDatabaseStore } from './stores/database';
import { onMounted, ref, watch, onBeforeUnmount} from "vue";
import MobileNavBar from './components/MobileNavBar.vue';

const userStore = useUserStore();
const route = useRoute()
// Llama a la función para cargar la siguiente vista




const value = ref(0);
const bufferValue = ref(0);
const interval = ref(null);
const showProgress = ref(false);

watch(() => route.fullPath, async () => {
    showProgress.value = true;
    value.value = 0;
    bufferValue.value = 0;
    
    clearInterval(interval.value);
    interval.value = await setInterval(() => {
      value.value += 0.5;
      bufferValue.value += 0.5;
      
      if (value.value === 100) {
        showProgress.value = false;
        clearInterval(interval.value); // Detener el intervalo una vez que se alcanza 100
        
        // Esperar un breve momento antes de resetear los valores
        setTimeout(() => {
          value.value = 0; // Resetear el valor de 'value'
          bufferValue.value = 0; // Resetear el valor de 'bufferValue'
        }, 140); // Aquí puedes ajustar el tiempo de espera según tus necesidades
      }
      
    }, 1);
});

onBeforeUnmount(() => {
    clearInterval(interval.value)
  })


let auth;
onMounted(() => {
  clearInterval(interval.value)

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