import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/dashboard/Register.vue'
import Query from '../views/dashboard/Query.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard,
      children: [
        {
          path: '/register',
          component: Register
        },
        {
          path: '/query',
          component: Query
        }
      ]
   }
]

const router = createRouter({
  history: createWebHistory('/frontend/'),
  routes
})

// 路由守卫，未登录时跳转到登录页面
router.beforeEach((to, from, next) => {
  console.log('to: ',to.path)
  const isLoggedIn = () => {
    // 假设通过 localStorage 检查登录状态
    console.log('获得token',localStorage.getItem('userToken'))
    return !!localStorage.getItem('userToken');
  };

  if (to.path !== '/login' && !isLoggedIn()) {
    next('/login');
  } else {
    next(); // 确保调用 next 方法
  }
});
// 添加路由跳转监听（解决菜单点击不触发的问题）
router.afterEach((to) => {
  console.log('[路由追踪] 实际跳转到:', to.path)
})

export default router