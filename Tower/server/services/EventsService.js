import { dbContext } from "../db/DbContext"
import { BadRequest } from "../utils/Errors"

class EventsService {

  async create(body){
    const event = await dbContext.Events.create(body)
    await event.populate('creator')
    return event
  }
  async getAll(page = 1){
    const events = await dbContext.Events.find().populate('creator')
    return events
  }  
  async getOne(id) {
    const event = await dbContext.Events.findById(id).populate('creator')
    if(!event) throw new BadRequest('no event with this id')
    return event
  }

  async editEvent(id, eventData){
    const original = await this.getOne(id)
    if(!original) throw new BadRequest('no event with this id')
    original.name = eventData.name ? eventData.name : original.name
    original.description = eventData.description ? eventData.description : original.description
    // original.isCanceled = eventData.isCanceled !== undefined ? eventData.isCanceled : original.isCanceled
    // original.coverImg = eventData.coverImg ? eventData.coverImg : original.coverImg
    // original.location = eventData.location ? eventData.location : original.location
    // original.capacity = eventData.capacity ? eventData.capacity : original.capacity
    // original.startDate = eventData.startDate ? eventData.startDate : original.startDate
    return original
  }
}

export const eventsService = new EventsService()