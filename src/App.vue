<template>
  <div class="container-fluid vh-100 p-0">
    <router-view :key="$route.path"/>
  </div>
</template>

<style scoped>
.container-fluid{
overflow: hidden;
}
</style>
