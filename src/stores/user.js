import { defineStore } from "pinia";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import router from "@/router/router";
import { useDatabaseStore } from "./database";






export const useUserStore = defineStore("userStore", {   
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
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
                this.userData = { mail: user.email, uid: user.uid };
                router.push("/");
            } catch (error) {
                console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true;
            try {
                const { user } = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                this.userData = { mail: user.email, uid: user.uid };
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