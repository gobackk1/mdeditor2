<template>
  <div id="app" class="app">
    <header class="app__header">
      <AppHeader></AppHeader>
    </header>
    <RouterView class="app__content"></RouterView>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AppHeader from '@/components/AppHeader.vue'
import categoryStore from '@/store/category'
import userStore from '@/store/user'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'
import firebase from 'firebase'

@Component({
  components: {
    AppHeader,
  },
})
export default class App extends Vue {
  @Watch('$route')
  public router(to: any, from: any) {
    if (from.name === 'Editor') return

    this.$nextTick(() => {
      const defaultList = document.querySelector('#list-default li:first-child a')
      ;(defaultList as HTMLElement).click()
      console.log(to, 'to')
      console.log(from, 'from')
      setTimeout(() => {
        const noteList = document.querySelector('#note-list li:first-child a')
        console.log(noteList)
        ;(noteList as HTMLElement).click()
      })
    })
  }
  created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        if (this.$router.currentRoute.name === 'Home') {
          // this.$router.push({name: 'Editor'})
        }

        userStore.setLoginUser(user)
        await Promise.all([categoryStore.fetchCategories(), noteStore.fetchNotes()])

        eventBus.$emit('ready')
      } else {
        this.$router.push({ name: 'Home' })
        userStore.deleteLoginUser()
      }
    })
  }
}
</script>

<style lang="scss">
@import '@/sass/reset.scss';
@import '@/sass/github-markdown.scss';

.app {
  height: 100vh;
  background: $color_app_bg;

  &__header {
    height: $header_height;
  }

  &__content {
    height: calc(100% - #{$header_height});
    overflow: scroll;
  }
}
</style>
