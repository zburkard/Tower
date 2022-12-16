<template>
  <div class="container">
    <div class="row mt-3">
      <img src="../assets/img/unsplash_kcJsQ3PJrYU.png">
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-center rounded mt-4 navbar-dark">
      <div class="col-12 elevation-4 p-2 rounded d-flex justify-content-around">
        <button @click="filterBy = ''" class="btn btn-outline-warning fw-bold">ALL</button>
        <button @click="filterBy = 'concert'" class="btn btn-outline-warning fw-bold">CONCERT🎶</button>
        <button @click="filterBy = 'convention'" class="btn btn-outline-warning fw-bold">CONVENTION🤝</button>
        <button @click="filterBy = 'sport'" class="btn btn-outline-warning fw-bold">SPORT🏓</button>
        <button @click="filterBy = 'digital'" class="btn btn-outline-warning fw-bold">DIGITAL📺</button>
      </div>
    </div>
  </div>
  <div class="row mt-4">
    <div v-for="e in events" class="col-md-3">
      <EventCard :event="e" />
    </div>
  </div>


</template>

<script>
import { onMounted, ref, computed } from "vue";
import { AppState } from "../AppState";
import EventCard from "../components/EventCard.vue";
import { eventsService } from '../services/EventsService.js';
import { logger } from "../utils/Logger";
import Pop from "../utils/Pop";
export default {
  setup() {
    const filterBy = ref("");
    async function getEvents() {
      try {
        await eventsService.getEvents();
      }
      catch (error) {
        Pop.error(error.message);
        logger.error(error);
      }
    }
    onMounted(() => {
      getEvents();
    });
    return {
      filterBy,
      account: computed(() => AppState.account),
      events: computed(() => {
        if (filterBy.value == "") {
          return AppState.events;
        }
        else {
          return AppState.events.filter(e => e.type == filterBy.value)
        }
      })
    };
  },
  components: { EventCard }
}
</script>

<style scoped lang="scss">
.dark {
  background-color: darkslategrey;
}

.logo {
  height: 7vh;
  width: 10vh;
}

.navbar-dark {
  background-color: #474C61;
  backdrop-filter: blur(10px);
}

.banner-img {
  height: 30vh;
  width: 100%
}
</style>
