export const state = () => ({
  me: null,
  followerList: [],
  followingList: [], 
  hasMoreFollowing: true,
  hasMoreFollower: true,
});

const limit = 3;
const totalFollowings = 8;
const totalFollowers = 6;

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
  changeNickname(state, payload) {
    state.me.nickname = payload.nickname;
  },
  addFollower(state, payload) {
    state.followerList.push(payload);
  },
  addFollowing(state, payload) {
    state.followingList.push(payload);
  },
  removeFollower(state, payload) {
    const index = state.followerList.findIndex(v => v.id === payload.id);
    state.followerList.splice(index, 1);
  },
  removeFollowing(state, payload) {
    const index = state.followingList.findIndex(v => v.id === payload.id);
    state.followingList.splice(index, 1);
  },
  loadFollowings(state) {
    const diff = totalFollowings - state.followingList.length;
    const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));
    state.followingList = state.followingList.concat(fakeUsers);
    state.hasMoreFollowing = fakeUsers.length === limit;
  },
  loadFollowers(state) {
    const diff = totalFollowers - state.followerList.length;
    const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));
    state.followerList = state.followerList.concat(fakeUsers);
    state.hasMoreFollower = fakeUsers.length === limit;
  }
};

export const actions = {
  signUp({ commit, state }, payload) {
     this.$axios.post('http://localhost:3085/user', {
       email: payload.email,
       nickname: payload.nickname,
       password: payload.password
     }, {
       withCredentials: true, //다른서버로 요청보낼때 true로 해준다. 다른 포트간에 쿠키심어줄라고 씀.
     })
      .then((res) => {
        commit('setMe', res.data);
     })
      .catch((err) => {
        console.error(err);
     });
  },
  logIn({ commit }, payload) {
    this.$axios.post('http://localhost:3085/user/login', {
       email: payload.email,
       password: payload.password
     }, {
       withCredentials: true,
     })
      .then((res) => {
        commit('setMe', res.data);
     })
      .catch((err) => {
         console.error(err);
     });
  },
  logOut({ commit }, payload) {
    this.$axios.post('http://localhost:3085/user/logout', {}, {
      withCredentials: true,
    })
      .then((data) => {
        commit('setMe', null);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  changeNickname({ commit }, payload) {
    commit('changeNickname', payload);
  },
  addFollowing({ commit }, payload) {
    commit('addFollowing', payload);
  },
  addFollower({ commit }, payload) {
    commit('addFollower', payload);
  },
  removeFollowing({ commit }, payload) {
    commit('removeFollowing', payload);
  },
  removeFollower({ commit }, payload) {
    commit('removeFollower', payload);
  },
  loadFollowings({ commit, state }, payload) {
    if(state.hasMoreFollowing) {
      commit('loadFollowings',payload);
    }
  },
  loadFollowers({ commit, state }, payload) {
    if(state.hasMoreFollower) {
      commit('loadFollowers', payload);
    }
  }
}