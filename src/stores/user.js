import { defineStore } from "pinia";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import router from "@/router/router";
import { useDatabaseStore } from "./database";




import {doc, getDoc, setDoc} from "firebase/firestore/lite"






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
        async loginUser(email, password,rememberMe) {
            this.loadingUser = true;
            try {
                const { user } = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.rememberMe = rememberMe;
                if (rememberMe) {
                    document.cookie = 'rememberMe=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
                    localStorage.setItem('rememberMeEmail', email);
                    localStorage.setItem('rememberMePassword', password);
                  } else {
                    document.cookie = 'rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    localStorage.removeItem('rememberMeEmail');
                    localStorage.removeItem('rememberMePassword');
                  }
                const docRef = doc(db,"users", user.uid);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    console.log('Existe el user en la coleccion');
                    this.user = {... docSnap.data()};
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
       
    },
    
});