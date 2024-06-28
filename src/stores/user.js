import { defineStore } from "pinia";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    sendEmailVerification,
    reauthenticateWithCredential,
    
} from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import router from "@/router/router";
import { useDatabaseStore } from "./database";




import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore/lite"






export const useUserStore = defineStore("userStore", {   
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
        rememberMe: false,
    }),
    actions: {
        async registerUser(email, password) {
            this.loadingUser = true;
            try {
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.userData = { email: user.email, uid: user.uid };
                router.push("/");
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        
        async setUserProfile (user){
          try {
            const docRef = doc(db,"users", user.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                console.log('Existe el user en la coleccion');
                this.userData = {... docSnap.data()};
            }
            else { 
                console.log(' No Existe el user en la coleccion')
                await setDoc(docRef, {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                });
                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                };
            }
          } catch (error) {
            console.log(error.code)
          }
        },
        
        async loginUser(email, password,rememberMe) {
            this.loadingUser = true;
            try {
                 await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.rememberMe = rememberMe;
                if (rememberMe) {
                    document.cookie = 'rememberMe=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
                    localStorage.setItem('rememberMeEmail', email);
                  } else {
                    document.cookie = 'rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    localStorage.removeItem('rememberMeEmail');
                  }
                router.push("/");
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },

        

        async logoutUser() {
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                await signOut(auth);
                this.userData = null;   
                router.push("/login");
            } catch (error) {
                console.log(error);
            }
        },

        async updateAlias(userID, name){
            try {          
              const docRef = doc(db,"users", userID);  // Hago referencia al doc de DOCID
              const docSnap = await getDoc(docRef);  // Me traigo el documento
              if(!docSnap.exists()){                // si no existe
                throw new Error("no existe ese documento")
              }
              if(docSnap.data().user !== auth.currentUser.uid){ // si el user del documento (uid) no es la del usuario actual o auntenticado
                throw new Error("ese documento no le pertenece")
              }
              await updateDoc(docRef, { // update del doc
                displayName: name
              })
  
              
            } catch (error) {
              console.log(error.message)
            }
            finally{
              this.addingOrDeleteDoc = false
  
            }
         },

        async resetPassword() {
            try {
                await sendPasswordResetEmail(auth, this.userData.email)
                console.log('yhea')
            } catch (error) {
                console.log(error.code)
            }
        },


    // Función para cambiar el correo electrónico del usuario
        async  changeEmail(newEmail) {
        this.loadingUser = true; // Indica que se está procesando la solicitud

         try {
            // Verifica si el usuario está autenticado
            if (auth.currentUser) {
                const credential = promptForCredentials();
                await reauthenticateWithCredential(user, credential).then(() => {
                    // User re-authenticated.
                  }).catch((error) => {
                    // An error ocurred
                    // ...
                  });

                // Envía un correo electrónico de verificación al nuevo correo electrónico
                await sendEmailVerification(auth.currentUser)
                .then(() => {
                  // Email verification sent!
                  // ...
                });
                console.log("Correo electrónico de verificación enviado correctamente.");

                // Actualiza el correo electrónico en Firebase Authentication
                await updateEmail(auth.currentUser,newEmail).then(() => {
                    // Email updated!
                    // ...
                  }).catch((error) => {
                    // An error occurred
                    // ...
                  });
                  

                // Actualiza la información del usuario en Firestore (opcional)
                const userDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userDocRef, {
                    email: newEmail,
                    // Otros campos que deseas actualizar
                });
                console.log("Información del usuario actualizada en Firestore.");

            } else {
                console.error("El usuario no está autenticado.");
                // Maneja el error, por ejemplo, mostrando un mensaje de error al usuario
            }
         } 
         catch (error) {
                console.error("Error al cambiar el correo electrónico:", error);
        // Maneja el error, por ejemplo, mostrando un mensaje de error al usuario
         } finally {
             this.loadingUser = false;
        }
}
  }
    
});