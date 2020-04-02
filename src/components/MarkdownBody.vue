<template>
  <div>
    <div
      class="markdown-body"
      v-html="compiledMarkdown"
      :style="`font-size: ${fontSize}%; font-family: ${fontFamily};`"
    ></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import settingStore from '@/store/setting'

//TODO: markdown-it系の型
const MarkdownIt = require('markdown-it')
const sanitizer = require('markdown-it-sanitizer')
const footnote = require('markdown-it-footnote')
const container = require('markdown-it-container')
// const mark = require('markdown-it-mark')
const highlightjs = require('markdown-it-highlightjs')

@Component({})
export default class MarkdownBody extends Vue {
  public markdownIt: any = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    typographer: true,
  })
    .use(highlightjs)
    .use(sanitizer)
    .use(footnote)
    .use(container, 'info')
    .use(container, 'success')
    .use(container, 'warning')
    .use(container, 'danger')

  @Prop({})
  public content!: string

  public get fontSize(): number {
    switch (settingStore.fontSize) {
      case 'small':
        return 90
      case 'medium':
        return 100
      case 'large':
        return 110
    }
  }

  public get fontFamily(): string {
    return settingStore.fontFamily
  }

  public get compiledMarkdown(): string {
    return this.markdownIt.render(this.content)
  }
}
</script>
<style lang="scss" scoped></style>
