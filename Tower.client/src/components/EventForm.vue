<template>
  <div class="modal-header">
    <h1 class="modal-title fs-5" id="exampleModalLabel">Create Event</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <form @submit.prevent="createEvent()">
    <div class="modal-body">
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.name" type="text" required class="form-control" id="name" placeholder="Event Name">
        <label for="name">Event Name</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.location" type="text" required class="form-control" id="location"
          placeholder="Event Location">
        <label for="location">Event Location</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.description" type="text" required class="form-control" id="description"
          placeholder="Event Description">
        <label for="description">Event Description</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.capacity" type="number" required class="form-control" id="capacity"
          placeholder="Event Capacity">
        <label for="capacity">Event Capacity</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.coverImg" type="url" required class="form-control" id="coverImg"
          placeholder="Cover Image">
        <label for="coverImg">Cover Image</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <select v-model="editable.type" class="form-select" id="floatingSelect"
          aria-label="Floating label select example">
          <option value="concert">Concert</option>
          <option value="convention">Convention</option>
          <option value="sport">Sports</option>
          <option value="digital">Digital</option>
        </select>
        <label for="floatingSelect">Type of Event</label>
      </div>
      <div class="form-floating mb-3 elevation-5">
        <input v-model="editable.startDate" type="date" required class="form-control" id="startDate">
        <label for="startDate">Start Date</label>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="submit" class="btn btn-primary">Create Event</button>
    </div>
  </form>
</template>

capacity, location, description
<script>
import { ref } from 'vue';
import { logger } from '../utils/Logger.js';
import Pop from '../utils/Pop.js';
import { Modal } from 'bootstrap';
import { useRouter } from 'vue-router';
import { eventsService } from "../services/EventsService";
export default {
  setup() {
    const editable = ref({})
    const router = useRouter()
    return {
      editable,
      async createEvent() {
        try {
          const event = await eventsService.createEvent(editable.value)
          editable.value = {}
          Modal.getOrCreateInstance('#exampleModal').hide()
          router.push({ name: 'Event', params: { eventId: event.id } })
        } catch (error) {
          logger.error(error)
          Pop.error(error.message)
        }
      },
    }
  }
}
</script>


<style lang="scss" scoped>
.input-group-append {
  cursor: pointer;
}
</style>