<template>
  <!-- Componente principal -->
  <div>
    <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
      height="60"
    >
      <template v-slot:image>
        <!-- Imagen de fondo con gradiente -->
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-title></v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Botón de navegación a la página de inicio -->
      <router-link to="/">
        <v-btn
          color="black"
          prepend-icon="mdi-home"
          variant="plain"
          height="80"
        >
          Home
        </v-btn>
      </router-link>

      <!-- Botón de navegación a la página de inicio de sesión -->
      <router-link  to="/login">
        <v-btn
          v-if="!userStore.userData"
          color="black"
          prepend-icon="mdi-login"
          variant="plain"
          height="80"
        >
          Login
        </v-btn>
      </router-link>

      <router-link to="/login">
        <v-btn
          v-if="userStore.userData"
          color="black"
          prepend-icon="mdi-login"
          variant="plain"
          height="80"
          @click="userStore.logoutUser()"
        >
          LogOut
        </v-btn>
      </router-link>

     
    </v-app-bar>
  </div>
</template>

<script setup>
// Importa la utilidad RouterLink de Vue Router dentro del bloque <script setup>
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
  

const userStore = useUserStore()



</script>
