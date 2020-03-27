<template>
  <div>
    <div class="category-list">
      <div class="category-list__default">
        <ul id="list-default">
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
        <pre>{{ categories }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoryListItem from '@/components/CategoryListItem.vue'
import noteStore from '@/store/note'
import userStore from '@/store/user'
import eventBus from '@/eventBus'
import firebase from 'firebase'

@Component({
  components: {
    CategoryListItem,
  },
})
export default class CategoryList extends Vue {
  public categories: any = []
  public starCounter: number = 0
  public readonly defaultCategory: any = [
    {
      id: 'all',
      title: '全てのノート',
      deletable: false,
      renamable: false,
    },
    {
      id: 'star',
      title: 'お気に入り',
      deletable: false,
      renamable: false,
    },
    {
      id: 'trash',
      title: 'ゴミ箱',
      deletable: true,
      renamable: false,
    },
  ]

  created() {
    this.categories = this.$store.state.note.categories
    eventBus.$on('noteUpdated', () => {
      this.starCounter = this.$store.state.note.notes
    })
  }

  public onClickButton(): void {
    const title = prompt('カテゴリ名を入力してください')
    if (!title) return

    const deletable = true
    const renamable = true
    // TODO: categoryのインターフェース
    noteStore.addCategory({ title, deletable, renamable })
  }
}
</script>
