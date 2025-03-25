import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/dashboard/Register.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard,
      children: [
        {
          path: '/register',
          component: Register
        }
      ]
   }
]

const router = createRouter({
  history: createWebHistory('/frontend/'),
  routes
})

export default router