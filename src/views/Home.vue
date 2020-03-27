<template>
  <div class="home">
    <div class="home__hero"></div>
    <div class="home__inner markdown-body">
      <h2>このアプリは何？</h2>
      <p>ブラウザ上で動作するマークダウンエディタです。ここにソースコードはる</p>
      <h2>使ったものたち</h2>
      <p>
        HTML / SASS / TypeScript / Vue / vue-cli /Jest / Webpack / Firebase Authentication /
        Firestore / VSCode / Adobe XD
      </p>
      <h2>作業時間</h2>
      <p>準備中</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  /**
   * 高さぴったりまで変形させるとがたつくため
   */
  parallaxThreshould!: number

  @Prop({})
  public scrollTop?: number

  @Watch('scrollTop')
  parallaxHomeInner(scrollTop: number): void {
    const homeInner = document.querySelector('.home__inner')
    if (!homeInner) return
    if (scrollTop > this.parallaxThreshould) return
    ;(homeInner as HTMLElement).style.transform = `translateY(${-scrollTop}px)`
  }

  mounted() {
    const homeHero = document.querySelector('.home__hero')
    const threshould = (homeHero as HTMLElement).offsetHeight / 2 - 5
    this.parallaxThreshould = threshould
  }
}
</script>

<style lang="scss" scoped>
.home {
  @include l-app-content();
  &__hero {
    @extend %l-container;
    height: 500px;
    background: url(../../static/img/home_hero.jpg) no-repeat center/cover;
  }
}
</style>
