import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class EventsService {
async getEvents(){
  const res = await api.get('api/events')
  logger.log('[Got Events]', res.data)
  AppState.events = res.data
}
async createEvent(body){
  const res = await api.post('api/events', body)
  logger.log('Create Event', res.data)
  AppState.events.push(res.data)
  return res.data
}
}

export const eventsService = new EventsService()