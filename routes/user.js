var db;

function setDB(db1) {
    db = db1;
}

function add(name, email, password, callback) {
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], callback);
}

function getByEmail(email, callback) {
    db.all("SELECT * FROM users where email='" + email + "'", callback);
}

function getAll(callback) {
    db.all("SELECT id, name, email FROM users", callback);
}

function getById(id, callback) {
    db.all("SELECT * FROM users where id=" + id, callback);
}

module.exports.setDB = setDB;
module.exports.add = add;
module.exports.getByEmail = getByEmail;
module.exports.getAll = getAll;
module.exports.getById = getById;