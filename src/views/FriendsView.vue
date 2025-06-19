<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img src="@/assets/go.png" class="mb-6 rounded-full">
                <p><strong>{{ user.username }}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around">
                    <RouterLink :to="{'name': 'followers'}">
                        <p class="text-xs text-gray-500">{{ user.friends_count }} Friends</p>
                    </RouterLink>
                    <p class="text-xs text-gray-500">10 Posts</p>
                
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
                <div class="p-4 text-center bg-gray-100 rounded-lg" v-for="request in followRequest" v-bind:key="request.id">
                    <img src="@/assets/go.png" class="mb-6 mx-auto rounded-full">
                    <p>
                        <strong>
                            <RouterLink :to="{'name': 'profile', params:{'username': request.created_by.username}}">{{ request.created_by.name }}</RouterLink>
                        </strong>
                    </p>
                    <div class="mt-6 flex space-x-8 justify-around">
                        <p class="text-xs text-gray-500">{{ request.created_by.friends_count }} friends</p>
                        <p class="text-xs text-gray-500">120 posts</p>
                    </div>

                    <div class="mt-6 space-x-4">
                        <button @click="handleRequest('accepted', request.created_by.id)" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                            Accept
                        </button>
                        <button @click="handleRequest('rejected', request.created_by.id)" class="inline-block py-4 px-6 bg-red-600 text-white rounded-lg">
                            Reject
                        </button>

                    </div>
                </div>
            </div>
            <hr>
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 class="text-xl">
                    Followers
                </h2><br>
                <div class="p-4 text-center bg-gray-100 rounded-lg" v-for="follower in followers" v-bind:key="follower.id">
                    <img src="@/assets/go.png" class="mb-6 mx-auto rounded-full">
                    <p>
                        <strong>
                            <RouterLink :to="{'name': 'profile', params:{'username': follower.username}}">{{ follower.name }}</RouterLink>
                        </strong>
                    </p>
                    <div class="mt-6 flex space-x-8 justify-around">
                        <p class="text-xs text-gray-500">{{ follower.friends_count }} friends</p>
                        <p class="text-xs text-gray-500">120 posts</p>
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

export default defineComponent( {
    name: "FriendsView",

    components: {
        FeedPosts
    },

    setup() {
        const userStore = useUserStore()
        return {
            userStore
        }
    },


    data() {
        return {
            user: {},
            followRequest: [],
            followers: []
        }
    },

    mounted() {
        this.getFriends()
    },


    methods: {
        getFriends() {
            axios
            .get(`/api/followers/${this.$route.params.username}/`)
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
            
        }
    }
}

)
</script>