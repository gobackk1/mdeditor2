<template>
  <div>
    <RouterLink
      :to="{ name: 'Editor', params: { categoryId: category.id } }"
      class="category-list-item"
    >
      {{ category.title }}{{ counter(category.id) }}
      <button v-if="category.deletable" @click="onClickDeleteButton(category.id)">削除</button>
      <button v-if="category.renamable" @click="onClickRenameButton(category.id)">名前変更</button>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import noteStore from '@/store/note'

@Component({})
export default class CategoryListItem extends Vue {
  @Prop({})
  public category!: any

  public counter(categoryId: string): number {
    return noteStore.counterByCategoryId(categoryId)
  }

  public async onClickDeleteButton(categoryId: string): Promise<void> {
    // TODO: 削除にかかる時間が長いので、ローディングアニメーションさせる必要あり
    if (!confirm('削除しますか？')) return

    if (categoryId === 'trash') {
      await noteStore.deleteTrash()
    } else {
      await noteStore.deleteCategory(categoryId)
    }

    this.$router.push({ name: 'Editor', params: { categoryId: 'all' } })
  }

  public onClickRenameButton(categoryId: string): void {
    const title = prompt('変更後のカテゴリ名を入力してください')
    if (!title) return

    this.category.title = title
    noteStore.updateCategory(this.category)
  }
}
</script>

<style lang="scss" scoped>
.category-list-item {
  display: block;
}
</style>
