<template>
    <div v-if="event" class="container-fluid">
        <div :style="`background-image: url(${event.coverImg})`" class="row mt-3 rounded elevation-4 cover">
            <div class="col-10 mx-3">
                <h2 class="mt-4">{{ event.name }}</h2>
                <h3 class="mt-4">Starts: {{ event.startDate }}</h3>
                <h4 class="mt-4 category">{{ event.type }}</h4>
                <h4 class="mt-4">Location: {{ event.location }}</h4>
                <p class="mt-4">{{ event.description }}</p>
                <div v-if="event.isCanceled" class="row text-danger text-center">
                    <h3>Event Has Been Canceled</h3>
                </div>
                <div v-else class="row justify-content-end m-3 align-items-center">
                    <div class="col-2 d-flex justify-content-around dark rounded">
                        <h5 class="m-3">Tickets Left:</h5>
                        <h5 v-if="event.capacity <= 20" class="text-danger m-3">
                            {{ event.capacity }}
                        </h5>
                        <h5 v-else class="m-3">{{ event.capacity }}</h5>
                    </div>
                    <button v-if="event.capacity == 0" disabled class="col-2 p-2 btn btn-danger mx-3">
                        <h5 class="fw-bold">Event is Sold Out⚠</h5>
                    </button>
                    <button v-else-if="account.id && !foundMe" @click="buyTicket()"
                        class="col-2 p-2 btn btn-success mx-3">
                        <h5 class="fw-bold">Get A Ticket 🎟</h5>
                    </button>
                    <button v-else-if="account.id" @click="removeTicket(foundMe.id)"
                        class="col-2 p-2 btn btn-danger mx-3">
                        <h5 class="fw-bold">Remove Ticket 🎟</h5>
                    </button>
                </div>
            </div>
            <div class="col-1 p-3 mt-3 text-end">
                <button v-if="account.id == event.creatorId && event.isCanceled == false" @click="cancelEvent(event.id)"
                    class="btn btn-danger">Cancel
                    Event <i class="mdi mdi-cancel"></i></button>
                <button v-else-if="event.isCanceled == true" class="btn btn-danger fw-bold fs-4" disabled>Event
                    Canceled</button>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row justify-content-center mt-5">
            <div class="col-10">
                <h5 class="cover">See Who Is Attending:</h5>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-10 d-flex dark rounded-pill">
                <div class="m-2" v-for="t in ticketHolders">
                    <img :src="t.profile.picture" alt="" :title="t.profile.name"
                        class="picture rounded-circle elevation-4">
                </div>
            </div>
        </div>
    </div>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div v-if="account.id" class="col-8 dark p-3 rounded-top">
                <form @submit.prevent="createComment()">
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1" class="text-light fs-4">Leave A Comment<img
                                :src="account.picture" class="picture rounded-circle elevation-4 m-3" alt=""></label>
                        <textarea v-model="editable.body" placeholder="Type comment here..." class="form-control"
                            id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-success mt-3">Post Comment</button>
                </form>
            </div>
        </div>
        <div class="row justify-content-center m-3">
            <h5 class="text-light text-center">See what people are saying...</h5>
            <div v-for="c in comments" class="col-8 dark rounded">
                <div class="row justify-content-center">
                    <div class="col-6 d-flex align-items-center">
                        <img :src="c.creator.picture" class="picture rounded-circle elevation-4 m-3" alt="">
                        <h4 class="text-light">{{ c.creator.name }}</h4>
                    </div>
                    <div class="col-6 d-flex justify-content-between align-items-center">
                        <div class="text-light fs-4">{{ c.body }}</div>
                        <button v-if="account.id == c.creatorId" class="btn btn-danger"
                            @click="removeComment(c.id)">Remove Comment</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { computed, reactive, onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import { AppState } from "../AppState.js";
import { eventsService } from "../services/EventsService.js";
import { ticketsService } from "../services/TicketsService.js";
import { commentsService } from "../services/CommentsService.js";
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
export default {
    setup() {
        const editable = ref({})
        const route = useRoute();
        async function getEventById() {
            try {
                await eventsService.getEventById(route.params.eventId)
            } catch (error) {
                logger.error(error)
                Pop.error(error.message)
            }
        }
        async function getTicketHolders() {
            try {
                await ticketsService.getTicketHolders(route.params.eventId)
            } catch (error) {
                logger.error(error)
                Pop.error(error)
            }
        }
        async function getCommentsByEventId() {
            try {
                await commentsService.getCommentsByEventId(route.params.eventId)
            } catch (error) {
                logger.error(error)
                Pop.error(error)
            }
        }
        onMounted(() => {
            getEventById();
            getTicketHolders();
            getCommentsByEventId();
        })
        return {
            editable,
            event: computed(() => AppState.activeEvent),
            ticketHolders: computed(() => AppState.tickets),
            comments: computed(() => AppState.comments),
            account: computed(() => AppState.account),
            foundMe: computed(() => AppState.tickets.find(t => t.accountId == AppState.account.id)),
            async cancelEvent(eventId) {
                try {
                    await eventsService.cancelEvent(eventId)
                } catch (error) {
                    logger.error(error)
                    Pop.error(error.message)
                }
                getEventById()
            },
            async buyTicket() {
                try {
                    await ticketsService.buyTicket({ eventId: route.params.eventId })
                } catch (error) {
                    logger.error(error)
                    Pop.error(error.message)
                }
            },
            async removeTicket(ticketId) {
                try {
                    if (await Pop.confirm('Are you sure?')) {
                        await ticketsService.removeTicket(ticketId)
                    }
                } catch (error) {
                    logger.error(error)
                    Pop.error(error)
                }
            },
            async createComment() {
                try {
                    editable.value.eventId = route.params.eventId
                    await commentsService.createComment(editable.value)
                    editable.value = {}
                } catch (error) {
                    logger.error(error)
                    Pop.error(error)
                }
            },
            async removeComment(commentId) {
                try {
                    await commentsService.removeComment(commentId)
                } catch (error) {

                }
                getCommentsByEventId()
            }
        }
    }
};
</script>

<style scoped lang="scss">
.cover {
    background-repeat: no-repeat;
    background-size: cover;
    color: #fffffa;

    text-shadow: 3px 0px 7px rgba(43, 42, 39, 0.8),
        -3px 0px 7px rgba(43, 42, 39, 0.8),
        0px 4px 7px rgba(43, 42, 39, 0.8);
}

.picture {
    height: 5vh;
    width: 5vh;
}

.dark {
    background-color: #474c615a;
    backdrop-filter: blur(10px);
}

.category {
    display: inline-block;
}

.category::first-letter {
    text-transform: uppercase;
}
</style>
