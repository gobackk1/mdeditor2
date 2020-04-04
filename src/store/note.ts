import {
  Mutation,
  MutationAction,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators'
import userStore from '@/store/user'
import Note from '@/interface/Note'
import store from '@/store/store'
import firebase from 'firebase'
import Vue from 'vue'

export interface INoteStore {
  notes: Note[]
}

@Module({ dynamic: true, store, name: 'NoteStore', namespaced: true })
class NoteStore extends VuexModule implements INoteStore {
  notes: Note[] = []

  get getNotesByCategoryId(): (categoryId: string) => Note[] {
    return categoryId => {
      switch (categoryId) {
        case 'all':
          return this.notes.filter(note => note.isTrash === false)
        case 'star':
          return this.notes.filter(note => note.isFavorite === true)
        case 'trash':
          return this.notes.filter(note => note.isTrash === true)
        default:
          return this.notes.filter(note => note.categoryId === categoryId && !note.isTrash)
      }
    }
  }

  get getNoteById(): (noteId: string) => Note | null {
    return noteId => this.notes.find(note => note.id === noteId) || null
  }

  get counterByAllCategory(): number {
    return this.notes.length
  }

  get counterByFavorite(): number {
    return this.notes.filter(note => note.isFavorite === true).length
  }

  get counterByTrash(): number {
    return this.notes.filter(note => note.isTrash === true).length
  }

  get counterByCategoryId(): (categoryId: string) => number {
    return categoryId => {
      switch (categoryId) {
        case 'all':
          return this.notes.filter(note => note.isTrash === false).length
        case 'star':
          return this.notes.filter(note => note.isFavorite === true).length
        case 'trash':
          return this.notes.filter(note => note.isTrash === true).length
        default:
          return this.notes.filter(note => note.categoryId === categoryId && !note.isTrash).length
      }
    }
  }

  @Mutation ADD_NOTE(note: Note): void {
    this.notes.push(note)
  }

  @Mutation UPDATE_NOTE(note: Note): void {
    const index = this.notes.findIndex(n => n.id === note.id)
    Vue.set(this.notes, index, note)
  }

  @Mutation DELETE_NOTE(noteId: string): void {
    const index = this.notes.findIndex(n => n.id === noteId)
    this.notes.splice(index, 1)
  }

  @Mutation DELETE_CATEGORY(categoryId: string): void {
    this.notes.forEach((note, index) => {
      if (note.categoryId === categoryId) {
        this.notes.splice(index, 1)
      }
    })
  }

  @Action({ rawError: true }) async deleteTrash(): Promise<void> {
    const notes = await firebase
      .firestore()
      .collectionGroup('notes')
      .where('isTrash', '==', true)
      .get()

    notes.forEach(doc => {
      firebase
        .firestore()
        .collection(`users/${userStore.uid}/categories/${doc.data().ref.id}/notes`)
        .doc(doc.id)
        .delete()

      this.DELETE_NOTE(doc.id)
    })
  }

  @Action({}) async addNote(note: Note): Promise<void> {
    if (!userStore.uid) return

    const category = await firebase
      .firestore()
      .doc(`users/${userStore.uid}/categories/${note.categoryId}`)
      .get()

    const documentRef = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories/${note.categoryId}/notes`)
      .doc()

    documentRef.set({
      ref: category.ref,
      ...note,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    return new Promise(resolve => {
      const unstamped = documentRef.onSnapshot(snapshot => {
        if (
          !(snapshot.data() as any).updatedAt ||
          !(snapshot.data() as any).createdAt ||
          !snapshot.exists
        )
          return

        this.ADD_NOTE({
          ...note,
          id: documentRef.id,
          categoryId: note.categoryId,
          createdAt: (snapshot.data() as any).createdAt,
          updatedAt: (snapshot.data() as any).updatedAt,
        })

        unstamped()
        resolve()
      })
    })
  }

  @Action async updateNote(note: Note): Promise<void> {
    if (!userStore.uid) return

    const documentRef = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories/${note.categoryId}/notes`)
      .doc(note.id)

    documentRef.set(
      {
        body: note.body,
        isFavorite: note.isFavorite,
        isTrash: note.isTrash,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    return new Promise(resolve => {
      const unstamped = documentRef.onSnapshot(snapshot => {
        if (!(snapshot.data() as any).updatedAt || !snapshot.exists) return

        this.UPDATE_NOTE({
          ...note,
          updatedAt: (snapshot.data() as any).updatedAt,
        })

        unstamped()
        resolve()
      })
    })
  }

  @Action async deleteNote(note: Note): Promise<void> {
    const snapshot = await firebase
      .firestore()
      .collection(`users/${userStore.uid}/categories/${note.categoryId}/notes`)
      .doc(note.id)
      .delete()

    this.DELETE_NOTE(note.id)
  }

  @Action({ rawError: true }) async fetchNotes(): Promise<void> {
    const snapshot = await firebase
      .firestore()
      .collectionGroup(`notes`)
      .get()

    snapshot.forEach(doc => {
      const note: Note = {
        id: doc.id,
        categoryId: doc.data().ref.id,
        body: doc.data().body,
        isFavorite: doc.data().isFavorite,
        isTrash: doc.data().isTrash,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
      }

      this.ADD_NOTE(note)
    })
  }
}

export default getModule(NoteStore)
