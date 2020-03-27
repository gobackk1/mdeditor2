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
import firebase from 'firebase'
import eventBus from '@/eventBus'

@Component({
  components: {
    NoteListItem,
  },
})
export default class NoteList extends Vue {
  public notes: any = []
  // このプロパティイルカ？
  private currentCategoryId!: string

  @Watch('$route')
  public route() {
    this.getNotes()
  }

  public created(): void {
    // this.currentCategoryId = this.$route.params.categoryId
    // this.notes = noteStore.getNotesByCategoryId(this.currentCategoryId)
    eventBus.$on('noteUpdated', () => {
      this.getNotes()
    })
  }

  public getNotes(): void {
    this.notes = noteStore.getNotesByCategoryId(this.$route.params.categoryId)
  }

  public async onClickButton(): Promise<void> {
    const title = prompt('ノートタイトルを入力してください')
    if (!title) return

    const categoryId = this.$route.params.categoryId
    const note = {
      title,
      isFavorite: false,
      isTrash: false,
    }

    await noteStore.addNote({ categoryId, note })
    this.getNotes()
  }
}
</script>
