<template>
  <div class="home">
    <el-select v-model="currentConnection" placeholder="select connection...">
      <el-option v-for="connection in connections" 
        :key="connection.id"
        :value="connection.id"
        :label="connection.host"
      ></el-option>
    </el-select>
  </div>
</template>

<script>

export default {
  name: 'Home',

  data: () => ({
    currentConnection: null,
    connections: []
  }),

  async created(){
      this.connections = await this.$db.select('select * from connections')
  }
}
</script>
