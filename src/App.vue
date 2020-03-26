<template>
  <div id="app" class="app">
		<header class="app__header">
			<AppHeader></AppHeader>
		</header>
		<div class="app__content">
			<RouterView :scrollTop="appContentScrollTop"></RouterView>
		</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader from '@/components/AppHeader.vue'
import firebase from 'firebase'
import userStore from '@/store/user'
import noteStore from '@/store/note'
import eventBus from '@/eventBus'

@Component({
  components: {
		AppHeader
  },
})
export default class App extends Vue {
	public appContentScrollTop: number = 0;

	mounted() {
		const appContent = document.querySelector('.app__content')
		if(!appContent) return

		appContent.addEventListener('scroll', () => {
			if(this.$route.name !== 'Home') return
			this.onScrollHome(appContent)
		})
	}

	created() {
    firebase.auth().onAuthStateChanged(async user => {
			if(user) {
				if(this.$router.currentRoute.name === 'Home'){
					// this.$router.push({name: 'Editor'})
				}

				userStore.setLoginUser(user)
				await Promise.all([
					noteStore.fetchCategories(),
					noteStore.fetchNotes()
				])

				eventBus.$emit('ready')
			} else {
				this.$router.push({name: 'Home'})
				userStore.deleteLoginUser()
			}
		})
	}

	onScrollHome(appContent: Element): void {
		this.appContentScrollTop = appContent.scrollTop
	}
}
</script>

<style lang="scss">
	@import '@/sass/reset.scss';
	@import '@/sass/github-markdown.scss';

	.app{
		height: 100vh;
		background: $color_app_bg;

		&__header{
			height: $header_height;
		}

		&__content{
			height: calc(100% - #{$header_height});
			overflow: scroll;
		}
	}
</style>
