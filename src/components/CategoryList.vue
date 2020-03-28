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
import categoryStore from '@/store/category'
import userStore from '@/store/user'
import Category from '@/interface/Category'
import eventBus from '@/eventBus'
import firebase from 'firebase'

@Component({
  components: {
    CategoryListItem,
  },
})
export default class CategoryList extends Vue {
  public categories: Category[] = []
  public starCounter: number = 0
  public readonly defaultCategory: Category[] = [
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
    this.categories = this.$store.state.CategoryStore.categories
    eventBus.$on('noteUpdated', () => {})
  }

  public onClickButton(): void {
    const title: string | null = prompt('カテゴリ名を入力してください')
    if (!title) return

    const category: Category = {
      id: '',
      title,
      deletable: true,
      renamable: true,
    }

    categoryStore.addCategory(category)
  }
}
</script>
