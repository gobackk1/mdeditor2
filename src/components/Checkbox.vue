<template>
  <div>
    <div class="checkbox">
      <input type="checkbox" v-model="checkDelete" :id="nameId" />
      <label :for="nameId"></label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component({})
export default class Checkbox extends Vue {
  @Prop()
  nameId!: string

  @PropSync('data', { type: Boolean })
  checkDelete!: boolean
}
</script>

<style lang="scss" scoped>
.checkbox {
  width: 40px;
  height: 20px;
  position: relative;
}
.checkbox input {
  opacity: 0;
}
.checkbox label {
  position: absolute;
  background-color: #ababab;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
}
.checkbox label:after {
  content: '';
  display: block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 2px;
  z-index: 1;
  left: 3px;
  background-color: #fff;
  transition: left 0.2s ease-in-out;
}
.checkbox input[type='checkbox']:checked ~ label {
  background-color: #3bc0ff;
}

.checkbox input[type='checkbox']:checked ~ label:after {
  left: 20px;
}
</style>
