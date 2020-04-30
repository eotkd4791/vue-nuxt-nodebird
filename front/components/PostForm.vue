<template>
  <v-card style="margin-bottom: 20px">
    <v-container>
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
        <v-textarea
          v-model="content"
          outlined
          auto-grow
          clearable
          label="어떤 신기한 일이 있었나요 ?"
          :hide-details="hideDetails"
          :success-messages="successMessages"
          :success="success"
          :rules="[v => !!v.trim() || '내용을 입력하시오.']"  
          @input="onChangeTextarea"
        />
        <v-btn type="submit" color="green" absolute right>쨱쨱</v-btn>
        <input ref="imageInput" type="file" multiple hidden @change="onChangeImages" />
        <v-btn @click="onClickImageUpload" type="button">이미지 업로드</v-btn>
        <div>
          <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block">
            <img :src="`http://localhost:3085/${p}`" alt="p" style="width: 200px" />
            <div>
              <button @click="onRemoveImage(i)" type="button">제거</button>
            </div>
          </div>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      valid: false,
      hideDetails: true,
      successMessages: '',
      success: false,
      content: '',
    };
  },
  computed: {
    // ...mapState(['users/me']),
    ...mapState('users', ['me']), //users에서의 me
    ...mapState('posts', ['imagePaths']),
  },
  methods: {
    onChangeTextarea(value) {
      if(value.length) {
        this.hideDetails = true;
        this.success = false;
        this.successMessages = '';
      }
    },
    onSubmitForm() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('posts/add', {
          content: this.content,
        })
          .then(() => {
            this.content = '';
            this.hideDetails = false;
            this.success = true;
            this.successMessages = '게시글 등록 성공!';
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    onClickImageUpload() { 
      this.$refs.imageInput.click();
    },
    onChangeImages(e) {
      console.log(e.target.files); //유사배열
      const imageFormData = new FormData(); //image는 json이 아니기 때문에 formData를 사용한다. formData를 해석하기가 어렵기 때문에 multer라는 모듈을 사용한다. 
      [].forEach.call(e.target.files, (f) => { //e.target.files가 유사배열이기 때문에 배열 메소드인 forEach를 이렇게 불러옴.
        imageFormData.append('image', f);//키값은 image
      });
      this.$store.dispatch('posts/uploadImages', imageFormData);
    },
    onRemoveImage(index) {
      this.$store.commit('posts/removeImagePaths', index);
    }
  }
};
</script>

<style>

</style>