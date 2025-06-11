const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'mysql-21c1f55c-minhhh270805-fa33.f.aivencloud.com',
    user: 'avnadmin',
    password: '',
    database: '',
    port:17273
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Export promise-based connection
module.exports = db.promise();
