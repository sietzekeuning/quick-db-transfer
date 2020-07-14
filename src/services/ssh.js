const NodeSSH = require('node-ssh')

export default {
    async test(connection){
        let ssh = new NodeSSH()

        try{
            await ssh.connect({
                host       : connection.host,
                username   : connection.username,
                privateKey : connection.key_path
            })
        }catch (e){
            return 'connection failed'
        }

        return true
    }
}