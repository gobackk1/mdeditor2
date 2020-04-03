<template>
  <div>
    <RouterLink
      :to="{ name: 'Markdown', params: { categoryId: category.id } }"
      class="category-list-item"
    >
      <div class="category-list-item__title">
        <Icon class="icon" :color="category.iconColor" :icon-size="20" :unicode="'f07b'"></Icon
        >{{ category.title }}
      </div>
      <div class="category-list-item__counter">{{ counter(category.id) }}</div>
      <div class="category-list-item__tool tool">
        <button
          class="tool__rename"
          v-if="category.renamable"
          @click="onClickRenameButton(category.id)"
          title="カテゴリ名変更"
        ></button>
        <button
          class="tool__delete"
          v-if="category.deletable"
          @click="onClickDeleteButton(category.id)"
          title="カテゴリ削除"
        ></button>
      </div>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import categoryStore from '@/store/category'
import noteStore from '@/store/note'
import Category from '@/interface/Category'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class CategoryListItem extends Vue {
  @Prop({})
  public category!: Category

  public counter(categoryId: string): number {
    return noteStore.counterByCategoryId(categoryId)
  }

  public async onClickDeleteButton(categoryId: string): Promise<void> {
    // TODO: 削除にかかる時間が長いので、ローディングアニメーションさせる必要あり
    if (
      !confirm(
        '本当に削除して良いですか？\n・ノートも削除されます\n・削除したノートは復元できません'
      )
    )
      return

    if (categoryId === 'trash') {
      await noteStore.deleteTrash()
    } else {
      await categoryStore.deleteCategory(categoryId)
      categoryStore.deleteCategory(categoryId)
    }

    this.$router.push({ name: 'Editor', params: { categoryId: 'all' } })
  }

  public onClickRenameButton(categoryId: string): void {
    const title = prompt('変更後のカテゴリ名を入力してください')
    if (!title) return

    this.category.title = title
    categoryStore.updateCategory(this.category)
  }
}
</script>

<style lang="scss" scoped>
.category-list-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  &:hover {
    background: #000;
    transition: 0.2s;
    .category-list-item__tool {
      opacity: 1;
      visibility: visible;
    }
    .category-list-item__title {
      opacity: 0.4;
    }
  }
  &__tool {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 40px;
    margin: auto;
    opacity: 0;
    visibility: hidden;
  }
  &__title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  %tool__item {
    @extend %button-reset;
    transition: 0.2s;
    opacity: 0.7;
    &::before {
      color: #fff;
    }
    &:hover {
      opacity: 1;
    }
  }
  &__delete {
    @extend %tool__item;
    &::before {
      @include font-awesome(\f00d, 14px);
    }
  }
  &__rename {
    @extend %tool__item;
    &::before {
      @include font-awesome(\f304, 14px);
    }
  }
}

.icon {
  margin-right: 15px;
}
</style>
