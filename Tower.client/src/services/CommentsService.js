import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class CommentsService {
  async getCommentsByEventId(eventId) {
    const res = await api.get(`api/events/${eventId}/comments`)
    logger.log('[Got Comments]', res.data)
    AppState.comments = res.data
  }
  async createComment(body) {
    const res = await api.post('api/comments', body)
    logger.log('[Posted Comment]', res.data)
    AppState.comments.push(res.data)
  }
  async removeComment(commentId) {
    const res = await api.delete('api/comments/' + commentId)
    logger.log('[Removed Comment]', res.data)
    let index = AppState.comments.findIndex(c => c.id == id)
    if (index >= 0) {
      AppState.comments.splice(index, 1)
    }
  }
}

export const commentsService = new CommentsService()