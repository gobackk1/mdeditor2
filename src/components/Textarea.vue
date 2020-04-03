<template>
  <textarea class="textarea" v-model="inputBody" cols="30" rows="10"></textarea>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'
import { Route } from 'vue-router'
import Note from '@/interface/Note'

Component.registerHooks(['beforeRouteLeave'])

@Component({})
export default class Textarea extends Vue {
  public beforeBody!: string
  public afterBody!: string

  @PropSync('body', { type: String })
  public inputBody!: string

  created() {
    this.beforeBody = this.inputBody
  }

  // TODO: next()の型
  beforeRouteLeave(to: Route, from: Route, next: (vm?: any) => void) {
    this.afterBody = this.inputBody
    if (this.beforeBody === this.afterBody) {
      next()
      return
    }
    this.$emit('inputBody')
    next()
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  height: calc(100% - 40px);
  width: 100%;
  overflow-y: scroll;
}
</style>
