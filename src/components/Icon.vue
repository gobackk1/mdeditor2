<template>
  <span
    class="fa-icon"
    :class="unicode ? unicode : ''"
    :style="`color: ${color}; font-size: ${iconSize}px`"
  >
    <div v-if="fontSize" :style="`font-size: ${fontSize}px`">
      <slot></slot>
    </div>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Icon extends Vue {
  @Prop({})
  public unicode!: string

  @Prop({})
  public fontSize!: number

  @Prop({})
  public iconSize!: number

  @Prop({})
  public color!: string
}
</script>
<style lang="scss" scoped></style>
