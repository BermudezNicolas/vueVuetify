<template>
  <div>
    <v-snackbar
        v-model="snackbar"
        color="white"
        transition="fab-transition"      
        location="right"
        width="300"

      >   
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-icon icon="mdi-email" color="primary" class="mr-2"></v-icon>
              <strong class="text-subtitule-1 ">Hey there! </strong>
            </div>
            <div >
            </div>
            <div>
              <v-btn icon="mdi-close"  color="black" variant="flat" size="small" class="bg-transparent pl-9" @click="snackbar = !snackbar"> </v-btn>
              </div>
          </div>
          <div class="ml-7">
              An e-mail has been sent to your account
          </div>

              
        

      </v-snackbar>
    <v-overlay
      v-model="showEditOverlay"
      class="d-flex align-center justify-center"
    >
      <v-card style="width: 400px" class="v-card">
        <v-card-title class="card__title text-h4 mb-2">Alias</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submit" ref="aliasForm">
            <v-text-field
              clearable
              color="primary"
              v-model="editedAlias"
              variant="outlined"
              label="Username"
              prepend-inner-icon="mdi-account"
              :rules="aliasRules"
            ></v-text-field>
            <v-btn
              color="primary"
              variant="flat"
              density="compact"
              type="submit"
              >Save</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-container class="ml-0 pl-0">
      <v-hover v-slot="{isHovering, props}">
        <v-row no-gutters  :="props" :class="{enlarge : isHovering, shinny : isHovering, desEnlarge : !isHovering, profileEditPc : !$vuetify.display.mobile, profileEditMobile : $vuetify.display.mobile }" style="background-color:#3451ea;">
          <v-col cols="auto" class="d-flex align-center justify-center ml-5">
            <div>
              <v-hover v-slot="{ isHovering, props }">
                <v-avatar
                  class="ml-3"
                  :class="{ enlarge: isHovering }"
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
                  v-bind="props"
                  variant="text"
                  :ripple="false"
                  :class="{ 'on-hover': isHovering, 'whiteborder': isHovering }"
                  color="blue-lighten-5"
                  @click="showEditOverlay = !showEditOverlay"
                >
                  <strong
                    v-if="
                      !userStore.userData?.displayName &&
                      !userStore.loadingSession
                    "
                    class="text-h5"
                  >
                    {{ userStore.userData?.email.split("@")[0] }}
                  </strong>
                  <strong 
                    v-if="
                      userStore.userData?.displayName && !userStore.loadingSession
                    "
                    class="text-h5 text-white"
                  >
                    {{ userStore.userData?.displayName }}
                  </strong>
                  <v-progress-circular
                    v-if="userStore.loadingSession"
                    color="white"
                    indeterminate
                    :size="35"
                    :width="7"
                  ></v-progress-circular>
  
                  <v-fade-transition>
                    <v-btn
                      :ripple="false"
                      :class="{
                        invisible: !isHovering,
                        'on-hover': isHovering,
                        fade: isHovering,
                      }"
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
      </v-hover>
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
          <v-btn
            v-if="!showCard"
            icon
            color="transparent"
            elevation="0"
            @click="toggleCard()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <h4 class="text-grey-lighten-4 overlay text-center">
          E-mail: {{ userStore.userData?.email }}
        </h4>

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

      <HoverSettings class="mb-4">
        <template v-slot:updateBtn>
          <v-btn
            icon
            color="transparent"
            elevation="0"
            class="ml-4"
            @click="resetPassword()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <template v-slot:default>
          <h4 class="text-grey-lighten-4 text-center overlay">
            Password: ******
          </h4>
        </template>
      </HoverSettings>
      <HoverSettings>
        <template v-slot:updateBtn>
          <v-btn v-if="!showCardPhone" icon color="transparent" elevation="0" class="ml-4"  @click="toggleCardPhone()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        
          <h4 class="text-grey-lighten-4 text-center overlay">
            Phone: {{ userStore.userData?.phoneNumber }}
          </h4>
          <v-fade-transition>
            <PhoneCard v-show="showCardPhone">
              <template #cancelCard>
                <v-btn
                  class="mr-2"
                  color="red"
                  density="compact"
                  @click="toggleCardPhone()"
                  >Cancel</v-btn
                >
              </template>
            </PhoneCard>
          </v-fade-transition>
      </HoverSettings>
    </v-container>
    <v-divider
      class="border-opacity-100 mt-2"
      :thickness="2"
      color="grey-lighten-4"
    >
    </v-divider>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { useDatabaseStore } from "@/stores/database";
import HoverSettings from "@/components/HoverSettings.vue";
import { ref } from "vue";
import { ref as ref1 } from "firebase/storage"; // necesito la funcion ref de firebase para que uploadImage funcione sinoo da error,, se impoorta con otro nombre y listo
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import EmailCard from "@/components/EmailCard.vue";
import PhoneCard from "@/components/PhoneCard.vue"
import { auth } from "@/firebase/firebaseConfig";




const snackbar = ref(false)

//-----------------------

const userStore = useUserStore();


//--------------------------------------------------

// Image upload
const handleImageChange = () => {
  const storage = getStorage();
  const storageRef = ref1(storage, "userImage/"); // Ruta donde se guardará la imagen
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

//----------------------------------------
const showEditOverlay = ref(false);

//----------------------------------------

const showCard = ref(false);
const showCardPhone = ref(false)

const toggleCard = () => {
  showCard.value = !showCard.value;
};

const toggleCardPhone = () => {
  showCardPhone.value = !showCardPhone.value;
};
//---------------------------------------

const alertActivated = ref(false);

//--------------------------------------

const resetPassword = async () => {
  try {
    snackbar.value = true;
    await userStore.resetPassword();
    // Oculta la alerta después de 3 segundos
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
  } finally {
    setTimeout(() => {
      snackbar.value = false;
    }, 10000);
  }
};

//---------------- alias --------------------
const aliasRules = [
  (value) => !!value || "Required",
  (value) => value.length >= 6 || "Alias must be al least 6 characters",
  (value) => value.length < 18 || "Alias has to many characters",
];

const editedAlias = ref("");

const submit = async () => {
  const { valid, errors } = await aliasForm.value.validate();
  if (valid) {
    const error = await userStore.updateAlias(
      auth.currentUser.uid,
      editedAlias.value
    );
    if (!error) {
      showEditOverlay.value = false
      return; // no hace nada, en este caso no hubo problema con el metodo login, por lo que termina la funcion aca
    }
  }
  console.log("error1");
};

const aliasForm = ref(true);


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
  color: white;
}

.whiteborder {
  transform: opacity 1 ;
  transition: transform 2s ease-in-out;
  border: 1px solid #ffffff; /* Cambiar el color del borde a rojo */
}

.enlarge {
  transform: scale(1.03);
  transition: transform 0.5s ease-out; /* Transición al agrandar */
  box-shadow: 0 0 5px 2px rgba(230, 230, 235, 0.2);
}


.desEnlarge {
  transform: scale(1);
  transition: transform 0.5s ease-out; /* Transición al agrandar */
}


.emailCard {
  height: 500px;
}

.v-card__title {
  font-family: Poppins;
  font-size: 32px !important;
  font-weight: 500 !important;
  line-height: 48px !important;
  text-align: left;
  color: #3a3a3a !important;
}
.v-card {
  border-color: white !important;
}

.invisible {
  visibility: hidden;
}

.fade {
  transition: opacity 3s ease-in-out;
}

.background-white{
  background-color: aliceblue
}



.profileEditPc{
  border-radius: 0 50px 50px 0; width:500px; 
}



.profileEditMobile {
  border-radius: 0 50px 50px 0; width:370px;

}


</style>
