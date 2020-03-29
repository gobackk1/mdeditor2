<template>
  <div>
    <div class="note-list-item">
      <Icon :color="'inherit'" :unicode="'f60f'" :iconSize="20" class="icon"></Icon>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class NoteListItem extends Vue {}
</script>

<style lang="scss" scoped>
.note-list-item {
  padding: 10px;
  border-bottom: 1px solid #9a9a9a;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    background: #eee;
  }
}

.icon {
  margin-right: 10px;
  // vertical-align: middle;
}
</style>
