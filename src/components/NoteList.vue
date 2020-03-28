<template>
  <div class="note-list">
    <div class="note-list__search">
      <input type="text" v-model="searchText" placeholder="検索" />
    </div>
    <div class="note-list__tool tool">
      <div class="tool__sort">
        <select name id v-model="orderby">
          <option value="createdAt">作成日時</option>
          <option value="updatedAt">更新日時</option>
        </select>
      </div>
      <div class="tool__button">
        <button @click="onClickButton">ボタン</button>
      </div>
    </div>
    <div class="note-list__stage">
      <ul>
        <li v-for="note in processedNotes" :key="note.id">
          <RouterLink
            :to="{
              name: 'Editor',
              params: {
                categoryId: note.categoryId,
                noteId: note.id,
              },
            }"
          >
            <NoteListItem>{{ note.body | title }}</NoteListItem>
          </RouterLink>
        </li>
      </ul>
      <pre>{{ processedNotes }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import NoteListItem from '@/components/NoteListItem.vue'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import firebase from 'firebase'
import STATUS from '@/enum/STATUS'
import Note from '@/interface/Note'

@Component({
  components: {
    NoteListItem,
  },
  filters: {
    title(body: string): string {
      if (/#*\s/.test(body)) {
        body = body.replace(/#*\s/, '')
      }

      const hasNewLine = /\r\n|\r|\n/.exec(body)
      const index = hasNewLine ? hasNewLine.index : 30
      return body === '' ? 'empty title' : body.slice(0, index)
    },
  },
})
export default class NoteList extends Vue {
  public searchText: string = ''
  public orderby: string = 'createdAt'
  public notes: Note[] = []
  public dummyNotes: any[] = [
    {
      id: 'note1',
      categoryId: 'dummy',
      title: 'note1',
      body: 'note1 body',
      isFavorite: false,
      isTrash: false,
      pinned: STATUS.NORMAL,
      createdAt: {
        seconds: 666,
        nanoseconds: 666,
      },
      updatedAt: {
        seconds: 666,
        nanoseconds: 666,
      },
    },
    {
      id: 'note2',
      categoryId: 'dummy',
      title: 'note2',
      body: 'note2 body',
      isFavorite: true,
      isTrash: false,
      pinned: STATUS.PINNED,
      createdAt: {
        seconds: 444,
        nanoseconds: 444,
      },
      updatedAt: {
        seconds: 444,
        nanoseconds: 444,
      },
    },
    {
      id: 'note3',
      categoryId: 'dummy',
      title: 'note3',
      body: 'note3 body',
      isFavorite: false,
      isTrash: false,
      pinned: STATUS.NORMAL,
      createdAt: {
        seconds: 555,
        nanoseconds: 555,
      },
      updatedAt: {
        seconds: 555,
        nanoseconds: 555,
      },
    },
  ]

  public get processedNotes(): Note[] {
    const sortedNotes = this.notes.sort((a, b) => {
      switch (this.orderby) {
        case 'updatedAt':
          return b.updatedAt.seconds - a.updatedAt.seconds
        case 'createdAt':
        default:
          return b.createdAt.seconds - a.createdAt.seconds
        // return b.pinned - a.pinned || b.createdAt.seconds - a.createdAt.seconds
      }
    })

    if (this.searchText === '') return sortedNotes
    return sortedNotes.filter(note => RegExp(this.searchText).test(note.body))
  }

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
    const categoryId = this.$route.params.categoryId
    const note: Note = {
      id: '',
      categoryId,
      body: '',
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
