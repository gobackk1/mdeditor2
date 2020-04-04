import {
  Mutation,
  MutationAction,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators'
import store from '@/store/store'
import firebase from 'firebase'
import Toggle from '@/interface/Toggle'
import User from '@/interface/User'

export interface IUserStore {
  loginUser: User | null
}

@Module({ dynamic: true, store, name: 'UserStore', namespaced: true })
class UserStore extends VuexModule implements IUserStore {
  public loginUser: User | null = null
  public toggle: Toggle = {
    sideBar: false,
  }

  get isLogin(): boolean {
    return !!this.loginUser
  }

  get userName(): string {
    return this.loginUser ? this.loginUser.displayName : ''
  }

  get photoURL(): string {
    if (this.loginUser) {
      console.log(this.loginUser.photoURL)
      return this.loginUser ? this.loginUser.photoURL : ''
    }
    return ''
  }

  get uid(): string | null {
    return this.loginUser ? this.loginUser.uid : null
  }

  @Mutation SET_LOGIN_USER(user: User) {
    this.loginUser = user
  }

  @Mutation DELETE_LOGIN_USER() {
    this.loginUser = null
  }

  @Mutation TOGGLE_SIDE_BAR() {
    this.toggle.sideBar = !this.toggle.sideBar
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

  @Action({}) toggleSideBar() {
    this.TOGGLE_SIDE_BAR()
  }
}

export default getModule(UserStore)
