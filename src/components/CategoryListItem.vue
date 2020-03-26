<template>
  <div>
    <RouterLink
      :to="{ name: 'Editor', params: {categoryId: category.id}}"
      class="category-list-item"
    >
      {{category.title}}{{counter(category.id)}}
      <button
        v-if="category.deletable"
        @click="onClickDeleteButton"
      >削除</button>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import noteStore from "@/store/note";

@Component({})
export default class CategoryListItem extends Vue {
  @Prop({})
  public category!: any;

  public counter(categoryId: string): number {
    return noteStore.counterByCategoryId(categoryId);
  }

  public onClickDeleteButton(): void {
    if (!confirm("削除しますか？")) return;

    noteStore.deleteCategory(this.category);
  }
}
</script>

<style lang="scss" scoped>
.category-list-item {
  display: block;
}
</style>
