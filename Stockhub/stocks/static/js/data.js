var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port:"5432"
  user: "postgres",
  password: "MOU1sou2",
  database: "Nasdaq"
});

connection.connect();

connection.query('SELECT * from stocks', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();