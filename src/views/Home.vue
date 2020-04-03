<template>
  <div class="wrapper">
    <div class="home">
      <div class="home__hero"></div>
      <div class="home__inner markdown-body">
        <h2>このアプリは何？</h2>
        <p>ブラウザ上で動作するマークダウンエディタです。ここにソースコードはる</p>
        <h2>使ったものたち</h2>
        <h3>フロントエンド</h3>
        <ul>
          <li>Vue.js</li>
          <li>TypeScript</li>
          <li>Scss</li>
        </ul>
        <h3>バックエンド</h3>
        <ul>
          <li>認証機能: Firebase Authentication</li>
          <li>データベース: Firestore</li>
          <li>デプロイ: Firebase Hosting</li>
        </ul>
        <h3>開発ツール</h3>
        <ul>
          <li>vue-cli</li>
          <li>VSCode</li>
          <li>Adobe XD</li>
        </ul>
        <h3>テストツール</h3>
        <ul>
          <li>Jest</li>
        </ul>
        <h2>作業時間</h2>
        <p>準備中</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  public wrapper!: Element | null
  public homeInner!: Element | null
  // スクロールしきるとがたつくため
  public threshould!: number

  mounted() {
    const homeHero = document.querySelector('.home__hero')
    this.homeInner = document.querySelector('.home__inner')
    this.wrapper = document.querySelector('.wrapper')
    this.threshould = (homeHero as HTMLElement).offsetHeight / 2 - 5

    if (!this.wrapper) return
    this.wrapper.addEventListener('scroll', this.onScrollWrapper)
  }

  beforeDestroy() {
    if (!this.wrapper) return
    this.wrapper.removeEventListener('scroll', this.onScrollWrapper)
  }

  public onScrollWrapper(): void {
    if (!this.wrapper) return
    if (this.wrapper.scrollTop > this.threshould) return
    ;(this.homeInner as HTMLElement).style.transform = `translateY(${-this.wrapper.scrollTop}px)`
  }
}
</script>

<style lang="scss" scoped>
.home {
  @include l-app-content();
  height: 100%;
  &__hero {
    @extend %l-container;
    height: 500px;
    background: url(../../static/img/home_hero.jpg) no-repeat center/cover;
  }
}
</style>
