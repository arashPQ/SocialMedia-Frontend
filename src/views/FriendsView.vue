<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img :src="user.get_avatar" class="mb-6 rounded-full">
                <p><strong>{{ user.username }}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around">
                    <RouterLink :to="{'name': 'followers'}">
                        <p class="text-xs text-gray-500">{{ user.friends_count }} Friends</p>
                    </RouterLink>
                    <p class="text-xs text-gray-500">{{ user.posts_count }} Posts</p>
                
                </div>
                <div class="mt-6" v-if="userStore.user.id !== user.id">
                    <button @click="follow" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                        Follow
                    </button>
                </div>
            </div>
        </div>
        <div class="main-center col-span-2 space-y-4">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 class="text-xl">
                    Follow Requests
                </h2><br>

                <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transition-all duration-300 hover:shadow-indigo-500/50" v-for="request in followRequest" v-bind:key="request.id">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <img 
                                :src="request.created_by.get_avatar"
                                alt="User Avatar" 
                                class="w-16 h-16 rounded-full object-cover border-2 border-indigo-800 dark:border-blue-900 transition-transform duration-300 hover:scale-110"
                            >
                        </div>
                        <div>
                            <p>
                                <strong>
                                    <RouterLink :to="{'name': 'profile', params:{'id': request.created_by.id}}">{{ request.created_by.name }}</RouterLink>
                                </strong>
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between items-center">
                        <button @click="handleRequest('accepted', request.created_by.id)" class="bg-purple-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Accept
                        </button>
                        <button @click="handleRequest('rejected', request.created_by.id)" class="bg-red-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Reject
                        </button>
                        <div class="text-gray-600 text-sm">
                            <span class="text-xs text-gray-500">{{ request.created_by.friends_count }} friends</span>
                            <span class="text-xs text-gray-500 ml-5">{{ request.created_by.posts_count }} posts</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 class="text-xl">
                    Followers
                </h2><br>
                <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transition-all duration-300 hover:shadow-indigo-500/50" v-for="follower in followers" v-bind:key="follower.id">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <img 
                                :src="follower.get_avatar"
                                alt="User Avatar" 
                                class="w-16 h-16 rounded-full object-cover border-2 border-indigo-800 transition-transform duration-300 hover:scale-110"
                            >
                        </div>
                        <div>
                            <p>
                                <strong>
                                    <RouterLink :to="{'name': 'profile', params:{'id': follower.id}}">{{ follower.name }}</RouterLink>
                                </strong>
                            </p>
                        </div>
                    </div>
                    
                    <div class="mt-4 flex justify-between items-center">
                        <button 
                        @click="unfollow(follower.id)"
                        class="bg-red-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            unfollow
                        </button>
                        <div class="text-gray-600 text-sm">
                            <span class="text-xs text-gray-500">{{ follower.friends_count }} friends</span>
                            <span class="text-xs text-gray-500 ml-5">{{ follower.posts_count }} posts</span>
                        </div>
                    </div>
                </div>
            </div>


            
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/user';
import FeedPosts from '@/components/FeedPosts.vue';
import { useToastStore } from '@/stores/toast';

export default defineComponent( {
    name: "FriendsView",

    components: {
        FeedPosts
    },

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()
        return {
            userStore,
            toastStore
        }
    },


    data() {
        return {
            user: {},
            followRequest: [],
            followers: [],
            loadingUnfollow: null
        }
    },

    mounted() {
        this.getFriends()
    },


    methods: {
        getFriends() {
            axios
            .get(`/api/followers/${this.$route.params.id}/`)
            .then(response => {
                this.followers = response.data.followers                
                this.followRequest = response.data.requests
                this.user = response.data.user
            })
            .catch(error => {
                console.log('error', error);
                
            })
            
        },
        handleRequest(status, pk) {
            console.log('status: ', status);
            
            axios
            .post(`/api/followers/${pk}/${status}/`)
            .then(response =>{
                console.log('data: ', response.data);
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
            
        },
        async unfollow(userId) {
            this.loadingUnfollow = userId
            try {
                const response = await axios.post(`/api/followers/unfollow/${userId}/`)

                if (response.data.status === 'success') {
                    this.followers = this.followers.filter(f => f.id !== userId)
                    this.toastStore.showToast(5000, 'unfollow successfully', 'bg-green-300')
                }
            } catch (error) {
                if (error.response?.data?.error) {
                    this.toastStore.showToast(5000, error.response.data.error, 'bg-red-300')
                } else {
                    this.toastStore.showToast(5000, 'something wrong', 'bg-red-300')
                }
            } finally {
                this.loadingUnfollow = null
            }
        }
    }
}

)
</script>