const NodeSSH = require('node-ssh')
const ssh = new NodeSSH()

export default {
    async connect(connection){
        return await ssh.connect({
            host       : connection.host,
            username   : connection.username,
            privateKey : connection.key_path
        })
    },

    async test(connection){
        try{
            await this.connect(connection)
        }catch (e){
            return 'connection failed'
        }

        return true
    },

    async listTables(connection){
        await this.connect(connection)

        const result = await ssh.exec(`mysqlshow -u ${connection.username} -p${connection.password} ${connection.databasename}`)
        console.log(result.stdout)

    }
}