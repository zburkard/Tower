import { dbContext } from "../db/DbContext"
import { BadRequest, Forbidden } from "../utils/Errors"

class EventsService {

  async create(body) {
    const event = await dbContext.Events.create(body)
    await event.populate('creator')
    return event
  }
  async getAll(page = 1) {
    const events = await dbContext.Events.find().populate('creator')
    return events
  }
  async getOne(id) {
    const event = await dbContext.Events.findById(id).populate('creator')
    if (!event) throw new BadRequest('no event with this id')
    return event
  }

  async editEvent(id, eventData) {
    const original = await this.getOne(id)
    if (!original) throw new BadRequest('no event with this id')
    if (original.isCanceled == true) { throw new BadRequest('already canceled dawg') }
    // @ts-ignore
    if (original.creatorId.toString() != eventData.creatorId) { throw new Forbidden('Not allowed to edit this') }
    else {
      original.name = eventData.name ? eventData.name : original.name
      original.description = eventData.description ? eventData.description : original.description
      // original.isCanceled = eventData.isCanceled !== undefined ? eventData.isCanceled : original.isCanceled
      original.coverImg = eventData.coverImg ? eventData.coverImg : original.coverImg
      original.location = eventData.location ? eventData.location : original.location
      original.capacity = eventData.capacity ? eventData.capacity : original.capacity
      original.startDate = eventData.startDate ? eventData.startDate : original.startDate
      await original.save()
      return original
    }
  }

  async cancel(eventId, userId) {
    const event = await this.getOne(eventId)
    if (event.creatorId != userId) { throw new Forbidden('not your event to delete dawg') }
    if (event.isCanceled == true) { throw new BadRequest('already canceled dawgy') }
    event.isCanceled = !event.isCanceled
    await event.save()
    return `canceled ${event.name}`
  }

  async removeComment(commentId, userId) {
    const comment = await dbContext.Comments.findById(commentId)
    if (!comment) throw new BadRequest('No comment with this id')
    if (comment.creatorId != userId) throw new Forbidden('not your comment to delete')
    await comment.delete()
    return `removed comment ${comment.body}`
  }
}

export const eventsService = new EventsService()