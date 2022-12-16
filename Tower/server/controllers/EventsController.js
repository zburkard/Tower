import { Auth0Provider } from "@bcwdev/auth0provider";
import { commentsService } from "../services/CommentsService.js";
import { eventsService } from "../services/EventsService";
import { ticketsService } from "../services/TicketsService.js";
import BaseController from "../utils/BaseController";

export class EventsController extends BaseController {
  constructor() {
    super('api/events')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getOne)
      .get('/:id/tickets', this.getTicketHolders)
      .get('/:id/comments', this.getEventComments)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.editEvent)
      .delete('/:id', this.cancel)

  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const event = await eventsService.create(req.body)
      console.log(req.body)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
  async getAll(req, res, next) {
    try {
      const events = await eventsService.getAll(req.query.page)
      return res.send(events)
    } catch (error) {
      next(error)
    }
  }
  async getOne(req, res, next) {
    try {
      const event = await eventsService.getOne(req.params.id)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }

  async getTicketHolders(req, res, next) {
    try {
      let tickets = await ticketsService.getTicketHolders(req.params.id)
      return res.send(tickets)
    } catch (error) {
      next(error)
    }
  }

  async getEventComments(req, res, next) {
    try {
      const comments = await commentsService.getEventComments({ eventId: req.params.id })
      return res.send(comments)
    } catch (error) {
      next(error)
    }
  }
  async editEvent(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const updated = await eventsService.editEvent(req.params.id, req.body)
      return res.send(updated)
    } catch (error) {
      next(error)
    }
  }

  async cancel(req, res, next) {
    try {
      const message = await eventsService.cancel(req.params.id, req.userInfo.id)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }
}