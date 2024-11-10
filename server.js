import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const uri = process.env.MDB_CONNECTION_STRING;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

let db;
let client;

async function connectToMongo() {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
    .then(() => {
      db = client.db("Stationery-server"); // Database name
      console.log("Connected to MongoDB");
    })
    .catch(error => {
      console.log("Failed to connect to MongoDB:", error.message);
      process.exit(1); // Exit the process if unable to connect to MongoDB
    });
}

// Updated `/signup` endpoint
app.post("/signup", async (req, res) => {
  try {
    const user = req.body;

    // Validate email and password
    if (!user.email || !user.email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!user.password || user.password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const collection = db.collection("User-data");
    const existingUser = await collection.findOne({ email: user.email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
    res.status(500).json({ message: `Error inserting user: ${error.message}` });
  }
});

// Enhanced `/login` endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const collection = db.collection("User-data");
    
    // Check if user exists
    const user = await collection.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
});

// Updated `/getproducts` endpoint
app.get("/getproducts", async (req, res) => {
  try {
    const products = await db.collection("Product-data").find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Customers Endpoint
app.get("/customers", async (req, res) => {
  try {
    const usersCollection = db.collection("User-data");
    const users = await usersCollection.find({}).toArray();

    if (users.length > 0) {
      return res.status(200).send({ message: users });
    }
    return res.status(404).send({ message: "No users found" });
  } catch (error) {
    res.status(500).json({ message: `Error fetching users: ${error.message}` });
  }
});

// Orders Endpoint
app.get("/orders", async (req, res) => {
  try {
    const orderCollection = db.collection("Order-data");
    const orders = await orderCollection.find({}).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Error fetching orders: ${error.message}` });
  }
});

// Start the server and connect to MongoDB
app.listen(PORT, "0.0.0.0", async () => {
  await connectToMongo();
  console.log(`Server is running on http://44.196.3.200:${PORT}`);
});
