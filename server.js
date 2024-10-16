require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors")
const bodyParser = require('body-parser');
const uri = process.env.MDB_CONNECTION_STRING

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


let db; // Global variable to hold the database connection
let client;
// Connect to MongoDB and set up the database
async function  connectToMongo() {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  await client.connect()
      .then(() => {
          db = client.db("Stationery-server"); // Database name
          console.log('Connected to MongoDB');
      })
      .catch(error => {
          console.log('Failed to connect to MongoDB:', error.message);
          process.exit(1); // Exit the process if unable to connect to MongoDB
      });
}

// Invoke the function

// API endpoint for user signup
app.post("/signup", async (req, res) => {
  try {
    const user = req.body;

    if (user.password.length < 6) throw new Error("Password too short");
    if (!user.email.includes("@")) throw new Error("Invalid email format");

    const collection = db.collection("User-data");

    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const result = await collection.insertOne({
      ...user,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error inserting user: ", error);
    res.status(500).json({ message: error.message || `Internal Server Error: ${error}`});
  }
});
app.post('/login', async (req, res) => {
  return  res.json({ message: 'Login successful', user });
  try {
    const { email, password } = req.body;
    // const user = await authenticateUser(email, password); // find another way to auth
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get('/getproducts', async (req, res) => {
  try {
    const products = await db.collection('Product-data').find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});
app.get('/test', async (req, res) =>{
  return "tested"
})
app.get('/customers', async (req, res) => {
    try {
        // await client.connect();
        // const database = client.db('Stationery-server'); // Replace with your database name
        const usersCollection = db.collection('User-data'); // Replace with your collection name

        const users = await usersCollection.find({}).toArray();
        if (users.length > 0){
          return res.status(200).send({message:users})
        }
        return res.status(404).send({message: 'users not found' })
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
});

app.get('/orders', async (req, res) => { // work
    try {
        await client.connect();
        const database = client.db('Stationery-server'); // Replace with your database name
        const orderCollection = database.collection('Order-data'); // Replace with your collection name

        const orderItems = await orderCollection.find().toArray();
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
});



app.listen(PORT, "0.0.0.0", async  () => {
 await connectToMongo();
  console.log(`Server is running on http://localhost:${PORT}`);
});