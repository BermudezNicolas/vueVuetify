<template>
  <v-main>
   <AddForm></AddForm>
   <v-container class=" border-xl elevation-3 border-info border-double pa-2 fluid mb-5" style="width: 100%;">
       <p class="text-h2 font-weight-medium text-center mb-3">Urls</p>
       <v-divider :thickness="3" color="info" class="mb-2" ></v-divider>
       <v-row no-gutters justify="center">
           <v-col cols="12"  v-for="doc of databaseStore.documents" :key="doc.id">
               <v-card  class="pa-3 mb-2" color="#E8EAF6" elevation="8" border rounded>           
                    <p class="font-weight-bold text-high-emphasis text-h5">Id: {{ doc.id }}</p>
                    <v-divider class="my-2"/>
                    <p class="font-weight-bold text-high-emphasis text-h5">Url: {{ doc.name }}</p>
                    <v-divider class="my-2"/>
                    <p class="font-weight-bold text-high-emphasis text-h5 mb-3">Short: {{ doc.short }}</p>
                    <div class="d-flex justify-end align-center">
                        <v-btn elevation="3" color="error" class="rounded-lg mr-2" variant="outlined" density="compact" @click="databaseStore.deleteUrl(doc.id)">Delete</v-btn> 
                        <v-btn  elevation="3" color="#0091EA" density="compact"  class="rounded-lg"   @click="router.push(`/edit/${doc.id}`)">
                            Edit                                            
                          </v-btn>
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


