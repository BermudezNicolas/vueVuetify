<template>
  <div v-if="userStore.userData">
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
      <v-app-bar-nav-icon
        variant="text"
        class="item"
        style="opacity:1"
        :ripple="false"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-app-bar-title
        style="color: red-accent-2"
        class="text-h5 text-wrap color-pink-lighten-5"
        color="purple"
      >
        Urls
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn variant="text" class="item" icon="mdi-redo" to="/login"></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :location="'left'" temporary class="w-auto" theme="dark"  :style="{background: 'linear-gradient(to top right, rgba(19,84,122,1), rgba(128,208,199,1)'}" >
        <v-list>
          <v-list-item :title="userStore.userData.displayName" :prepend-avatar="userStore.userData.photoUrl" class="color"
          :subtitle="userStore.userData.email"></v-list-item>
        </v-list>
        <v-divider :thickness="3" color="white" style="opacity: .9;"></v-divider>
       <v-list :items="items" class="listItem"> </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import "../gradientAnimationStyles.css";

const userStore = useUserStore();

const items = [
  {
    title: "Home",
    props: {
      prependIcon: "mdi-home",
      to:"/",
    },
  },
  {
    title: "Account",
    children: [
      {
        title: "Profile",
        props: {
         appendIcon: "mdi-pencil",
          to: "/profile"
        }
      },
      {
        title: "Logout",
        props: {
          appendIcon: " mdi-exit-to-app",
          to: "/login"
        }
      }
    ],
    props: {
      prependIcon: "mdi-account"
    }
    
  }
   
  
];

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});
</script>
