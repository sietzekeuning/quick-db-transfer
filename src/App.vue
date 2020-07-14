<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/connections">Connections</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'IBM Plex Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body{
  @apply bg-white p-6;
}

#nav {

  a {
    @apply font-bold text-gray-700;

    &.router-link-exact-active {
      @apply text-blue-600;
    }
  }
}
</style>
