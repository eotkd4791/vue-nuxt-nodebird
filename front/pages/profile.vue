<template>
  <div>
    <v-container>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>내 프로필</v-subheader>
          <v-form v-model="valid" @submit.prevent="onChangeNickname">
            <v-text-field
              v-model="nickname"
              label="닉네임"
              required
              :rules="nicknameRules"
            />
            <v-btn dark color="green" type="submit">수정</v-btn>
          </v-form>
        </v-container>
      </v-card>
      <v-card style="margin-bottom:20px">
        <v-container>
          <v-subheader>팔로잉</v-subheader>
          <follow-list :users="followingList" :remove="removeFollowing" />
          <v-btn @click="loadFollowings" v-if="hasMoreFollowing" dark style="width: 100%" color="green">더보기</v-btn>
        </v-container>
      </v-card>
      <v-card style="margin-bottom:20px">
        <v-container>
          <v-subheader>팔로워</v-subheader>
          <follow-list :users="followerList" :remove="removeFollower" />
          <v-btn @click="loadFollowers" v-if="hasMoreFollower" dark style="width: 100%" color="green">더보기</v-btn>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import FollowList from '../components/FollowList.vue';
export default {
  components: {
    FollowList,
  },
  data() {
    return {
      valid: false,
      nickname: '',
      nicknameRules: [
        v => !!v || '변경할 닉네임을 입력하세요.',
      ],
    };
  },
  computed: {
    followerList() {
      return this.$store.state.users.followerList;
    },
    followingList() {
      return this.$store.state.users.followingList;
    },
    hasMoreFollowing() {
      return this.$store.state.users.hasMoreFollowing;
    },
    hasMoreFollower() {
      return this.$store.state.users.hasMoreFollower;
    }
  },
  fetch({ store }) {
    store.dispatch('users/loadFollowings');
    store.dispatch('users/loadFollowers');
  },
  methods: {
    onChangeNickname() {
      this.$store.dispatch('users/changeNickname', {
        nickname: this.nickname,
      });
    },
    removeFollowing(id) {
      this.$store.dispatch('users/removeFollowing', { id });
    },
    removeFollower(id) {
      this.$store.dispatch('users/removeFollower', { id });
    },
    loadFollowings() {
      this.$store.dispatch('users/loadFollowings');
    },
    loadFollowers() {
      this.$store.dispatch('users/loadFollowers');
    },
  },
  head() {
    return {
      title: '프로필',
    };
  },
  middleware: 'authenticated'
}
</script> 

<style>

</style>