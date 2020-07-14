const sqlite3 = require('sqlite3')

export default {
  install(Vue) {
    let db

    Vue.prototype.$db = db = new sqlite3.Database('base.db')
    
    db.run(`CREATE TABLE if not exists connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        host varchar(191), 
        username varchar(191), 
        databasename varchar(191), 
        key_path varchar(191)
    )`)

    Vue.prototype.$db.select = function(query){
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => {
                if(!err) resolve(rows)
                reject(err)
            })
        })
        
    }

  },

};