<template>
    <form v-on:submit.prevent="submitForm" action="" method="post">
        <div class="p-4">
            <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What are you thinking about ?!"></textarea>
            <label>
                <input type="checkbox" v-model="is_private"> Private
            </label>
            <div id="preview" v-if="url">
                <img :src="url" class="rounded-lg w-[100px] mt-4" />
            </div>
        </div>
        <div class="p-4 border-t border-gray-100 flex justify-between">
            <label class="inline-block py-4 px-6 bg-gray-600 text-white rounded-lg">
                <input type="file" ref="file" @change="onFileChange" />
                Attach image
            </label>
            <button :disabled="!isButtonEnabled" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                Post
            </button>
        </div>
    </form>
</template>


<script>
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent ({
    name: "FeedView",


    props: {
        user: Object,
        posts: Array
    },

    data() {
        return {
            body: '',
            url: '',
            is_private: false,         
        }
    },

    computed: {
        isButtonEnabled() {
            const textWithoutSpaces = this.body.replace(/[\s\u200C]/g, '');
            return textWithoutSpaces.length > 0;
        }
    },

    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
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
                if (this.user) {
                    this.user.posts_count += 1
                }
                this.is_private = false
            })
            .catch(error => {
                console.log('error: ', error);
                
            })
        },
    }
})


</script>