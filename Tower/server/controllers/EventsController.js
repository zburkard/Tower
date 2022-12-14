import { Auth0Provider } from "@bcwdev/auth0provider";
import { eventsService } from "../services/EventsService";
import BaseController from "../utils/BaseController";

export class EventsController extends BaseController {
  constructor(){
    super('api/events')
    this.router
    .get('', this.getAll)
    .get('/:id', this.getOne)
    .use(Auth0Provider.getAuthorizedUserInfo)
    .post('', this.create)
    .put('/:id', this.editEvent)
    
  }
  
  async create(req, res, next){
    try {
      req.body.creatorId = req.userInfo.id
      const event = await eventsService.create(req.body)
      console.log(req.body)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
  async getAll(req,res,next){
    try {
      const events = await eventsService.getAll(req.query.page)
      return res.send(events)
    } catch (error) {
      next(error)
    }
  }
  async getOne(req, res, next){
    try {
      const event = await eventsService.getOne(req.params.id)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
  async editEvent(req, res, next){
    try {
      const updated = await eventsService.editEvent(req.params.id, req.body)
      return res.send(updated)
    } catch (error) {
      next(error)
    }
  }
}