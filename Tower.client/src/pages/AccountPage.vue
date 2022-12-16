<template>
  <div class="p-4 text-light d-flex align-items-center justify-content-center">
    <h3 class="mx-3">Welcome {{ account.name }}!</h3>
    <img class="rounded-circle prof-img" :src="account.picture" alt="" />
  </div>
  <div class="row">
    <h3 class="text-light mx-3"><u>Your Ticketed Events</u></h3>
  </div>
  <div class="row justify-content-center">
    <!-- <div v-if="account.id && myEvents.length > 0" > -->
    <div v-if="account.id && myEvents.length > 0" v-for="events in myEvents" class="col-md-3">
      <EventCard :event="events.event" />
    </div>
  </div>

  <div class="row">

  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import EventCard from "../components/EventCard.vue";
import { eventsService } from "../services/EventsService.js";
import { ticketsService } from "../services/TicketsService.js";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
export default {
  setup() {
    async function getMyEvents() {
      try {
        await ticketsService.getMyTickets()
      } catch (error) {
        logger.log(error)
        Pop.error(error)
      }

    }
    onMounted(() => {
      getMyEvents()
    })
    return {
      account: computed(() => AppState.account),
      myEvents: computed(() => AppState.myEvents)
    };
  },
  components: { EventCard }
}
</script>

<style scoped>
.prof-img {
  height: 60px;
  width: 60px;
}
</style>
