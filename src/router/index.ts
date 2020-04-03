import MarkdownBody from '@/components/MarkdownBody.vue'
import CategoryList from '@/components/CategoryList.vue'
import EditorStage from '@/components/EditorStage.vue'
import VueRouter from 'vue-router'
import NoteList from '@/components/NoteList.vue'
import Textarea from '@/components/Textarea.vue'
import Setting from '../views/Setting.vue'
import Editor from '../views/Editor.vue'
import Info from '../views/Info.vue'
import Home from '../views/Home.vue'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/editor',
    component: Editor,
    children: [
      {
        path: 'categories/:categoryId?/notes/:noteId?',
        components: {
          category: CategoryList,
          note: NoteList,
          main: EditorStage,
        },
        children: [
          {
            path: '',
            name: 'Markdown',
            component: MarkdownBody,
          },
          {
            path: 'editor',
            name: 'Editor',
            component: Textarea,
          },
        ],
      },
    ],
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
