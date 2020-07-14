<template>
  <div class="about">
    
    <div class="flex justify-end mb-4">
      <btn-new-connection @saved="init" ref="modal"></btn-new-connection>
    </div>

    <div v-if="!connections || connections.length === 0">
      No connections yet..
    </div>

    <table class="table" v-else>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Host</th>
          <th class="text-left">User</th>
          <th class="text-left"></th>
        </tr>
      </thead>

      <tr v-for="(connection,i) in connections" :key="i" @click="edit(connection)">
        <td>{{ connection.id }}</td>
        <td>{{ connection.host }}</td>
        <td>{{ connection.username }}</td>
        <td class="text-right">
          <i class="mr-2 text-gray-500 fa fa-times hover:text-red-500"
            @click.stop="remove(connection)"
          ></i>

          <i class="far fa-check-circle"
            :class="{
              'text-green-500': connection.status === 'success',
              'text-red-500': connection.status === 'error',
              'text-gray-500 hover:text-gray-700': !connection.status
            }"
            @click.stop="testConnection(connection, i)"
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
        this.$message.error('Connecting failed')
        return        
      }

      this.$set(this.connections[i], 'status', 'success')
      this.$message.success('Connection successful')
    },

    async remove(connection){
      await this.$confirm('Are you sure you want to delete this connection?')
      await this.$db.select('delete from connections where id = ' + connection.id)
      this.$message.success('Remove successful')
      this.init()
    },

    async edit(connection) {
      this.$refs.modal.edit(connection)
    }
  }
}
</script>