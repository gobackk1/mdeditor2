import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Setting from '../views/Setting.vue'
import Info from '../views/Info.vue'
import Editor from '../views/Editor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/categories/:categoryId?/notes/:noteId?',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/categories',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/info',
    name: 'Info',
    component: Info,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
  // {
  // path: '/info',
  // name: 'Info',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
