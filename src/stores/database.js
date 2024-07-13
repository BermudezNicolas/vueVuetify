import { defineStore } from "pinia";
import {auth} from "../firebase/firebaseConfig"
import router from "../router/router"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { db } from "../firebase/firebaseConfig";
import { nanoid } from "nanoid";
import { useUserStore } from "./user";



export const useDatabaseStore = defineStore('databaseStore', {

   state: () => ({
        documents: [],
        loadingDocs: false,
        addingDeleteDoc: false,
   }),
   
   
   actions: {
        async uploadPhotoAndUpdateUser(photoUrl) {
          try {

            // Actualizar el campo photoUrl del documento de usuario en Firestore
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {
              photoUrl: photoUrl
            });
            const userSotore = useUserStore()
            // Actualizar el store local con la nueva URL de la foto
            userSotore.userData.photoUrl = photoUrl;

          } catch (error) {
            console.error(error);
          }
        },


        async changePhone(phoneNumber) {
          try {

            // Actualizar el campo photoUrl del documento de usuario en Firestore
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {
              phoneNumber: phoneNumber
            });
            const userSotore = useUserStore()
            // Actualizar el store local con la nueva URL de la foto
            userSotore.userData.phoneNumber = phoneNumber;

          } catch (error) {
            console.log(error.code);
          }
        },
        
        

        async getUrls () {
            try {
                if(this.documents.length !== 0){
                    return;
                }
                this.loadingDocs = true
                const q = query(collection(db,'urls'), where("user", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            } catch (error) {
                console.log(error.code)
                return(error.code) 
            }
            finally {
                this.loadingDocs = false;
            }
        },


        async addUrl (name) {
            this.loadingDocs = true;
            try {
                const docObjeto = {
                    name: name,
                    short: nanoid(5),
                    user: auth.currentUser.uid
                };
                const q = query(collection(db, 'urls'))
                const docRef = await addDoc(q, docObjeto);
                this.documents.push({ id: docRef.id, ...docObjeto });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDocs = false;
            }
        },

        async readUrl(docId){
          try {
              this.loadingDocs = true;
              const docRef = doc(db, "urls", docId);
              const docSnap = await getDoc(docRef);
              
              if (!docSnap.exists()) {
                  throw new Error("No existe ese documento");
              }
              
              if (docSnap.data().user !== auth.currentUser.uid) {
                  throw new Error("Ese documento no le pertenece");
              }
              
              const url = docSnap.data().name;
      
              console.log(url);
              return url;
          } catch (error) {
              console.error(error.message);
          } finally {
              this.loadingDocs = false;
          }
        },
        
        async updateUrl(docId, name){
           try {
             this.addingOrDeleteDoc = true           
             const docRef = doc(db,"urls", docId);  // Hago referencia al doc de DOCID
             const docSnap = await getDoc(docRef);  // Me traigo el documento
             if(!docSnap.exists()){                // si no existe
               throw new Error("no existe ese documento")
             }
             if(docSnap.data().user !== auth.currentUser.uid){ // si el user del documento (uid) no es la del usuario actual o auntenticado
               throw new Error("ese documento no le pertenece")
             }
             await updateDoc(docRef, { // update del doc
               name
             })
 
             this.documents = this.documents.map((item) => item.id === docId ? {...item, name: name} : item) // Mapea todos los documentos (urls) si es el que busco lo modifica (destructuracion del objeto y update) sino me quedo con lo mismo
             router.push("/")          
           } catch (error) {
             console.log(error.message)
           }
           finally{
             this.addingOrDeleteDoc = false
 
           }
        },
 
        async deleteUrl(docId){
           try {
             this.addingOrDeleteDoc = true
             const docRef = doc(db,"urls", docId);
             const docSnap = await getDoc(docRef);
             if(!docSnap.exists()){
               throw new Error("no existe ese documento")
             }
             if(docSnap.data().user !== auth.currentUser.uid){
               throw new Error("ese documento no le pertenece")
             }
             await deleteDoc(docRef)
             this.documents = this.documents.filter(item => item.id !== docId)
           } catch (error) {
             console.log(error.message)
           }
           finally {
             this.addingOrDeleteDoc = false
           }
        }
   }
})