<template>
  <div class="setting">
    <div class="setting__inner markdown-body">
      <h2>Setting</h2>
      <div class="setting-item">
        <div class="setting-item__config">フォントサイズ</div>
        <div class="setting-item__value">
          <select name="" id="" v-model="fontSize">
            <option value="large">large</option>
            <option value="medium">medium</option>
            <option value="small">small</option>
          </select>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item__config">フォントファミリー</div>
        <div class="setting-item__value">
          <select name="" id="" v-model="fontFamily">
            <option value="sans-serif">sans-serif</option>
            <option value="serif">serif</option>
            <option value="monospace">monospace</option>
          </select>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item__config">テーマ</div>
        <div class="setting-item__value">
          <select name="" id="" v-model="theme">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item__config">ノートをゴミ箱へ移動するときに確認するか</div>
        <div class="setting-item__value">
          <Checkbox :data.sync="checkDelete" :name-id="'check-delte'"></Checkbox>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item__config">本文がない時のノートタイトル</div>
        <div class="setting-item__value">
          <input type="text" v-model="frontMatterTitleField" />
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-item__config">Ctrl + マウスホイールでフォントを拡大するか</div>
        <div class="setting-item__value">
          <Checkbox
            :data.sync="changeFontSizeByWheel"
            :name-id="'change-font-size-by-wheel'"
          ></Checkbox>
        </div>
      </div>
      <pre>{{ $store.state.SettingStore }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import settingStore, { FontSize, Theme } from '@/store/setting'
import { Route } from 'vue-router'
import Checkbox from '@/components/Checkbox.vue'

Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave'])

@Component({
  components: {
    Checkbox,
  },
})
export default class Setting extends Vue {
  public get fontSize(): FontSize {
    return settingStore.fontSize
  }

  public set fontSize(fontSize: FontSize) {
    settingStore.setFontSize(fontSize)
  }

  public get fontFamily(): string {
    return settingStore.fontFamily
  }

  public set fontFamily(fontFamily: string) {
    settingStore.setFontFamily(fontFamily)
  }

  public get theme(): Theme {
    return settingStore.theme
  }

  public set theme(theme: Theme) {
    settingStore.setTheme(theme)
  }

  public get checkDelete(): boolean {
    return settingStore.checkDelete
  }

  public set checkDelete(checkDelete: boolean) {
    settingStore.setCheckDelete(checkDelete)
  }
  public get frontMatterTitleField(): string {
    return settingStore.frontMatterTitleField
  }

  public set frontMatterTitleField(title: string) {
    settingStore.setFrontMatterTitleField(title)
  }

  public get changeFontSizeByWheel(): boolean {
    return settingStore.changeFontSizeByWheel
  }

  public set changeFontSizeByWheel(boolean: boolean) {
    settingStore.setChangeFontSizeByWheel(boolean)
  }
}
</script>

<style lang="scss" scoped>
.setting {
  @include l-app-content();
}
.setting-item {
  display: flex;
  &__config {
    width: 350px;
    margin: 10px 20px 10px 0;
  }
  &__value {
    display: flex;
    align-items: center;
    select,
    input {
      width: 200px;
      padding: 0 10px;
      background: #efefef;
      appearance: none;
      border: none;
    }
    select {
      border-radius: 0;
      height: 30px;
      display: block;
      font-size: 16px;
    }
    input {
    }
  }
}
</style>
