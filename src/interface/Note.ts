import ServerTimestamp from '@/interface/serverTimestamp'

export default interface Note {
  id: string
  categoryId: string
  body: string
  isFavorite: boolean
  isTrash: boolean
  createdAt: ServerTimestamp
  updatedAt: ServerTimestamp
}
