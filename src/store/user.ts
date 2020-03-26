import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from "vuex-module-decorators";
import store from "@/store/store";
import firebase from 'firebase'

export interface IUserStore {
  // TODO: loginUserの型定義
  loginUser: any;
}

@Module({ dynamic: true, store, name: 'user', namespaced: true })
class User extends VuexModule implements IUserStore {
  loginUser: any = null;

  get isLogin(): boolean {
    return !!this.loginUser
  }

  get userName(): string {
    return this.loginUser ? this.loginUser.displayName : ''
  }

  get photoURL(): string {
    return this.loginUser ? this.loginUser.photoURL : ''
  }

  get uid(): number | null {
    return this.loginUser ? this.loginUser.uid : null
  }

  @Mutation SET_LOGIN_USER(user: any) {
    this.loginUser = user
  }

  @Mutation DELETE_LOGIN_USER() {
    this.loginUser = null
  }

  @Action({}) login() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(googleAuthProvider)
  }

  @Action({}) logout() {
    firebase.auth().signOut()
  }

  @Action({}) setLoginUser(user: any) {
    this.SET_LOGIN_USER(user)
  }

  @Action({}) deleteLoginUser() {
    this.DELETE_LOGIN_USER()
  }

  // actions + mutation
  // incrementCounter decrementCounter両方をリセットするアクションとミューテーション
  // @MutationAction({ mutate: ["incrementCounter", "decrementCounter"] })
  // async resetCounter() {
  //   return {
  //     incrementCounter: 0,
  //     decrementCounter: 1000
  //   };
  // }
}

export default getModule(User);
