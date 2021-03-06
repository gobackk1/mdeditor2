<template>
  <div>
    <div class="header">
      <div class="header__inner">
        <h1 class="header__title">
          <RouterLink :to="{ name: 'Home' }">MDEditor</RouterLink>
        </h1>
        <nav>
          <ul class="header__menu menu-list" :class="{ loaded: loaded }">
            <li class="menu-list__item loading-icon" v-if="!loaded"></li>
            <li class="menu-list__item--editor" v-if="isLogin">
              <RouterLink :to="{ name: 'Editor' }" title="編集画面">
                <Icon
                  :color="'#fefefe'"
                  :unicode="'f0db'"
                  :icon-size="20"
                  :font-size="13"
                  class="icon"
                  >編集</Icon
                >
              </RouterLink>
            </li>
            <li class="menu-list__item--setting" v-if="isLogin">
              <RouterLink :to="{ name: 'Setting' }" title="設定">
                <Icon
                  :color="'#fefefe'"
                  :unicode="'f085'"
                  :icon-size="20"
                  :font-size="13"
                  class="icon"
                  >設定</Icon
                >
              </RouterLink>
            </li>
            <li class="menu-list__item--info">
              <RouterLink :to="{ name: 'Info' }" title="情報">
                <Icon
                  :color="'#fefefe'"
                  :unicode="'f05a'"
                  :icon-size="20"
                  :font-size="13"
                  class="icon"
                  >情報</Icon
                >
              </RouterLink>
            </li>
            <li class="menu-list__item" v-if="!isLogin">
              <button class="button--login" @click="onClickLogin" type="button">ログイン</button>
            </li>
            <li class="menu-list__item--img" v-if="isLogin && loaded">
              <img :src="photoURL" alt="ユーザーのプロフィール画像" />
            </li>
            <li class="menu-list__item" v-if="isLogin">
              <button class="button--logout" @click="onClickLogout" type="button">
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
        <div class="header__menu loading-icon" v-if="!loaded"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import userStore from '@/store/user'
import firebase from 'firebase'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class AppHeader extends Vue {
  loaded: boolean = false

  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return
      const image = new Image()
      image.addEventListener(
        'load',
        function fn(this: AppHeader) {
          this.loaded = true
          image.removeEventListener('load', fn)
        }.bind(this)
      )
      image.src = user.photoURL ? user.photoURL : 'defaultPhotoURL'
    })
  }

  get isLogin(): boolean {
    return userStore.isLogin
  }

  get userName(): string {
    return userStore.userName
  }

  get photoURL(): string {
    return userStore.photoURL
  }

  onClickLogin(): void {
    userStore.login()
  }

  onClickLogout(): void {
    firebase.auth().signOut()
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: $color_header_bg;
  color: $color_header_text;

  &__inner {
    @extend %l-container;
    height: $header_height;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 20px;
  }
}

.menu-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: 0.5s ease-out;

  &.loaded {
    opacity: 1;
    visibility: visible;
  }

  %menu-list__item {
    margin-left: 30px;
  }
  &__item {
    @extend %menu-list__item;
  }
  &__item--editor {
    @extend %menu-list__item;
    text-align: center;
    a::before {
      padding-bottom: 5px;
    }
  }
  &__item--setting {
    @extend %menu-list__item;
    text-align: center;
    a::before {
      padding-bottom: 5px;
    }
  }
  &__item--info {
    @extend %menu-list__item;
    text-align: center;
    a::before {
      padding-bottom: 5px;
    }
  }
  &__item--img {
    @extend %menu-list__item;
    width: 40px;
  }
}

.icon {
  &::before {
    padding-bottom: 5px;
  }
}

%button-auth {
  border-radius: 20px;
  padding: 4px 10px;
}
.button {
  &--login {
    @extend %button-auth;
  }
  &--logout {
    @extend %button-auth;
    color: #f2f2f2;
    background: #111;
    border: 1px solid;
  }
}

.loading-icon {
  animation: 1s loading-animation linear infinite;
  &::before {
    @include font-awesome(\f110, 40px);
  }
}

@keyframes loading-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360 * 1deg);
  }
}
</style>
