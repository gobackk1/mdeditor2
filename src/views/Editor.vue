<template>
  <div class="editor">
    <div class="editor__category-list">
			<CategoryList></CategoryList>
		</div>
    <div class="editor__note-list">
			<NoteList></NoteList>
		</div>
    <div class="editor__stage">
			<EditorStage></EditorStage>
		</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CategoryList from '@/components/CategoryList.vue'
import NoteList from '@/components/NoteList.vue'
import EditorStage from '@/components/EditorStage.vue'

@Component({
	components: {
		CategoryList, NoteList, EditorStage
	}
})
export default class Editor extends Vue {}
</script>

<style lang="scss" scoped>
NoteList{
	background: #000;
}
.editor{
	@include l-app-content();
	display: flex;
	&__category-list{
		width: 300px;
	}
	&__note-list{
		width: 300px;
	}
	&__stage{
		width: 300px;
	}
}
</style>
