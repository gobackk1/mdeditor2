import Vue from 'vue'
import Vuex from 'vuex'
import { IUserStore } from './user'
import { INoteStore } from './note'

Vue.use(Vuex)

export interface IRootState {
  user: IUserStore,
  note: INoteStore
}

export default new Vuex.Store<IRootState>({})
