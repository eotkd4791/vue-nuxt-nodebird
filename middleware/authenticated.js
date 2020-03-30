export default function({ store, redirect }) { //함수의 인자는 원래 context
  if(!store.state.users.me) {
    redirect('/');
  }
}