<template>
  <div class="home">
    <el-select v-model="currentConnection" placeholder="select connection..." @change="listTables">
      <el-option v-for="item in connections" 
        :key="item.id"
        :value="item.id"
        :label="item.host"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
const ssh = require('@/services/ssh')

export default {
  name: 'Home',

  data: () => ({
    currentConnection: null,
    connections: [],
    tables: []
  }),

  computed: {
    connection(){
      return this.connections.find(x => x.id === this.currentConnection)
    }
  },

  async created(){
      this.connections = await this.$db.select('select * from connections')
  },

  methods: {
    listTables(){
      if(!this.connection) return
      this.tables = ssh.listTables(this.connection)
    }
  }
}
</script>
