<template>
  <div>
    <div class="editor">
      <EditorToolbar
        class="editor__tool"
        :note="note"
        @toggle-status="changeStatus"
      ></EditorToolbar>
      <RouterView :body.sync="body" @inputBody="updateNote"></RouterView>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import EditorToolbar from '@/components/EditorToolbar.vue'
import categoryStore from '@/store/category'
import MarkdownBody from '@/components/MarkdownBody.vue'
import settingStore from '@/store/setting'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import Note from '@/interface/Note'

@Component({
  components: {
    EditorToolbar,
    MarkdownBody,
  },
})
export default class EditorStage extends Vue {
  public note: Note | null = null

  @Watch('$route')
  route() {
    this.note = noteStore.getNoteById(this.$route.params.noteId)
  }

  created() {
    this.note = noteStore.getNoteById(this.$route.params.noteId)
  }

  public get body(): string {
    return this.note ? this.note.body : ''
  }

  public set body(body: string) {
    if (!this.note) return
    this.note.body = body
  }

  public async changeStatus(status: keyof Note): Promise<void> {
    if (!this.note) return
    if (status !== 'isTrash' && status !== 'isFavorite') return

    if (status === 'isTrash') {
      if (this.note.isFavorite) {
        alert('お気に入り登録したノートはゴミ箱へ移動できません')
        return
      }
      if (settingStore.checkDelete && !this.note[status]) {
        if (!confirm('本当にゴミ箱へ移動して良いですか？')) return
      }
    }

    this.note[status] = !this.note[status]
    await this.updateNote()
  }

  public async updateNote(): Promise<void> {
    if (!this.note) return
    await noteStore.updateNote(this.note)
    eventBus.$emit('noteUpdated')
    this.note = noteStore.getNoteById(this.$route.params.noteId)
  }
}
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
  padding: 30px;
  background: #fff;
  &__tool {
    margin-bottom: 20px;
  }
}
</style>
