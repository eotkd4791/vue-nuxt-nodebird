<template>
  <v-container>
    <post-form v-if="me" />
    <div>
      <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
    </div>
  </v-container>
</template>

<script>
import PostCard from '~/components/PostCard.vue';
import PostForm from '~/components/PostForm.vue';

export default {
  components: {
    PostCard,
    PostForm,
  },
  data() {
    return {
      name:'Nuxt.js'
    }
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    },
    hasMorePost() {
      return this.$store.state.posts.hasMorePost;
    }
  },
  fetch({ store }) { //컴포넌트가 마운트되기 전(화면에 보이기 전)에 store에 비동기적으로 데이터를 넣을 떄 사용
    store.dispatch('posts/loadPosts');
  },
  mounted() { //window는 created에서 못쓰고 mounted에서 쓸 수 있다.
    window.console.log("mounted")
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      window.console.log("method gogo")
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if(this.hasMorePost) {
          this.$store.dispatch('posts/loadPosts');
        }
      }
    },
  },
};
</script>

<style>

</style>