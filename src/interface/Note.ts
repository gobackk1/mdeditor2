import serverTimestamp from '@/interface/serverTimestamp'

export default interface Note {
  id: string
  categoryId: string
  title: string
  isFavorite: boolean
  isTrash: boolean
  createdAt: serverTimestamp
  updatedAt: serverTimestamp
}
