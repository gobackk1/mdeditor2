<template>
  <div class="editor" :class="{ 'sidebar-is-close': $store.state.UserStore.toggle.sideBar }">
    <CategoryList class="editor__category-list"></CategoryList>
    <NoteList class="editor__note-list"></NoteList>
    <EditorStage class="editor__note"></EditorStage>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoryList from '@/components/CategoryList.vue'
import NoteList from '@/components/NoteList.vue'
import EditorStage from '@/components/EditorStage.vue'

@Component({
  components: {
    CategoryList,
    NoteList,
    EditorStage,
  },
})
export default class Editor extends Vue {}
</script>

<style lang="scss" scoped>
.editor {
  @include l-app-content();
  display: flex;
  transition: transform 0.3s;
  &.sidebar-is-close {
    transform: translateX(-250px);
    margin-right: -250px;
  }
  &__category-list {
    width: 300px;
  }
  &__note-list {
    width: 300px;
  }
  &__note {
    width: calc(100% - 600px);
    flex: auto;
  }
}
</style>
