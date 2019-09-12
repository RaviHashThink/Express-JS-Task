const express = require('express');
const routes = require('./routes/routes')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser');
const swaggerDoc = require('./swagger-doc/swaggerDoc')

const app = express(express);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let db = new sqlite3.Database("./mydb.sqlite3", (err) => {
    if (err) {
        console.log('Error when creating the database', err)
    } else {
        console.log('Database created!')
        /* Put code to create table(s) here */
        createTable()
    }
})

const createTable = () => {
    db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)");
}

routes(app, db);
swaggerDoc(app)

app.use((err, req, resp, next) => console.error('Error', err));

app.listen(3000, () => console.log('App started'));