<template>
  <!-- Componente principal -->
  <div v-if="userStore.userData">
    <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
      height="60"
      fade-image
      
    >
      <template v-slot:image>
        <!-- Imagen de fondo con gradiente -->
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-title>
        <div
          style="color: red-accent-2"
          class="text-h5 text-wrap color-pink-lighten-5"
          color="purple"
        >
          Urls proyect
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-tabs v-model="tab" bg-color="transparent" color="white" >
        <v-tab  value="home"
          ><router-link to="/">
            <v-btn
              color="indigo-lighten-5"
              prepend-icon="mdi-home"
              height="80"
            >
              Home
            </v-btn> </router-link>
            
        </v-tab>   
        <v-tab value="profile">
            <router-link to="/profile">
            <v-btn
              v-if="userStore.userData"
              color="indigo-lighten-5"
              prepend-icon="mdi-account"
              height="80"
            >
              Profile
            </v-btn>
          </router-link>
        </v-tab>
        <v-tab  value="login"
          ><router-link to="/login">
            <v-btn
              v-if="userStore.userData"
              color="indigo-lighten-5"
              prepend-icon="mdi-login"
              height="80"
              @click="userStore.logoutUser()"
            >
              LogOut
            </v-btn>
          </router-link></v-tab
        >

        
      </v-tabs>
    </v-app-bar>
  </div>
</template>

<script setup>
// Importa la utilidad RouterLink de Vue Router dentro del bloque <script setup>
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
const userStore = useUserStore();


import { useRoute } from 'vue-router';



const route = useRoute();
const tab = ref('')

watch(() => route.name, (newVal, oldVal) => {
   if(newVal){
      tab.value = route.name
   }
});

</script>
