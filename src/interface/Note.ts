import ServerTimestamp from '@/interface/ServerTimestamp'

export default interface Note {
  id: string
  author: string
  categoryId: string
  body: string
  isFavorite: boolean
  isTrash: boolean
  createdAt: ServerTimestamp
  updatedAt: ServerTimestamp
}
