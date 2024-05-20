<template>
  <v-main>
   <AddForm></AddForm>
   <v-container class=" border-xl mb-8 elevation-3 border-info border-double">
       <p class="text-h2 font-weight-medium text-center mb-3">Urls</p>
       <v-divider :thickness="3" color="info" class="mb-2" ></v-divider>
       <v-row no-gutters justify="center">
           <v-col cols="6"   v-for="doc of databaseStore.documents" :key="doc.id">
               <v-card class="ma-3 pa-2" elevation="8" border rounded>           
                    <p class="font-weight-bold text-high-emphasis text-h5">Id: {{ doc.id }}</p>
                    <br>
                    <p class="font-weight-bold text-high-emphasis text-h5">Url: {{ doc.name }}</p>
                    <br>
                    <p class="font-weight-bold text-high-emphasis text-h5">Short: {{ doc.short }}</p>
                    <div class="text-center">
                        <v-btn  elevation="4" color="primary" density="compact"  class="rounded-lg mb-2" block  @click="router.push(`/edit/${doc.id}`)">
                          Edit                                            
                        </v-btn>
                        <v-btn elevation="3" color="error" class="rounded-lg" density="compact" @click="databaseStore.deleteUrl(doc.id)">Delete</v-btn> 
                    </div>
                </v-card>
           </v-col>
       </v-row>
   </v-container>

  </v-main>

 
</template>

<script setup>
import AddForm from '../components/AddForm.vue';
import { useUserStore } from '@/stores/user';
import { useDatabaseStore } from '@/stores/database';

import {ref} from 'vue';
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router';


const router = useRouter();

const handleUpdate = async (docId, newUrl) => {
    try{
        console.log(docId,newUrl)
        await databaseStore.updateUrl(docid, newUrl);
        overlay.value = false; // Oculta la tarjeta de edición después de hacer clic en "Edit"
    } catch (error) {
        console.log(error.message);
    }
};


const userStore = useUserStore();
const databaseStore = useDatabaseStore();





databaseStore.getUrls()


</script>