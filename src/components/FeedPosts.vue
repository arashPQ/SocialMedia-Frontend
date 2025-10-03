<template>
    <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-6">
            <img :src="post.created_by.get_avatar" class="w-[40px] rounded-full">
            
            <p>
                <strong>
                    <RouterLink :to="{'name': 'profile', params:{'id': post.created_by.id}}">{{ post.created_by.name }}</RouterLink>
                </strong>
            </p>
        </div>
        <p class="text-gray-600">{{ post.created_at_formatted }} ago</p>
    </div>
    <p>
        {{ post.body }}
    </p>
    <br>
    <template v-if="post.attachments.length">
        <img v-for="image in post.attachments" v-bind:key="image.id" :src="image.get_image" class="w-full mb-4 rounded-lg">
    </template>

    <div class="my-6 flex justify-between">
        <div class="flex space-x-6">
            <div id="app" 
                data-initial-liked="{{ liked|yesno:'true,false' }}" 
                data-post-id="{{ post.id }}"
            >
              <button @click="toggleLike" :class="{ liked: post.is_liked }" class="like-button" :disabled="loading">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :fill="liked ? 'red' : 'none'"
                    fill="like ? 'red' : 'none'"
                    stroke="red"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                         4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 
                         16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                         11.54L12 21.35z"
                    />
                </svg>
              </button>
              <span class="likes-count">{{ post.likes_count }}</span>
            </div>

            <RouterLink :to="{'name': 'post', params:{'id': post.id}}">
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg> 
                    <span class="text-gray-500 text-xs">{{ post.comments_count }} comments</span>
                </div>
            </RouterLink>
        </div>
        <div v-if="post.is_private" class="flex items-center space-x-2 text-gray-500 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <span>Is private</span>
        </div>
        
        <div @click="toggleModal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>   
        </div>   
    </div>

    <div v-if="showtoggleModal">
        <div class="flex space-x-6 items-center">
            <div 
                class="flex items-center space-x-2" 
                @click="deletePost"
                v-if="userStore.user.id == post.created_by.id"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
 
                <span class="text-red-500 text-xs">Delete post</span>
            </div>

            <div 
                class="flex items-center space-x-2"
                @click="reportPost"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-orange-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>

                <span class="text-orange-500 text-xs">Report post</span>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { useToastStore } from '@/stores/toast';
import { useUserStore } from '@/stores/user';
import { defineComponent } from 'vue';



export default defineComponent ({
    el: '#app',
    props: {
        post: Object,
        initialLiked: Boolean,
    },

    emits: ['deletePost'],

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
            showtoggleModal: false,
            loading: false,
            postId: Number(document.getElementById('app').dataset.postId),
            liked: document.getElementById('app').dataset.initialLiked === 'true',
        };
    },


    methods: {
        async toggleLike() {
            if (this.loading) return;
            this.loading = true;

            try {
                const response = await axios.post(`/api/posts/${this.post.id}/like/`)

                if (response.data.message === 'like created') {
                    this.toastStore.showToast(5000, 'like created.', 'bg-emerald-500')
                    this.liked = true;
                    this.post.likes_count += 1
                } else {
                    this.liked = false;
                    this.post.likes_count -= 1
                    this.toastStore.showToast(5000, 'your liked removed.', 'bg-red-300')
                }
                
                
            } catch (error) {
              console.error('Error toggling like:', error);
            } finally {
              this.loading = false;
            }
        },
        getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
                }
              }
            }
            return cookieValue;
        },
        toggleModal() {
            this.showtoggleModal = !this.showtoggleModal

        },
        deletePost() {
            this.$emit('deletePost', this.post.id)            
            axios.delete(`/api/posts/${this.post.id}/delete/`)
            .then(response => {
                if (response.data.message == 'post deleted.'){
                    this.toastStore.showToast(5000, 'post deleted.', 'bg-red-300')
                }
            })
            .catch(error => {
                console.log(error);
                
            })
        },
        reportPost() {
            axios.post(`/api/posts/${this.post.id}/report/`)
            .then(response => {
                console.log(response.data);
                if (response.data.message == 'post reported.'){
                    this.toastStore.showToast(5000, 'post reported.', 'bg-orange-300')
                }
                
            })
            .catch(error => {
                console.log(error);
                
            })
        }
    }
})
</script>
<style scoped>
.like-button {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: gray;
  transition: color 0.3s;
}
.like-button.liked {
  color: red;
}
.like-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>