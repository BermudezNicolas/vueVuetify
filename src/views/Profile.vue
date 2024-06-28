<template>
  <div>
    <v-overlay v-model="showEditOverlay" class="d-flex align-center justify-center">
      <v-card style="width: 400px;" class="v-card">
        <v-card-title class="card__title text-h4 mb-2" >Alias</v-card-title>
        <v-card-text>
          <v-text-field clearable color="primary" v-model="editedAlias" variant="outlined" label="Username" prepend-inner-icon="mdi-account" :loading="loading" :rules="aliasRules"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="flat" density="compact" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-container class="ml-0 pl-0">
      <v-fade-transition>
          <v-alert
          text=" An email has been sent to your account!"
          closable
          title="Verify your email"
          type="info"
          border="end"
          v-show="alertActivated"
          class="mb-2 opacity-100"
          style="position: absolute; z-index:100"
        ></v-alert>
      </v-fade-transition>
      <v-row no-gutters>
        <v-col cols="auto" class="d-flex align-center justify-center">
          <div>
            <v-hover v-slot="{ isHovering, props }">
              <v-avatar
                class="ml-3"
                :class="{enlarge : isHovering}"
                size="90"
                color="primary"
                width="100"
                height="100"
                v-bind="props"
              >
                <v-img
                  v-if="
                    userStore.userData !== null &&
                    userStore.userData.photoUrl !== null
                  "
                  :src="userStore.userData.photoUrl"
                ></v-img>
                <v-fade-transition>
                  <div
                    v-if="isHovering"
                    class="overlay d-flex bg-grey-lighten-4 v-card--reveal text-h7"
                    style="opacity: 0.6"
                  >
                    <v-btn
                      @click="handleImageChange()"
                      variant="flat"
                      density="compact"
                      color="black"
                      class="ma-6"
                      :ripple="false"
                      >Change it</v-btn
                    >
                  </div>
                </v-fade-transition>
              </v-avatar>
            </v-hover>
          </div>
        </v-col>
        <v-col cols="auto" class="d-flex align-center ml-2">
          <v-hover open-delay="100">
            <template v-slot="{ isHovering, props }" class="pa-1">
              <v-btn
                v-if="!userStore.userData?.displayName"
                v-bind="props"
                variant="text"
                :ripple="false"
                :class="{ 'on-hover': isHovering, 'blue-border': isHovering }"
                color="blue-lighten-5"
                @click="showEditOverlay = !showEditOverlay"
              >  
                <p v-if="!userStore.userData?.phoneNumber" class="text-h5">{{ userStore.userData?.email.split("@")[0] }}</p>
                <p v-else class="text-h5">{{ userStore.userData.displayName }}</p>

                <v-fade-transition>
                  <v-btn
                    v-if="isHovering"
                    :ripple="false"
                    class="item ml-2"
                    color="white"
                    icon="mdi-pencil"
                    variant="text"
                    size="x-small"
                  >
                  </v-btn>
                </v-fade-transition>
              </v-btn>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
    <v-divider
      class="border-opacity-100 mt-2"
      :thickness="2"
      color="grey-lighten-4"
    >
    </v-divider>
    <v-container class="d-flex flex-column mx-auto my-9">
      
      <HoverSettings class="mb-4">
            <template v-slot:updateBtn>
              <v-btn v-if="!showCard" icon color="transparent"  elevation="0"   @click="toggleCard()">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>  
            <h4 class="text-grey-lighten-4 overlay text-center">E-mail: {{userStore.userData?.email}} </h4>
  
              <v-fade-transition>
                  <EmailCard v-show="showCard">
                    <template #cancelCard>
                      <v-btn
                      class="mr-2"
                      color="red"
                      density="compact"
                      @click="toggleCard()"
                      >Cancel</v-btn
                    >
                    </template>
                </EmailCard>
              </v-fade-transition>
  
      </HoverSettings>
       
      <HoverSettings  class="mb-4" >
        <template v-slot:updateBtn> 
          <v-btn icon  color="transparent" elevation="0" class="ml-4" @click="resetPassword()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>    
        <template v-slot:default>
          <h4 class="text-grey-lighten-4 text-center overlay">Password: ****** </h4>
        </template>
      </HoverSettings >
      <HoverSettings>
        <template v-slot:updateBtn>
          <v-btn icon  color="transparent" elevation="0" class="ml-4">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>    
        <template v-slot:default>
          <h4 class="text-grey-lighten-4 text-center overlay">Phone: {{userStore.userData?.phoneNumber}} </h4>
        </template>
      </HoverSettings>
    </v-container>
    <Vue3Marquee :clone="true" :duration="5" class="mt-10" :pause-on-hover="true">
      <span class="mx-4 text-grey-lighten-4 overlay text-h4">Url</span>
      <span class="mx-4 text-blue-lighten-4 overlay">Site</span>
    </Vue3Marquee>
    <Vue3Marquee direction="reverse" :clone="true" :duration="5" class="mt-2" :pause-on-hover="true">
      <span class="mx-4 text-grey-lighten-4 overlay">Url</span>
      <span class="mx-4 text-blue-lighten-4 overlay text-h4">Site</span>
    </Vue3Marquee>
  </div>
</template>

<script setup>

import { useUserStore } from "@/stores/user";
import { useDatabaseStore } from "@/stores/database";
import HoverSettings from "@/components/HoverSettings.vue";
const userStore = useUserStore();8
import {ref} from "vue"
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import EmailCard from "@/components/EmailCard.vue"



const handleImageChange = () => {
  const storage = getStorage();
  const storageRef = ref(storage, "userImage/"); // Ruta donde se guardará la imagen

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];

    try {
      // Subir la imagen al storage
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Imagen subida con éxito:", snapshot);

      // Aquí puedes obtener la URL de descarga de la imagen para asociarla con el usuario
      const downloadURL = await getDownloadURL(snapshot.ref);
      const dataBaseStore = useDatabaseStore();
      dataBaseStore.uploadPhotoAndUpdateUser(downloadURL);
      console.log("URL de descarga:", downloadURL);

      // Lógica para asociar la URL de la imagen con el usuario en tu base de datos
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };
};
const showEditOverlay = ref(false);

const showCard = ref(false);

const toggleCard = () => {
      showCard.value = !showCard.value;
};




const alertActivated = ref(false);

const resetPassword = async () => {
  try {
    alertActivated.value = true;
    await userStore.resetPassword();
    // Oculta la alerta después de 3 segundos
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
  }
  finally{
    setTimeout(() => {
      alertActivated.value = false;
    }, 10000);
  }
};



</script>

<style>
.v-card--reveal {
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}

.v-btn .v-btn__overlay {
  transition: opacity 0.5s ease-in-out;
  background-color: transparent;
}

.v-btn:not(.on-hover) {
  opacity: 1;
  color: white
}



.blue-border {
  transition: opacity 0.5s ease-in-out;
  border: 1px solid #039BE5; /* Cambiar el color del borde a rojo */
}


.enlarge {
  transform: scale(1.03);
  transition: transform 0.2s ease-out; /* Transición al agrandar */
}


.emailCard {
  height: 500px;
}

.v-card__title{
  font-family: Poppins;
  font-size: 32px !important;
  font-weight: 500 !important;
  line-height: 48px !important;
  text-align: left;
  color: #3a3a3a !important;
}
.v-card{
  border-color: white !important;
}
</style>
