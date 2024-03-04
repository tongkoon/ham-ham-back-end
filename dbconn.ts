import mysql from "mysql";

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.197",
  user: "web65_64011212078",
  password: "64011212078@csmsu",
  database: "web65_64011212078",
  port: 3306,
});


// Attempt to connect to the database
conn.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database!');
    
    // Perform any additional database operations here if needed

    // Release the connection when done
    connection.release();
  }
});