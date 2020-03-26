import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from "vuex-module-decorators";
import store from "@/store/store";
import firebase, { firestore } from 'firebase'
import userStore from '@/store/user'
import Vue from 'vue'
import * as util from '@/util'

export interface INoteStore {
	// TODO: loginUserの型定義
	notes: any;
}

@Module({ dynamic: true, store, name: 'note', namespaced: true })
class Note extends VuexModule implements INoteStore {
	notes: any[] = [];
	categories: any[] = []

	get getNotesByCategoryId(): (categoryId: string) => any {
		return categoryId => {
			switch (categoryId) {
				case 'all'  : return this.notes.filter(note => note.isTrash === false)
				case 'star' : return this.notes.filter(note => note.isFavorite === true)
				case 'trash': return this.notes.filter(note => note.isTrash === true)
				default     : return this.notes.filter(note => note.categoryId === categoryId && !note.isTrash)
			}
		}
	}

	get getNoteById(): (noteId: string) => any {
		return noteId => this.notes.find(note => note.id === noteId)
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
				case 'all'  : return this.notes.filter(note => note.isTrash === false).length
				case 'star' : return this.notes.filter(note => note.isFavorite === true).length
				case 'trash': return this.notes.filter(note => note.isTrash === true).length
				default     : return this.notes.filter(note => note.categoryId === categoryId && !note.isTrash).length
			}
		}
	}

	@Mutation ADD_NOTE(note: any): void {
		this.notes.push(note)
	}

	@Mutation ADD_CATEGORY(category: any): void {
		this.categories.push(category)
	}

	@Mutation UPDATE_NOTE(note: any): void {

		const index = this.notes.findIndex(n => n.id === note.id)
		Vue.set(this.notes, index, note)
		// this.notes[index] = note
		console.log(this.notes[index], 'UPDATE');

	}

	@Mutation DELETE_NOTE(note: any): void {
		const index = this.notes.findIndex(n => n.id === note.id)
		this.notes.splice(index, 1)
	}

	@Mutation DELETE_CATEGORY(categoryId: string): void {
		const index = this.categories.findIndex(c => c.id === categoryId)
		this.categories.splice(index, 1)
		this.notes.forEach((note, index) => {
			if (note.categoryId === categoryId) {
				this.notes.splice(index, 1)
			}
		})
	}

	@Action({}) async addCategory(category: any): Promise<void> {
		if (!userStore.uid) return

		const snapshot = await firebase
			.firestore()
			.collection(`users/${userStore.uid}/categories`)
			.add(category)

		this.ADD_CATEGORY({ id: snapshot.id, ...category })
	}

	@Action({rawError: true}) async deleteCategory(categoryId: string): Promise<void> {
		await util.deleteAtPath(`users/${userStore.uid}/categories/${categoryId}`)
		this.DELETE_CATEGORY(categoryId)
	}

	@Action({}) async addNote({categoryId, note}: any): Promise<void> {
		if (!userStore.uid) return

		const category = await firebase
			.firestore()
			.doc(`users/${userStore.uid}/categories/${categoryId}`)
			.get()

		const documentRef = await firebase
			.firestore()
			.collection(`users/${userStore.uid}/categories/${categoryId}/notes`)
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
				) return

				this.ADD_NOTE({
					id: documentRef.id,
					categoryId,
					...note,
					createdAt: (snapshot.data() as any).createdAt,
					updatedAt: (snapshot.data() as any).updatedAt,
				})

				unstamped()
				resolve()
			})
		})
	}

	@Action async updateNote(note: any): Promise<void> {
		if (!userStore.uid) return

		const documentRef = await firebase
			.firestore()
			.collection(`users/${userStore.uid}/categories/${note.categoryId}/notes`)
			.doc(note.id)
			// .update({ title: note.title })

		documentRef.set({
			title: note.title,
			isFavorite: note.isFavorite,
			isTrash: note.isTrash,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		}, {merge: true})

		return new Promise(resolve => {
			const unstamped = documentRef.onSnapshot(snapshot => {
				if (
					!(snapshot.data() as any).updatedAt ||
					!snapshot.exists
				) return

				this.UPDATE_NOTE({
					...note,
					updatedAt: (snapshot.data() as any).updatedAt
				})

				unstamped()
				resolve()
			})
		})
	}

	@Action async deleteNote(note: any): Promise<void> {
		if (!userStore.uid) return

		const snapshot = await firebase
			.firestore()
			.collection(`users/${userStore.uid}/categories/${note.categoryId}/notes`)
			.doc(note.id)
			.delete()

		this.DELETE_NOTE(note)
	}

	@Action({rawError: true}) async fetchCategories(): Promise<void> {
		const snapshot = await firebase
			.firestore()
			.collection(`users/${userStore.uid}/categories`)
			.get()

		snapshot.forEach(doc => this.ADD_CATEGORY({ id: doc.id, ...doc.data() }))
	}

	@Action({rawError: true}) async fetchNotes(): Promise<void> {
		const snapshot = await firebase
			.firestore()
			.collectionGroup(`notes`)
			.get()

		snapshot.forEach(doc => {
			console.log(doc.data());

			this.ADD_NOTE({
				id: doc.id,
				categoryId: doc.data().ref.id,
				title: doc.data().title,
				isFavorite: doc.data().isFavorite,
				isTrash: doc.data().isTrash,
				createdAt: doc.data().createdAt,
				updatedAt: doc.data().updatedAt,
			})
		})
	}
}

export default getModule(Note);
