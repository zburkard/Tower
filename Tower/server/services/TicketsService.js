import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { eventsService } from "./EventsService.js"

class TicketsService {
  async createTicket(body) {
    const event = await eventsService.getOne(body.eventId)
    if (event.isCanceled) throw new Forbidden('This event was already canceled')
    if (event.capacity <= 0) throw new BadRequest('Event is at full capacity')
    const ticket = await dbContext.Tickets.create(body)
    event.capacity -= 1
    await event.save()
    await ticket.populate('profile event')
    return ticket
  }

  async getTicketedEvents(accountId) {
    let tickets = await dbContext.Tickets.find({ accountId }).populate('event')
    return tickets
  }

  async getTicketHolders(eventId) {
    let tickets = await dbContext.Tickets.find({ eventId }).populate('profile')
    return tickets
  }

  async removeTicket(ticketId, userId) {
    const ticket = await dbContext.Tickets.findById(ticketId).populate('profile event')
    if (!ticket) throw new BadRequest('no ticket at that id')
    // @ts-ignore
    if (ticket.accountId.toString() != userId) throw new Forbidden('not your ticket to delete')
    const event = await eventsService.getOne(ticket.eventId)
    if (event.isCanceled) throw new Forbidden('Event is already canceled')
    await ticket.remove()
    event.capacity += 1;
    await event.save()
    return `you no longer have a ticket to ${event.name}`

  }
}

export const ticketsService = new TicketsService()