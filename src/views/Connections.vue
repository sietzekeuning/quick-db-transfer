<template>
  <div class="about">
    
    <div class="flex justify-between">
      <h1 class="mb-8">Here you will see the different connections</h1>
      <btn-new-connection></btn-new-connection>
    </div>

    <table class="w-full">
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
const sqlite3 = require('sqlite3')
const NodeSSH = require('node-ssh')
import BtnNewConnection from '@/components/btn-new-connection'

export default {
  components: {
    BtnNewConnection
  },

  data: () => ({
    db: null,
    connections: []
  }),

  async created(){
    this.connect()
    await this.migrate()
    await this.query()
  },

  methods: {
    connect(){
      if(this.db && this.db.open)return
      this.db = new sqlite3.Database('base.db')
    },

    async migrate(){
        await this.db.run(`CREATE TABLE if not exists connections (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          host varchar(191), 
          username varchar(191), 
          databasename varchar(191), 
          key_path varchar(191)
        )`)
    },

    async query(){
      this.db.all('select * from connections', (err, rows) => {
        this.connections = rows
      })      
    },

    async testConnection(connection, i){
      let ssh = new NodeSSH()

      try{
        
        await ssh.connect({
          host       : connection.host,
          username   : connection.username,
          privateKey : connection.key_path
        })

      } catch(e) {
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