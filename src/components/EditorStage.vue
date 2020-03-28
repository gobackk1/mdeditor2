<template>
  <div class="editor">
    <div class="editor__tool">
      <EditorToolbar></EditorToolbar>
    </div>
    <div class="editor__stage stage" v-if="note">
      <div class="stage__body">
        {{ categoryTitle }}
        {{ note.body }}
        <MarkdownBody :content="note.body"></MarkdownBody>
      </div>
      <button @click="onClickButton">保存</button>
      <button @click="onClickDeleteButton">削除</button>
      <button @click="onClickStarButton">{{ note.isFavorite ? '⭐️' : '☆' }}</button>
      <button @click="onClickTrashButton">{{ note.isTrash ? '●' : '○' }}</button>
      <textarea
        v-if="note"
        v-model="note.body"
        class="stage__textarea"
        cols="30"
        rows="10"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EditorToolbar from '@/components/EditorToolbar.vue'
import categoryStore from '@/store/category'
import MarkdownBody from '@/components/MarkdownBody.vue'
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
    this.fetchNote()
  }

  created() {
    // eventBus.$on('ready', this.fetchNote)
    this.fetchNote()
  }

  public get categoryTitle(): string {
    return this.note ? categoryStore.getTitleById(this.note.categoryId) : ''
  }

  public fetchNote(): void {
    const note = noteStore.getNoteById(this.$route.params.noteId)
    note ? (this.note = note) : (this.note = null)
  }

  public async onClickButton(): Promise<void> {
    await this.updateNote()
  }

  public async onClickDeleteButton(): Promise<void> {
    if (!this.note) return

    await noteStore.deleteNote(this.note)
    this.note = null
    this.$router.push({
      name: 'Editor',
      params: { categoryId: this.$route.params.categoryId },
    })
  }

  public async onClickStarButton(): Promise<void> {
    if (!this.note) return

    this.note.isFavorite = !this.note.isFavorite
    await this.updateNote()
  }

  public async onClickTrashButton(): Promise<void> {
    if (!this.note) return

    if (this.note.isFavorite) {
      alert('お気に入り登録したノートはゴミ箱へ移動できません')
      return
    }

    this.note.isTrash = !this.note.isTrash
    await this.updateNote()
  }

  public async updateNote(): Promise<void> {
    if (!this.note) return

    await noteStore.updateNote(this.note)
    eventBus.$emit('noteUpdated')
    this.fetchNote()
  }
}
</script>
