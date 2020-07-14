<template>
  <div class="about">
    
    <div class="flex justify-end">
      <btn-new-connection @saved="init"></btn-new-connection>
    </div>

    <div v-if="!connections || connections.length === 0">
      No connections yet..
    </div>

    <table class="w-full" v-else>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Host</th>
          <th class="text-left">User</th>
          <th class="text-left"></th>
        </tr>
      </thead>

      <tr v-for="(connection,i) in connections" :key="i">
        <td>{{ connection.id }}</td>
        <td>{{ connection.host }}</td>
        <td>{{ connection.username }}</td>
        <td class="text-right">
          <i class="far fa-check-circle"
            :class="{
              'text-green-500': connection.status === 'success',
              'text-red-500': connection.status === 'error',
              'text-gray-500 hover:text-gray-700': !connection.status
            }"
            @click="testConnection(connection, i)"
          ></i>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import BtnNewConnection from '@/components/btn-new-connection'
import ssh from '@/services/ssh'

export default {
  components: {
    BtnNewConnection
  },

  data: () => ({
    db: null,
    connections: []
  }),

  created(){
    this.init()
  },

  methods: {

    async init(){
      this.connections = await this.$db.select('select * from connections')
    },

    async testConnection(connection, i){
      const result = await ssh.test(connection)
      if(result !== true){
        this.$set(this.connections[i], 'status', 'error')
        this.$message.error('Verbinding niet gelukt')
        return        
      }

      this.$set(this.connections[i], 'status', 'success')
      this.$message.success('Verbinding succesvol')
    }    
  }
}
</script>