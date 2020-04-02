import Vue from 'vue'
import Vuex from 'vuex'
import { IUserStore } from './user'
import { INoteStore } from './note'
import { ICategoryStore } from './category'
import { ISettingStore } from './setting'

Vue.use(Vuex)

export interface IRootState {
  user: IUserStore
  note: INoteStore
  category: ICategoryStore
  setting: ISettingStore
}

export default new Vuex.Store<IRootState>({})
