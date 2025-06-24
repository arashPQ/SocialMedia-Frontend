import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SignupView from '@/views/SignupView.vue'
import SigninView from '@/views/SigninView.vue'
import FeedView from '@/views/FeedView.vue'
import NotificationView from '@/views/NotificationView.vue'
import ProfileView from '@/views/ProfileView.vue'
import EditProfile from '@/views/EditProfile.vue'
import EditPassword from '@/views/EditPassword.vue'
import SearchView from '@/views/SearchView.vue'
import FriendsView from '@/views/FriendsView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import ConversationView from '@/views/ConversationView.vue'
import TrendsView from '@/views/TrendsView.vue'

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
      path: '/notifications',
      name: 'notification',
      component: NotificationView,
    },
    {
      path: '/profile/:id/',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/profile/:id/edit/',
      name: 'editprofile',
      component: EditProfile,
    },
    {
      path: '/profile/:id/editpw/',
      name: 'editpassword',
      component: EditPassword,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/followers/:id/',
      name: 'followers',
      component: FriendsView,
    },
    {
      path: '/posts/:id/',
      name: 'post',
      component: PostDetailView,
    },
    {
      path: '/chat/',
      name: 'chat',
      component: ConversationView,
    },
    {
      path: '/trends/:id/',
      name: 'trends',
      component: TrendsView,
    },
  ],
})

export default router
