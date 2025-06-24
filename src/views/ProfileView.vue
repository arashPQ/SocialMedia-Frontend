<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img :src="user.get_avatar" class="mb-6 rounded-full">
                <p><strong>{{ user.username }}</strong></p>

                <div class="mt-6 flex space-x-8 justify-around" v-if="user.username">
                    <RouterLink :to="{'name': 'followers', params:{'id': user.id}}">
                        <p class="text-xs text-gray-500">{{ user.friends_count }} Friends</p>
                    </RouterLink>
                    <p class="text-xs text-gray-500">{{ user.posts_count }} Posts</p>
                
                </div>
                <div class="mt-6">
                    <button @click="follow" 
                        class="inline-block py-4 px-6 mr-5 bg-purple-600 text-white rounded-lg"
                        v-if="userStore.user.id !== user.id && can_send_follow_req"
                        >
                        
                        Follow
                    </button>

                    <button @click="direct" 
                        class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg"
                        v-if="userStore.user.id !== user.id"
                        >
                        
                        Direct
                    </button>

                    <RouterLink :to="{'name': 'editprofile', params:{'id': user.id}}"
                        class="inline-block py-4 px-6 mr-5 bg-purple-600 text-white rounded-lg"
                        v-if="userStore.user.id === user.id"
                        >
                        
                        Edit Profile
                    </RouterLink>

                    <button @click="logout" 
                        class="inline-block py-4 px-6 bg-red-600 text-white rounded-lg"
                        v-if="userStore.user.id === user.id"
                        >
                        
                        logout
                    </button>
                </div>
            </div>
        </div>
        <div class="main-center col-span-2 space-y-4">
            <div 
                class="p-4 bg-white border border-gray-200 rounded-lg"
                v-if="userStore.user.id === user.id"
            >
                <FeedForm v-bind:user="user" v-bind:posts="posts" />
            </div>


            <div class="p-4 bg-white border border-gray-200 rounded-lg" v-for="post in posts" v-bind:key="post.id">
                <FeedPosts v-bind:post="post" />
            </div>
        </div>
    </div>
</template>


<style>
input[type="file"] {
    display: none;
}

</style>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import FeedPosts from '@/components/FeedPosts.vue';
import { useToastStore } from '@/stores/toast';
import FeedForm from '@/components/FeedForm.vue';


export default {
    name: "FeedView",

    components: {
        FeedPosts,
        FeedForm
    },

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore,
            toastStore,
        }
    },


    data() {
        return {
            posts: [],
            user: {
                id: ''
            },
            body: '',
            url: '',
            is_private: false,
            can_send_follow_req: null
            
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
        direct() {
            axios.get(`/api/chat/${this.$route.params.id}/direct/`)
            .then(response => {
                console.log(response.data);
                this.$router.push('/chat')
                
            })
            .catch(error => {
                console.log('error', error);
                
            })
        },

        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
        },

        getFeed() {
            axios
            .get(`/api/posts/profile/${this.$route.params.id}/`)
            .then(response => {
                this.posts = response.data.posts
                this.user = response.data.user
                this.can_send_follow_req = response.data.can_send_follow_req
            })
            .catch(error => {
                console.log('error', error);
                
            })
        },

        submitForm() {
            let formData = new FormData()
            formData.append('image', this.$refs.file.files[0])
            formData.append('body', this.body)
            formData.append('is_private', this.is_private)
            axios
            .post('/api/posts/create/', formData, {
                headers: {'Content-Type': "multipart/form-data"}
            })
            .then(response => {
                this.posts.unshift(response.data)
                this.body = ''
                this.$refs.file.value = null
                this.url = null
                this.user.posts_count += 1
                this.is_private = false
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
            
        },
        follow() {
            axios
            .post(`/api/followers/request/${this.$route.params.id}/`)
            .then(response => {
                this.can_send_follow_req = false
                if (response.data.message == 'request already sent') {
                    this.toastStore.showToast(5000, 'request already sent.', 'bg-red-300')
                } else {
                    this.toastStore.showToast(5000, 'request sent.', 'bg-emerald-500')
                }
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
        },
        logout() {
            this.userStore.removeToken()
            this.toastStore.showToast(5000, 'we hope you came back!', 'bg-red-300')
            this.$router.push('/login')
        }
    }
}


</script>