export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
  imagePaths: [],
});
const totalPosts = 101;
const limit = 10;

export const mutations = {
  addMainPost(state, payload) {
    state.mainPosts.unshift(payload);
    state.imagePaths=[];
  },
  removeMainPost(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.id);
    state.mainPosts.splice(index, 1);
  },
  addComment(state, payload) {
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
  },
  loadPosts(state) {
    const diff = totalPosts - state.mainPosts.length;
     const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      User: {
        id: 1,
        nickname: 'stef',
      },
      content: `안녕 무한 스크롤링! ${Math.random()}`,
      Comments: [],
      Images: [],
     }));
     state.mainPosts = state.mainPosts.concat(fakePosts);
     state.hasMorePost = fakePosts.length === limit;
  },
  concatImagePaths(state, payload) {
    state.imagePaths = state.imagePaths.concat(payload); //하나만 이미지를 업로드햇다가 여러개 다시 업로드하는 경우를 고려하기 위해서 ..
  },
  removeImagePaths(state, payload) {
    state.imagePaths.splice(payload, 1);
  }
};

export const actions = {
  add({ commit }, payload) {
    this.$axios.post('http://localhost:3085/post', {
      content: payload.content,
      imagePaths: state.imagePaths, //사용자 정보를 프론트에서 요청 보내지 않는 이유는 위조될 가능성 때문이다. 누가 보냈는지에 대한 것은 서버가 판단한다.
    }, {
      withCredentials: true,
    })
      .then((res) => {
        commit('addMainPost', res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  remove({ commit }, payload) {
    commit('removeMainPost', payload);
  },
  addComment({ commit }, payload) {
    commit('addComment', payload);
  },
  loadPosts({ commit, state }, payload) {
    if(state.hasMorePost) {
      commit('loadPosts');
    }
  },
  uploadImages({ commit }, payload) {
    this.$axios.post('http://localhost:3085/post/images', payload, {
      withCredentials: true
    })
      .then((res) => {
        commit('concatImagePaths', res.data);
      })
      .catch((err => {
        console.error(err);
      }));
  }
}