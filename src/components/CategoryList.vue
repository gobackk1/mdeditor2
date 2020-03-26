<template>
	<div>
		<button @click="aaa">test</button>
		<div class="category-list">
			<div class="category-list__default">
				<ul>
					<li v-for="category in defaultCategory" :key="category.id">
						<CategoryListItem :category="category"></CategoryListItem>
					</li>
				</ul>
			</div>
			<div class="category-list__button">
				<button @click="onClickButton" type="button">カテゴリ作成</button>
			</div>
			<div class="category-list__stage">
				<ul>
					<li v-for="category in categories" :key="category.id">
						<CategoryListItem :category="category"></CategoryListItem>
					</li>
				</ul>
				<pre>{{categories}}</pre>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoryListItem from '@/components/CategoryListItem.vue'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import firebase from 'firebase'

@Component({
	components: {
		CategoryListItem
	}
})
export default class CategoryList extends Vue {
	public categories: any = []
	public starCounter: number = 0
	public readonly defaultCategory: any = [
		{
			id: 'all',
			title: '全てのノート',
			deletable: false
		},
		{
			id: 'star',
			title: 'お気に入り',
			deletable: false
		},
		{
			id: 'trash',
			title: 'ゴミ箱',
			deletable: true
		},
	]

	created(){
		this.categories = this.$store.state.note.categories
		eventBus.$on('noteUpdated', () => {
			this.starCounter = this.$store.state.note.notes
		})
	}

	public onClickButton(): void {
		const title = prompt('カテゴリ名を入力してください')
		if(!title) return

		const deletable = true
		// TODO: categoryのインターフェース
		noteStore.addCategory({ title, deletable })
	}

	aaa():void{
		// const hello = firebase.functions().httpsCallable('helloWorld')

		// hello()
		// 	.then(res => console.log(res))
		// 	.catch(e => console.log(e))
		const hello = firebase.app().functions('asia-northeast1').httpsCallable('yeah')

		hello('a')
			.then(res => console.log(res))
			.catch(e => console.log(e))
	}
}
</script>
