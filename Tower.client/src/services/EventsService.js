import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class EventsService {
  async getEvents() {
    const res = await api.get('api/events')
    logger.log('[Got Events]', res.data)
    AppState.events = res.data
  }
  async getEventById(eventId) {
    const res = await api.get('api/events/' + eventId)
    logger.log('[GOT EVENT BY ID]', res.data)
    AppState.activeEvent = res.data
  }
  async createEvent(body) {
    const res = await api.post('api/events', body)
    logger.log('Create Event', res.data)
    AppState.events.push(res.data)
    return res.data
  }
  async cancelEvent(id) {
    const res = await api.delete('api/events/' + id)
    logger.log('[Cancel Event]', res.data)
    let index = AppState.events.findIndex(c => c.id == id)
    if (index >= 0) {
      AppState.events.splice(index, 1)
    }
  }
}

export const eventsService = new EventsService()