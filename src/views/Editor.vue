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
import settingStore from '@/store/setting'
import EditorStage from '@/components/EditorStage.vue'
import NoteList from '@/components/NoteList.vue'

@Component({
  components: {
    CategoryList,
    NoteList,
    EditorStage,
  },
})
export default class Editor extends Vue {
  public ctrlKeyPressed: boolean = false

  created() {
    if (!settingStore.changeFontSizeByWheel) return

    document.addEventListener('wheel', this.onMouseWheel)
    document.addEventListener('keyup', this.onKeyEvent)
    document.addEventListener('keydown', this.onKeyEvent)
  }

  beforeDestroy() {
    document.removeEventListener('wheel', this.onMouseWheel)
    document.removeEventListener('keyup', this.onKeyEvent)
    document.removeEventListener('keydown', this.onKeyEvent)
  }

  public onKeyEvent(e: KeyboardEvent): void {
    this.ctrlKeyPressed = e.ctrlKey
  }

  public onMouseWheel(e: MouseWheelEvent): void {
    if (!this.ctrlKeyPressed) return

    if (e.deltaY > 0) {
      switch (settingStore.fontSize) {
        case 'large':
          break
        case 'medium':
          settingStore.setFontSize('large')
          break
        case 'small':
          settingStore.setFontSize('medium')
          break
        default:
      }
    } else {
      switch (settingStore.fontSize) {
        case 'large':
          settingStore.setFontSize('medium')
          break
        case 'medium':
          settingStore.setFontSize('small')
          break
        case 'small':
          break
        default:
      }
    }
  }
}
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
