<template>
<div class="elevation-4 rounded bg-success">
<img :src="event.coverImg" alt="" class="img-fluid card-img rounded-top">
<div class="text-center fw-bold p-1">
  <div>{{event.name}}</div>
</div>
</div>
</template>

<script>
export default {
  props: {
    event: {type: Object, required: true}
  },
  setup(){

    return{}

  }
}
</script>

<style lang="scss" scoped>
.card-img {
  height: 30vh;
  width: 100%;
  object-fit: cover;
}
</style>