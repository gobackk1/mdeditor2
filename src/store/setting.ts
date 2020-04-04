import { Mutation, Action, VuexModule, getModule, Module } from 'vuex-module-decorators'
import store from '@/store/store'

export interface ISettingStore {
  _fontSize: FontSize
  _fontFamily: string
  _theme: Theme
  _checkDelete: boolean
  _frontMatterTitleField: string
  _changeFontSizeByWheel: boolean
}

export type FontSize = 'large' | 'medium' | 'small'
export type Theme = 'dark' | 'light'

@Module({ dynamic: true, store, name: 'SettingStore', namespaced: true })
class SettingStore extends VuexModule implements ISettingStore {
  public _fontSize: FontSize = (localStorage.getItem('m_font_size') as FontSize) || 'medium'
  public _fontFamily: string = localStorage.getItem('m_font_family') || 'monaco'
  public _theme: Theme = (localStorage.getItem('m_theme') as Theme) || 'light'
  public _checkDelete: boolean = localStorage.getItem('m_check_delete') === 'true' || false
  public _frontMatterTitleField: string =
    localStorage.getItem('m_font_matter_title_field') || 'empty title'
  public _changeFontSizeByWheel: boolean =
    localStorage.getItem('m_change_font_size_by_wheel') === 'true' || false

  public get fontSize(): FontSize {
    return this._fontSize
  }

  public get fontFamily(): string {
    return this._fontFamily
  }

  public get theme(): Theme {
    return this._theme
  }

  public get checkDelete(): boolean {
    return this._checkDelete
  }

  public get frontMatterTitleField(): string {
    return this._frontMatterTitleField
  }

  public get changeFontSizeByWheel(): boolean {
    return this._changeFontSizeByWheel
  }

  @Mutation
  public SET_FONT_SIZE(fontSize: FontSize): void {
    this._fontSize = fontSize
  }

  @Mutation
  public SET_FONT_FAMILY(fontFamily: string): void {
    this._fontFamily = fontFamily
  }

  @Mutation
  public SET_THEME(theme: Theme): void {
    this._theme = theme
  }

  @Mutation
  public SET_FRONT_MATTER_TITLE_FIELD(title: string): void {
    this._frontMatterTitleField = title
  }

  @Mutation
  public SET_CHECK_DELETE(boolean: boolean): void {
    this._checkDelete = boolean
  }

  @Mutation
  public SET_CHANGE_FONT_SIZE_BY_WHEEL(boolean: boolean): void {
    this._changeFontSizeByWheel = boolean
  }

  @Action
  public setFontSize(fontSize: FontSize): void {
    localStorage.setItem('m_font_size', fontSize)
    this.SET_FONT_SIZE(fontSize)
  }

  @Action
  public setFontFamily(fontFamily: string): void {
    localStorage.setItem('m_font_family', fontFamily)
    this.SET_FONT_FAMILY(fontFamily)
  }

  @Action
  public setTheme(theme: Theme): void {
    localStorage.setItem('m_theme', theme)
    this.SET_THEME(theme)
  }

  @Action
  public setCheckDelete(boolean: boolean): void {
    localStorage.setItem('m_check_delete', boolean.toString())
    this.SET_CHECK_DELETE(boolean)
  }

  @Action
  public setFrontMatterTitleField(title: string): void {
    localStorage.setItem('m_font_matter_title_field', title)
    this.SET_FRONT_MATTER_TITLE_FIELD(title)
  }

  @Action
  public setChangeFontSizeByWheel(boolean: boolean): void {
    localStorage.setItem('m_change_font_size_by_wheel', boolean.toString())
    this.SET_CHANGE_FONT_SIZE_BY_WHEEL(boolean)
  }
}

export default getModule(SettingStore)
