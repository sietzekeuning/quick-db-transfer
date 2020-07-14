<template>
  <div>
    <el-button type="primary" @click="show=true">
      <i class="mr-1 text-sm fa fa-plus"></i>
      New SSH connection
    </el-button>

    <el-dialog :visible.sync="show" title="New SSH connection" :append-to-body="true">
      
      <el-form :model="item" :rules="rules" @submit.native.prevent="save" label-width="140px" ref="form">

        <el-form-item label="SSH Host" prop="ssh_host" required>
          <el-input v-model="item.ssh_host" placeholder="sub.domain.com"></el-input>
        </el-form-item>

        <el-form-item label="SSH Username" prop="ssh_username" required>
          <el-input v-model="item.ssh_username" placeholder="user1"></el-input> 
        </el-form-item>

        <el-form-item label="Private key path" prop="key_path" required>
          <el-input v-model="item.key_path" placeholder="/home/user1/.ssh/id_rsa"></el-input>
        </el-form-item>

        <el-form-item label="Database" prop="db_database" required>
          <el-input v-model="item.db_database" placeholder="db1"></el-input>
        </el-form-item>

        <el-form-item label="DB Username" prop="db_username" required>
          <el-input v-model="item.db_username" placeholder="user1"></el-input>
        </el-form-item>

        <el-form-item label="DB Password" prop="db_password" required>
          <el-input v-model="item.db_password" placeholder="pass1"></el-input>
        </el-form-item>

        <div class="flex items-center justify-end">
          <div v-text="testFeedback" v-if="testFeedback" class="mr-4"></div>
          <el-button type="default" @click="test">
            Test
          </el-button>

          <el-button type="primary" @click="save">
            Opslaan
          </el-button>
        </div> 

      </el-form>


    </el-dialog>
  </div>
</template>

<script>
import ssh from '@/services/ssh'

export default {
  data: () => ({
    show: false,
    item: {},
    rules: {
      ssh_host: {required: true },
      ssh_username: {required: true },
      key_path: {required: true },
      db_database: {required: true },
      db_username: {required: true },
    },
    testFeedback: null
  }),

  methods: {
    async save(){
      try {
        await this.$refs.form.validate()
      } catch (e){
        this.$message.error('Er is iets mis gegaan')
        return
      }

      let query
      if(this.item.id) {
        query = this.$db.prepare(`update connections set
          ssh_host = ?, 
          ssh_username = ?, 
          key_path = ?,
          db_database = ?,
          db_username = ?,
          db_password = ?
        where id = ` + this.item.id)
      } else{
        query = this.$db.prepare(`insert into connections (
          ssh_host, 
          ssh_username, 
          key_path,
          db_database,
          db_username,
          db_password
        ) values (?, ?, ?, ?, ?, ?)`)
      }
      
      await query.run(
        this.item.ssh_host, 
        this.item.ssh_username, 
        this.item.key_path,
        this.item.db_database, 
        this.item.db_username, 
        this.item.db_password 
        )
      await query.finalize()

      this.$message.success('Opgeslagen')
      this.show = false
      this.$emit('saved')
    },

    async test(){
      const result = await ssh.test(this.item)
      this.testFeedback = result === true ? 'Verbinding succesvol!' : result
    },

    edit(item) {
      this.item = item
      this.show = true
    }
  }
}
</script>
