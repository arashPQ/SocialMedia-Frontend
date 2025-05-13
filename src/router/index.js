import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import FeedView from '@/views/FeedView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MessagesView from '@/views/MessagesView.vue'
import SearchView from '@/views/SearchView.vue'
import FriendsView from '@/views/FriendsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: SigninView,
    },
    {
      path: '/feed',
      name: 'feed',
      component: FeedView,
    },
    {
      path: '/profile/:username/',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView,
    },
    {
      path: '/Search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/followers/:username/',
      name: 'followers',
      component: FriendsView,
    },
  ],
})

export default router
