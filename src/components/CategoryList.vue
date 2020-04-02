<template>
  <div>
    <div class="category-list">
      <div class="category-list__default">
        <ul id="list-default">
          <li class="list-default__item" v-for="category in defaultCategory" :key="category.id">
            <CategoryListItem :category="category"></CategoryListItem>
          </li>
        </ul>
      </div>
      <button class="category-list__button" @click="onClickButton" type="button">
        <Icon :color="'#fff'" :unicode="'f65e'" :iconSize="20"></Icon>
      </button>
      <div class="category-list__stage">
        <ul>
          <li v-for="category in categories" :key="category.id">
            <CategoryListItem :category="category"></CategoryListItem>
          </li>
        </ul>
      </div>
      <button class="category-list__toggle-button" type="button" @click="onClickToggleButton">
        <Icon :color="'#fff'" :unicode="'f101'" :iconSize="20"></Icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoryListItem from '@/components/CategoryListItem.vue'
import categoryStore from '@/store/category'
import userStore from '@/store/user'
import Category from '@/interface/Category'
import eventBus from '@/eventBus'
import firebase from 'firebase'
import Icon from '@/components/Icon.vue'

@Component({
  components: {
    CategoryListItem,
    Icon,
  },
})
export default class CategoryList extends Vue {
  public categories: Category[] = []
  public starCounter: number = 0
  public readonly ICON_COLOR: string[] = [
    '#f13030', // RED
    '#5640ff', // BLUE
    '#ffef1d', // YELLOW
    '#19ff57', // GREEN
    '#fd37ff', // PINK
    '#ffa315', // ORANGE
  ]
  public readonly defaultCategory: Category[] = [
    {
      id: 'all',
      title: '全てのノート',
      deletable: false,
      renamable: false,
      iconColor: '',
    },
    {
      id: 'star',
      title: 'お気に入り',
      deletable: false,
      renamable: false,
      iconColor: '',
    },
    {
      id: 'trash',
      title: 'ゴミ箱',
      deletable: true,
      renamable: false,
      iconColor: '',
    },
  ]

  created() {
    this.categories = this.$store.state.CategoryStore.categories
    eventBus.$on('noteUpdated', () => {})
  }

  public onClickButton(): void {
    const title: string | null = prompt('カテゴリ名を入力してください')
    if (!title) return

    const category: Category = {
      id: '',
      title,
      deletable: true,
      renamable: true,
      iconColor: this.ICON_COLOR[Math.floor(Math.random() * 6)],
    }

    categoryStore.addCategory(category)
  }

  public onClickToggleButton(): void {
    userStore.toggleSideBar()
  }
}
</script>

<style lang="scss" scoped>
.category-list {
  position: relative;
  height: 100%;
  padding: 15px;
  background: $color_sidebar_bg;
  color: $color_sidebar_text;
  text-align: right;
  border-top: 1px solid #555;
  &__button {
    @extend %button-reset;
    margin: 5px 0;
  }
  &__toggle-button {
    @extend %button-reset;
    position: absolute;
    bottom: 10px;
    right: 10px;
    transform: rotate(180deg);
    &::before {
      color: $color_sidebar_text;
    }
    .sidebar-is-close & {
      transform: rotate(0deg);
    }
  }
  &__stage {
    height: calc(100% - 185px);
    overflow-y: scroll;
  }
}
</style>
