<template>
  <div>
    <div class="tool-bar">
      <div class="tool-bar__title">
        <span class="tool-bar__category-title"
          ><Icon :color="'inherit'" :unicode="'f07b'" :iconSize="20" class="category-icon"></Icon
          >{{ categoryTitle }}</span
        >
      </div>
      <div class="tool-bar__buttons">
        <RouterLink :to="{ name: route, params: { categoryId, noteId } }">
          <Icon :color="'inherit'" :unicode="'f4ff'" :iconSize="20" class="icon"></Icon>
        </RouterLink>
        <button
          :class="isFavorite ? 'button-favorite--true' : 'button-favorite--false'"
          type="button"
          @click="toggleStatus('isFavorite')"
        >
          <Icon :color="'inherit'" :unicode="'f005'" :iconSize="20" class="icon"></Icon>
        </button>
        <button
          :class="isTrash ? 'button-trash--true' : 'button-trash--false'"
          type="button"
          @click="toggleStatus('isTrash')"
        >
          <Icon :color="'inherit'" :unicode="'f2ed'" :iconSize="20" class="icon"></Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, ProvideReactive } from 'vue-property-decorator'
import categoryStore from '@/store/category'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import Note from '@/interface/Note'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class EditorToolbar extends Vue {
  @Prop({})
  public note!: Note

  @Emit()
  public toggleStatus(status: string): void {}

  @Emit()
  public edit(status: string): void {}

  public get route(): string {
    // console.log(this.$route)
    // return ''
    return this.$route.name === 'Editor' ? 'Markdown' : 'Editor'
  }

  public get categoryId(): string {
    return this.note ? this.note.categoryId : 'all'
  }
  public get noteId(): string {
    return this.note ? this.note.id : 'all'
  }

  public get isFavorite(): boolean {
    return this.note ? this.note.isFavorite : false
  }

  public get isTrash(): boolean {
    return this.note ? this.note.isTrash : false
  }

  public get categoryTitle(): string {
    return categoryStore.getTitleById(this.$route.params.categoryId)
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  justify-content: space-between;
  align-content: center;
  &__category-title {
    vertical-align: middle;
  }
  &__title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
  }
}

%button-favorite {
  @extend %button-reset;
  margin-left: 10px;
}
.button-favorite {
  @extend %button-favorite;
  &--true {
    @extend %button-favorite;
    color: $color_favorite_true;
  }
  &--false {
    @extend %button-favorite;
    color: $color_favorite_false;
  }
}

%button-trash {
  @extend %button-reset;
  margin-left: 10px;
}
.button-trash {
  @extend %button-trash;
  &--true {
    @extend %button-trash;
    color: $color_trash_true;
  }
  &--false {
    @extend %button-trash;
    color: $color_trash_false;
  }
}
%button-edit {
  @extend %button-reset;
  margin-left: 10px;
}
.button-edit {
  @extend %button-edit;
  &--true {
    @extend %button-edit;
    color: $color_edit;
  }
  &--false {
    @extend %button-edit;
    // color: $color_edit_false;
  }
}
.category-icon {
  margin-right: 10px;
}
</style>
