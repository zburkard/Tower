<template>
  <header class="navbar-dark sticky-top">
    <Navbar />
  </header>
  <main class="dark">
    <router-view />
  </main>
  <footer class="navbar-dark text-light sticky-bottom">
    <h6>Tower Events 🦒</h6>
  </footer>
  <ModalComponent>
    <EventForm />
  </ModalComponent>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import EventForm from "./components/EventForm.vue"
import ModalComponent from "./components/ModalComponent.vue"
import Navbar from './components/Navbar.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar, ModalComponent, EventForm }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}

.dark {
  background-color: #2A2D3A;
}

.navbar-dark {
  background-color: #2a2d3a3b;
  backdrop-filter: blur(5px)
}
</style>
