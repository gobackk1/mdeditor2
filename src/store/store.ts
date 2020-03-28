import Vue from 'vue'
import Vuex from 'vuex'
import { IUserStore } from './user'
import { INoteStore } from './note'
import { ICategoryStore } from './category'

Vue.use(Vuex)

export interface IRootState {
  user: IUserStore
  note: INoteStore
  category: ICategoryStore
}

export default new Vuex.Store<IRootState>({})
