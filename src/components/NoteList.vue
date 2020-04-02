<template>
  <div class="note-list">
    <input class="note-list__search" type="text" v-model="searchText" placeholder="検索" />
    <div class="note-list__tool tool">
      <select class="tool__sort" name id v-model="orderby">
        <option value="createdAt">作成日時</option>
        <option value="updatedAt">更新日時</option>
      </select>
      <button class="tool__button" @click="onClickButton" title="ノートを作成する">
        <Icon :color="'#333'" :unicode="'f044'" :iconSize="15"></Icon>
      </button>
    </div>
    <div class="note-list__stage">
      <ul id="note-list">
        <li v-for="note in filteredNotes" :key="note.id">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import NoteListItem from '@/components/NoteListItem.vue'
import settingStore from '@/store/setting'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import firebase from 'firebase'
import STATUS from '@/enum/STATUS'
import Note from '@/interface/Note'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    NoteListItem,
    Icon,
  },
  filters: {
    title(body: string): string {
      if (/#*\s/.test(body)) {
        body = body.replace(/#*\s/, '')
      }

      const hasNewLine = /\r\n|\r|\n/.exec(body)
      const index = hasNewLine ? hasNewLine.index : 30
      return body === '' ? settingStore.frontMatterTitleField : body.slice(0, index)
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

  public get filteredNotes(): Note[] {
    if (this.searchText === '') return this.sortedNotes
    return this.sortedNotes.filter(note => RegExp(this.searchText).test(note.body))
  }

  public get sortedNotes(): Note[] {
    return this.notes.sort((a, b) => {
      switch (this.orderby) {
        case 'updatedAt':
          return b.updatedAt.seconds - a.updatedAt.seconds
        case 'createdAt':
        default:
          return b.createdAt.seconds - a.createdAt.seconds
        // return b.pinned - a.pinned || b.createdAt.seconds - a.createdAt.seconds
      }
    })
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

<style lang="scss" scoped>
.note-list {
  padding: 15px;
  background: $color_note_list_bg;
  color: $color_note_list_text;
  &__search {
    width: 100%;
    font-size: 20px;
    margin-bottom: 10px;
    padding: 5px;
    border: none;
  }
  &__tool {
    margin-bottom: 10px;
  }
  &__stage {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
}

.tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__button {
    @extend %button-reset;
  }
}
</style>
