const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configure app to use bodyParser middleware for handling form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine for rendering pages
app.set("view engine", "ejs");

const auth = require('./auth.js');

auth.createUser("user", "pass");

console.log(auth.authenticateUser("user", "pass"));

//connect to database:
const mysql = require('mysql');
//Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'g00299043'
});

//connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to database!');
  }
})

//server static files from the public directory
app.use(express.static("home"));

app.get("/home", function(req, res){
  res.render("home.ejs");
})

// Route to handle login form submission
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const authenticated = auth.authenticateUser(username, password);
  console.log(authenticated);

  // Check if authentication is successful
  if (authenticated) {
    // If authentication was successful
    console.log("Authentication was successful!");
    res.render("home"); // Render the "home" view/template
  } else {
    // If authentication was not successful
    console.log("Authentication was NOT successful!");
    res.render("failed"); // Render the "failed" view/template
  }
});

//Route for retrieving and displaying product data
app.get("/shop", function (req, res) {
  const ID = req.query.rec;
  connection.query("SELECT * FROM products WHERE ID = ?", [ID], function (err, rows, fields) {
    if (err) {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retrieving data from database")
    }
    else if (rows.length === 0) {
      console.error("No rows found for ID $[ID]");
      res.status(404).send("No product found for ID $[ID]");
    }
    else {
      console.log("Data retrieved from database!");
      console.log(rows[0].Product);
      console.log(rows[0].Size);
      console.log(rows[0].Price);
      console.log(rows[0].Image);
      const prodName = rows[0].Product;
      const prodPrice = rows[0].Price;
      const image = rows[0].Image;
      res.render("test.ejs", { myMessage: prodName, myPrice: prodPrice, myImage: image });
    }
    //Inject data into HTML
  }
  )
});

// Route for posting product data to the server
app.post("/shop", function (req, res) {
  const ID = req.query.rec;
  connection.query("SELECT * FROM products WHERE ID = ?", [ID], function (err, rows, fields) {
    if (err) {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retreiving data from database");
    } else if (rows.length === 0) {
      console.error("No rows found for ID $[ID]");
      res.status(404).send("No product found for ID $[ID]");
    } else {
      // Log retrieved data and render the product page with the data
      console.log("Data retrieved from the Database!");
      const prodName = rows[0].Product;
      const prodPrice = rows[0].Price;
      const image = rows[0].Image;
      res.render("test.ejs", { myMessage: prodName, price: prodPrice, myImage: image });
    }
  })
});

//Start Server
app.listen(3000, () => {
  console.log('Server Started on Port 3000');
});