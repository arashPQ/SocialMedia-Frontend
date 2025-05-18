<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">

        <div class="main-center col-span-3 space-y-4">
            <div 
                class="p-4 bg-white border border-gray-200 rounded-lg" 
                v-if="post.id"
                >
                <FeedPosts v-bind:post="post" />
            </div>
            <div 
                class="p-4 ml-16 bg-white border border-gray-200 rounded-lg" 
                v-for="comment in post.comments" v-bind:key="comment.id"
                >
                <PostComments v-bind:comment="comment" />
            </div>
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <form v-on:submit.prevent="submitForm" action="" method="post">
                    <div class="p-4">
                        <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What in your mind ?!"></textarea>
                    </div>
                    <div class="p-4 border-t border-gray-100">
                        <button :disabled="!isButtonEnabled" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                            add comment
                        </button>
                    </div>
                </form>
            </div>
            
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />
            <Trends />


        </div>
    </div>
</template>


<script>
import axios from 'axios';
import Trends from '@/components/Trends.vue';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow.vue';
import FeedPosts from '@/components/FeedPosts.vue';
import { useUserStore } from '@/stores/user';
import PostComments from '@/components/PostComments.vue';
import { useToastStore } from '@/stores/toast';


export default {
    name: "PostDetailView",
    setup(){
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore,
            toastStore
        }
    },
    components:{
        Trends,
        PeopleYouMayKnow,
        FeedPosts,
        PostComments
    },

    data() {
        return {
            body: '',
            post: {
                id: null,
                comments: []
            },
        }
    },

    mounted() {
        this.getPost()
    },
    computed: {
        isButtonEnabled() {
            const textWithoutSpaces = this.body.replace(/[\s\u200C]/g, '');
            return textWithoutSpaces.length > 0;
        }
    },

    methods: {
        getPost() {
            axios
            .get(`/api/posts/${this.$route.params.id}/`)
            .then(response => {
                this.post = response.data.post
            })
            .catch(error => {
                console.log('error', error);
            })
        },

        submitForm() {
            axios
            .post(`/api/posts/${this.$route.params.id}/add_comment/`, {
                'body': this.body
            })
            .then(response => {
                this.post.comments.unshift(response.data)
                this.post.comments += 1
                this.body = ''
                this.toastStore.showToast(5000, 'comment added.', 'bg-emerald-500')
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
            
        }
    }
}


</script>