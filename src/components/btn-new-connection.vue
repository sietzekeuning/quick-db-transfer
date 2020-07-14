<template>
  <div>
    <el-button type="primary" @click="show=true">New SSH connection</el-button>

    <el-dialog :visible.sync="show" title="New SSH connection" :append-to-body="true">
      
      <el-form :model="item" :rules="rules" @submit.native.prevent="save" label-width="140px" ref="form">

        <el-form-item label="Host" prop="host" required>
          <el-input v-model="item.host" placeholder="sub.domain.com"></el-input>
        </el-form-item>

        <el-form-item label="Username" prop="username" required>
          <el-input v-model="item.username" placeholder="user1"></el-input> 
        </el-form-item>

        <el-form-item label="Database" prop="databasename" required>
          <el-input v-model="item.databasename" placeholder="db1"></el-input>
        </el-form-item>

        <el-form-item label="Private key path" prop="key_path" required>
          <el-input v-model="item.key_path" placeholder="/home/user1/.ssh/id_rsa"></el-input>
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
      host: {required: true },
      username: {required: true },
      databasename: {required: true },
      key_path: {required: true },
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

      const query = this.$db.prepare('insert into connections (host, username, databasename, key_path) values (?, ?, ?, ?)')
      await query.run(this.item.host, this.item.username, this.item.databasename, this.item.key_path)
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
