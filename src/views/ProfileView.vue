<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img src="https://i.pravatar.cc/300?img=60" class="mb-6 rounded-full">
                <p><strong>{{ user.username }}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around">
                    <RouterLink :to="{'name': 'followers', params:{'username': user.username}}">
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
            <div 
                class="p-4 bg-white border border-gray-200 rounded-lg"
                v-if="userStore.user.id === user.id"
            >
                <form v-on:submit.prevent="submitForm" action="" method="post">
                    <div class="p-4">
                        <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What are you thinking about ?!"></textarea>
                    </div>
                    <div class="p-4 border-t border-gray-100 flex justify-between">
                        <a href="" class="inline-block py-4 px-6 bg-gray-600 text-white rounded-lg">
                            Article image
                        </a>
                        <button :disabled="!isButtonEnabled" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                            Post
                        </button>
                    </div>
                </form>
            </div>


            <div class="p-4 bg-white border border-gray-200 rounded-lg" v-for="post in posts" v-bind:key="post.id">
                <FeedPosts v-bind:post="post" />
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import FeedPosts from '@/components/FeedPosts.vue';

export default {
    name: "FeedView",

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
            posts: [],
            user: {},
            body: '',
        }
    },

    mounted() {
        this.getFeed()
    },

    watch: {
        '$route.params.id': {
            handler: function() {
                this.getFeed()
            },
            deep: true,
            immadiate: true
        }
    },

    computed: {
        isButtonEnabled() {
            const textWithoutSpaces = this.body.replace(/[\s\u200C]/g, '');
            return textWithoutSpaces.length > 0;
        }
    },

    methods: {
        getFeed() {
            axios
            .get(`/api/posts/profile/${this.$route.params.username}/`)
            .then(response => {
                this.posts = response.data.posts
                this.user = response.data.user
            })
            .catch(error => {
                console.log('error', error);
                
            })
        },

        submitForm() {
            axios
            .post('/api/posts/create/', {
                'body': this.body
            })
            .then(response => {
                this.posts.unshift(response.data)
                this.body = ''
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
            
        },
        follow() {
            axios
            .post(`/api/followers/request/${this.$route.params.username}/`, {
                
            })
            .then(response => {
                console.log('data: ', response.data);
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
        },
    }
}


</script>