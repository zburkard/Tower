import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js"
import { eventsService } from "./EventsService.js"

class CommentsService {

  async createComment(body) {
    const event = await eventsService.getOne(body.eventId)
    if (event.isCanceled) throw new Forbidden('Event is already canceled dawg')
    const comment = await dbContext.Comments.create(body)
    await comment.populate('creator')
    return comment
  }
  async getEventComments(query) {
    const comments = await dbContext.Comments.find(query).populate('creator')
    return comments
  }
}
export const commentsService = new CommentsService()