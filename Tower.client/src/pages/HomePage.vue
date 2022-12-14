<template>
<div class="container-fluid">
<!-- Put Filters Here -->
</div>
<div class="container">
  <div class="row justify-content-center">
    <div class="col-12">
    </div>
  </div>
  <div class="row">
    <div v-for="e in events" class="col-12 col-md-3 mb-3 p-4">
    <EventCard :event="e"/>
  </div>
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
          events: computed(()=> {
            if (filterBy.value == ""){
              return AppState.events;
            }
            else {
              return AppState.events.filter(e => e.category == filterBy.value)
            }
          })
        };
    },
    components: { EventCard }
}
</script>

<style scoped lang="scss">
</style>
