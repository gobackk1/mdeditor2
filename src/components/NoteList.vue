<template>
  <div class="note-list">
    <div class="note-list__search">
      <input type="text" />
    </div>
    <div class="note-list__tool tool">
      <div class="tool__sort">
        <select name id>
          <option value>作成日時</option>
          <option value>更新日時</option>
        </select>
      </div>
      <div class="tool__button">
        <button @click="onClickButton">ボタン</button>
      </div>
    </div>
    <div class="note-list__stage">
      <ul>
        <li v-for="item in notes" :key="item.id">
          <RouterLink
            :to="{
              name: 'Editor',
              params: {
                categoryId: $route.params.categoryId,
                noteId: item.id,
              },
            }"
          >
            <NoteListItem>{{ item.title }}</NoteListItem>
          </RouterLink>
        </li>
      </ul>
      <pre>{{ notes }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import NoteListItem from '@/components/NoteListItem.vue'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import firebase from 'firebase'
import Note from '@/interface/Note'

@Component({
  components: {
    NoteListItem,
  },
})
export default class NoteList extends Vue {
  public notes: Note[] = []

  @Watch('$route')
  public route() {
    this.fetchNotes()
  }

  public created(): void {
    eventBus.$on('noteUpdated', () => {
      this.fetchNotes()
    })
  }

  public fetchNotes(): void {
    this.notes = noteStore.getNotesByCategoryId(this.$route.params.categoryId)
  }

  public async onClickButton(): Promise<void> {
    const title = prompt('ノートタイトルを入力してください')
    if (!title) return

    const categoryId = this.$route.params.categoryId
    const note: Note = {
      id: '',
      categoryId,
      title,
      isFavorite: false,
      isTrash: false,
      updatedAt: {
        seconds: 0,
        nanoseconds: 0,
      },
      createdAt: {
        seconds: 0,
        nanoseconds: 0,
      },
    }

    await noteStore.addNote(note)
    this.fetchNotes()
  }
}
</script>
