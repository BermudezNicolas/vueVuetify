import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Edit from "../views/Edit.vue"
import { useUserStore } from "@/stores/user";
import { onAuthStateChanged, getAuth} from "firebase/auth";

const routes = [
  { 
    path: '/',
    name: 'home',
    component: Home, // Utiliza el componente Home importado
    meta: {requiresAuth:true}
  },
  {
    path:'/edit',
    name: 'edit',
    component: Edit,
    meta:{requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  }
]





const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
});


const getCurrentUser = () => {
  return new Promise((resolve,reject) => {
    const removeListener = onAuthStateChanged(getAuth(),(user) => {
      removeListener();
      resolve(user);
      },
      reject
    );
 })
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const userStore = useUserStore()
    userStore.loadingSession = true;
    if ( await getCurrentUser()) {
      userStore.loadingSession = false
      next();
    } else {
      userStore.loadingSession = false
      next('/login');
    }
  } else {
    next();
  }
})



export default router;
