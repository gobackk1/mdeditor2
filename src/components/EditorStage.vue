<template>
  <div>
    <div class="editor">
      <div class="editor__tool">
        <EditorToolbar
          :note="note"
          @toggle-status="changeStatus"
          @edit="toggleEdit"
        ></EditorToolbar>
      </div>
      <MarkdownBody class="editor__stage" v-if="!editable" :content="body"></MarkdownBody>
      <textarea class="editor__stage" v-if="editable" v-model="body" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EditorToolbar from '@/components/EditorToolbar.vue'
import categoryStore from '@/store/category'
import MarkdownBody from '@/components/MarkdownBody.vue'
import settingStore from '@/store/setting'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import Note from '@/interface/Note'

import Test from '@/views/Setting.vue'

@Component({
  components: {
    EditorToolbar,
    MarkdownBody,
  },
})
export default class EditorStage extends Vue {
  public note: Note | null = null
  public beforeBody!: string
  public afterBody!: string
  public editable: boolean = false

  @Watch('$route')
  route() {
    this.editable = false
    this.beforeBody = ''
    this.afterBody = ''
    this.note = noteStore.getNoteById(this.$route.params.noteId)
  }

  created() {
    this.note = noteStore.getNoteById(this.$route.params.noteId)
    // console.log(Test._fontSize, 'Test')
  }

  public get body(): string {
    return this.note ? this.note.body : ''
  }

  public set body(body: string) {
    if (!this.note) return
    this.note.body = body
  }

  public toggleEdit(): void {
    this.editable = !this.editable

    if (!this.note) return

    if (this.editable) {
      this.beforeBody = this.note.body
    } else {
      this.afterBody = this.note.body
      if (this.beforeBody !== this.afterBody) {
        this.updateNote()
      }
    }
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
    console.log('updateNote')
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
  &__stage {
    height: calc(100% - 40px);
    width: 100%;
    overflow-y: scroll;
  }
}
</style>
