<template>
  <div class="info">
    <div class="info__inner">
      <h2>info</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Info extends Vue {}
</script>

<style lang="scss" scoped>
.info {
  @include l-app-content();
}
</style>
