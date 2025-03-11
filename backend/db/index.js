const mongoose = require('mongoose');

function connectToDB() {
    mongoose.connect(process.env.DATABASE_URL, {
      //  useNewUrlParser: true,
      //  useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
    return
}

module.exports = connectToDB;

/*

const { Client } = require('pg');

function connectToDB() {
    const client = new Client({
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.port_db,
    });

    client.connect()
        .then(() => {
            console.log('Connected to PostgreSQL database');
    })
        .catch(err => {
            console.error('Error connecting to database:', err);
        });
    }
module.exports = connectToDB;

*/