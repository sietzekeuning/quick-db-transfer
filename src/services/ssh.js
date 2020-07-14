const NodeSSH = require('node-ssh')
const ssh = new NodeSSH()

export default {
    async connect(connection){
        return await ssh.connect({
            host       : connection.ssh_host,
            username   : connection.ssh_username,
            privateKey : connection.key_path
        })
    },

    async test(connection){
        try{
            await this.connect(connection)
        } catch (e){
            return 'connection failed'
        }

        return true
    },

    async listTables(connection){
        await this.connect(connection)

        const result = await ssh.execCommand(`mysqlshow -u ${connection.db_username} -p${connection.db_password} ${connection.db_database}`)

        return this.parseTables(result.stdout)
    },

    async exec(connection, command) {
        await this.connect(connection)

        const result = await ssh.execCommand(command)

        return result.stdout
    },

    async download(){
        return ssh.getFile('dump.sql', 'dump.sql')
    },

    parseTables(txt) {
        let lines = txt.split('\n')
        lines.splice(0, 4) // remove header
        lines.pop() // remove footer

        return lines.map(x => x.replace(/[| ]/g, ''))
    }
}
