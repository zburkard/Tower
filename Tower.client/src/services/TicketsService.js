import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import Pop from "../utils/Pop.js"
import { api } from "./AxiosService.js"

class TicketsService {

  async getTicketHolders(eventId) {
    const res = await api.get('api/events/' + eventId + '/tickets')
    logger.log('[GOT TICKET HOLDERS]', res.data)
    AppState.tickets = res.data
  }
  async getMyTickets() {
    try {
      const res = await api.get('account/tickets')
      logger.log('[Got My Tickets]', res.data)
      AppState.myEvents = res.data
    } catch (error) {
      logger.error(error)
      Pop.error(error.message)
    }
  }
  async buyTicket(body) {
    const res = await api.post('api/tickets', body)
    logger.log('[Bought Ticket]', res.data)
    AppState.tickets.push(res.data)
    AppState.myEvents.push(res.data)
    AppState.activeEvent.capacity--
  }
  async removeTicket(ticketId) {
    const res = api.delete('api/tickets/' + ticketId)
    AppState.tickets = AppState.tickets.filter(t => t.id !== ticketId)
    AppState.myEvents = AppState.myEvents.filter(t => t.id !== ticketId)
    AppState.activeEvent.capacity++
  }
}

export const ticketsService = new TicketsService()