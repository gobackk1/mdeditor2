<template>
  <div class="editor">
    <div class="editor__tool">
      <EditorToolbar></EditorToolbar>
    </div>
    <div class="editor__stage stage">
      <div class="stage__body">
        {{note}}
        {{currentNoteId}}
      </div>
      <button @click="onClickButton">保存</button>
      <button @click="onClickDeleteButton">削除</button>
      <button @click="onClickStarButton">{{note.isFavorite ? '⭐️' : '☆'}}</button>
      <button @click="onClickTrashButton">{{note.isTrash ? '●' : '○'}}</button>
      <textarea
        v-if="note"
        v-model="note.title"
        class="stage__textarea"
        name
        id
        cols="30"
        rows="10"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import EditorToolbar from "@/components/EditorToolbar.vue";
import noteStore from "@/store/note";
import eventBus from "@/eventBus";

@Component({
  components: {
    EditorToolbar
  }
})
export default class EditorStage extends Vue {
  public note: any = {};
  private currentNoteId: string = "";

  @Watch("$route")
  route() {
    this.getNote();
  }

  created() {
    // eventBus.$on('ready', this.getNote)
    this.getNote();
  }

  public getNote(): void {
    this.currentNoteId = this.$route.params.noteId;
    this.note = noteStore.getNoteById(this.currentNoteId);
  }

  public async onClickButton(): Promise<void> {
    await this.updateNote();
  }

  public async onClickDeleteButton(): Promise<void> {
    await noteStore.deleteNote(this.note);
    this.note = null;
    this.$router.push({
      name: "Editor",
      params: { categoryId: this.$route.params.categoryId }
    });
  }

  public async onClickStarButton(): Promise<void> {
    this.note.isFavorite = !this.note.isFavorite;
    await this.updateNote();
  }

  public async onClickTrashButton(): Promise<void> {
    if (this.note.isFavorite) {
      alert("お気に入り登録したノートはゴミ箱へ移動できません");
      return;
    }

    this.note.isTrash = !this.note.isTrash;
    await this.updateNote();
  }

  public async updateNote(): Promise<void> {
    await noteStore.updateNote(this.note);
    eventBus.$emit("noteUpdated");
    this.getNote();
  }
}
</script>
