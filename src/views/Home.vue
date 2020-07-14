<template>
  <page>
    <template slot="buttons">
        <el-button type="primary" @click="importDB" :disabled="selected.length <= 0 && localDB !== null">
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

        <div v-for="(db,i) in localDbs" :key="i">
          <el-radio v-model="localDB" :label="db">{{ db }}</el-radio>
        </div>

      </div>
    </div>

    <pre class="p-4 mt-4 text-sm border border-gray-200 rounded" v-text="log"></pre>
  </page>
</template>

<script>
import ssh from '@/services/ssh'
const { exec } = require('child_process')
let mysql = require('mysql');

export default {
  name: 'Home',

  data: () => ({
    selected: [],
    currentConnection: null,
    connections: [],
    tables: [],
    log: null,
    localDbs: [],
    localDB: null,
    localConnection: null
  }),

  computed: {
    connection(){
      return this.connections.find(x => x.id === this.currentConnection)
    }
  },

  async created(){
      this.connections = await this.$db.select('select * from connections')

      this.localConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
      });

      this.localConnection.connect()
      this.listLocalDBs()
  },

  methods: {
    async listTables(){
      if(!this.connection) return
      const res = await ssh.listTables(this.connection)
      this.tables = res.map(x => {
        return {key: x, label: x}
      })
    },

    listLocalDBs(){
      const sql = 'show databases'
      this.localConnection.query(sql, (error, results) => {
        this.localDbs = results.map(x => x.Database)
      })
    },

    async importDB(){
      this.addLog('connected, dumping..')
      const command = `mysqldump -u ${this.connection.db_username} -p${this.connection.db_password} ${this.connection.db_database} ${this.selected.join(' ')} > dump.sql`
      await ssh.exec(this.connection, command)
      this.addLog('dump done, downloading..')

      await ssh.download()
      this.addLog('downloaded, executing..')
      await ssh.remove()

      exec(`mysql -u root ${this.localDB} < dump.sql`)
      this.$message.success('All done!')

      exec('rm dump.sql')
      this.addLog('Done!')
    },

    addLog(msg) {
      this.log += msg + '\n\n'
    }
  }
}
</script>
