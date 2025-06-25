<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <FeedForm v-bind:user="null" v-bind:posts="posts" />
            </div>


            <div class="p-4 bg-white border border-gray-200 rounded-lg" v-for="post in posts" v-bind:key="post.id">
                <FeedPosts 
                v-bind:post="post" 
                v-on:deletePost="deletePost" />
            </div>
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />
            <Trends />


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
import { defineComponent } from 'vue';
import Trends from '@/components/Trends.vue';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow.vue';
import FeedPosts from '@/components/FeedPosts.vue';
import { useUserStore } from '@/stores/user';
import FeedForm from '@/components/FeedForm.vue';


export default defineComponent({
    name: "FeedView",
    setup(){
        const userStore = useUserStore()
        return {
            userStore
        }
    },
    components:{
        Trends,
        PeopleYouMayKnow,
        FeedPosts,
        FeedForm
    },

    data() {
        return {
            posts: [],
            notifs: [],
            body: '',
            url: '',
        }
    },

    mounted() {
        this.getFeed()
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
            .get('/api/posts/')
            .then(response => {
                this.posts = response.data.serializer
                this.notifs = response.data.notif_count
            })
            .catch(error => {
                console.log('error', error);
                
            })
        },
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
        },
        
        deletePost(id) {
            this.posts = this.posts.filter(post => post.id !== id)
            
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
    }
})


</script>