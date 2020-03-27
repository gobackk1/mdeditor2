<template>
  <div class="setting">
    <div class="setting__inner">
      <h2>Setting</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Setting extends Vue {}
</script>

<style lang="scss" scoped>
.setting {
  @include l-app-content();
}
</style>
