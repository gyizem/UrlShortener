const { Pool } = require("pg");
const fs = require("fs")

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

function initTables(){
    const sql = fs.readFileSync("./sqls/tables.sql").toString()
    pool.query(sql).then(()=>{
        console.log("Database tables created!")
    }).catch((err)=>{
        console.error("Something happend while creating the datebase tables!\n",err)
    })
}

initTables()

module.exports = pool;
