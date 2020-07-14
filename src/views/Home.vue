<template>
  <page>
    <template slot="buttons">
        <el-button type="primary" @click="importDB" :disabled="selected.length <= 0">
          <i class="mr-2 text-lg fa fa-cloud-download-alt"></i>
          Import
        </el-button>
    </template>

    <div class="flex">
      <div class="w-2/3 mr-8">

        <div class="flex items-center mb-4">
          <el-select 
            v-model="currentConnection" 
            placeholder="select connection..." 
            @change="listTables"
            class="w-full"
          >
            <el-option v-for="item in connections" 
              :key="item.id"
              :value="item.id"
              :label="item.ssh_host"
            ></el-option>
          </el-select>

          <i class="ml-4 text-gray-500 fa fa-sync hover:text-gray-800" 
            v-if="currentConnection"
            @click="listTables"
          ></i>
        </div>

        <el-transfer 
          v-model="selected"
          :data="tables"
          :titles="['Tabellen', 'Importeren']"
        ></el-transfer>

      </div>
      
      <div class="flex-1">
        Selecteer lokale database
      </div>
    </div>
  </page>
</template>

<script>
import ssh from '@/services/ssh'
const { exec } = require('child_process')

export default {
  name: 'Home',

  data: () => ({
    selected: [],
    currentConnection: null,
    connections: [],
    tables: [],
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
    async listTables(){
      if(!this.connection) return
      const res = await ssh.listTables(this.connection)
      this.tables = res.map(x => {
        return {key: x, label: x}
      })
    },

    async importDB(){
      console.log('connected, dumping..')
      const command = `mysqldump -u ${this.connection.db_username} -p${this.connection.db_password} ${this.connection.db_database} ${this.selected[0]} > dump.sql`
      await ssh.exec(this.connection, command)
      console.log('dump done, downloading..')

      await ssh.download()
      console.log('downloaded, executing..')

      exec('mysql -u root lease-auto < dump.sql')
      this.$message.success('All done!')
    }
  }
}
</script>
