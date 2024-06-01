<template>
   <v-app>
      <NavBar>
      </NavBar>
      <v-main>
        <v-snackbar
          v-model="userStore.logInSuccess"
          variant="tonal"
          color="primary"
        >
          <p class="text-center"> Welcome back  {{ userStore.userData.email }}!!</p>
        </v-snackbar>
        <router-view v-slot="{Component}"> <!-- obtiene la información del componente hijo a través de Vue Router, que proporciona esta información de forma dinámica según la ruta activa en ese momento. Esta información se utiliza luego para personalizar el renderizado del componente y aplicar transiciones u otros efectos visuales de forma acorde a la ruta activa. */  -->
          <v-slide-x-transition>
            <component await :is="Component" /> <!--  :is es en realidad un atajo para la directiva v-bind:is, que se utiliza en la creación de componentes dinámicos con el componente component y component es un componente especial en Vue que se utiliza para renderizar dinámicamente diferentes componentes en función de la información proporcionada en la propiedad is */ --> 
          </v-slide-x-transition>
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
