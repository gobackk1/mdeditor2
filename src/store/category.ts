import {
  Mutation,
  MutationAction,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators'
import userStore from '@/store/user'
import * as util from '@/util'
import Category from '@/interface/Category'
import firebase from 'firebase'
import store from '@/store/store'
import Vue from 'vue'

export interface ICategoryStore {
  categories: Category[]
}

@Module({ dynamic: true, store, name: 'CategoryStore', namespaced: true })
class CategoryStore extends VuexModule implements ICategoryStore {
  categories: Category[] = []

  public get getTitleById(): (categoryId: string) => string {
    return categoryId => {
      const category = this.categories.find(category => category.id === categoryId)
      return category ? category.title : ''
    }
  }

  @Mutation ADD_CATEGORY(category: Category): void {
    this.categories.push(category)
  }

  @Mutation UPDATE_CATEGORY(category: Category): void {
    const index = this.categories.findIndex(c => c.id === category.id)
    Vue.set(this.categories, index, category)
  }

  @Mutation DELETE_CATEGORY(categoryId: string): void {
    const index = this.categories.findIndex(c => c.id === categoryId)
    this.categories.splice(index, 1)
  }

  @Action({}) async addCategory(category: Category): Promise<void> {
    if (!userStore.uid) return

    const snapshot = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories`)
      .add(category)

    category.id = snapshot.id
    this.ADD_CATEGORY(category)
  }

  @Action({}) async updateCategory(category: Category): Promise<void> {
    const documentRef = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories`)
      .doc(category.id)

    documentRef.set(
      {
        title: category.title,
      },
      { merge: true }
    )

    this.UPDATE_CATEGORY(category)
  }

  @Action({ rawError: true }) async deleteCategory(categoryId: string): Promise<void> {
    await util.deleteAtPath(`users/${userStore.uid}/categories/${categoryId}`)
    this.DELETE_CATEGORY(categoryId)
  }

  @Action({ rawError: true }) async fetchCategories(): Promise<void> {
    const snapshot = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories`)
      .get()

    snapshot.forEach(doc => {
      const category: Category = {
        id: doc.id,
        title: doc.data().title,
        deletable: doc.data().deletable,
        renamable: doc.data().renamable,
        iconColor: doc.data().iconColor,
      }
      this.ADD_CATEGORY(category)
    })
  }
}

export default getModule(CategoryStore)
