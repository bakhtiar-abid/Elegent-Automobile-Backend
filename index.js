const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xztta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

console.log(uri);

async function run() {
   try {
      await client.connect();
      console.log("Connected to MongoDB");
      const database = client.db("elegent_automobile");
      const vehiclesCollection = database.collection("vehicles");
      const ordersCollection = database.collection("orders");
      const usersCollection = database.collection("users");

      app.get("/vehicles", async (req, res) => {
         //  const email = req.query.email;
         //  const date = req.query.date;

         //  const query = { email: email, date: date };

         const cursor = vehiclesCollection.find({});
         const result = await cursor.toArray();
         res.json(result);
      });

      //GET Single Item API
      app.get("/vehicles/:id", async (req, res) => {
         const id = req.params.id;
         console.log("getting specific plan", id);
         const query = { _id: ObjectId(id) };
         const service = await vehiclesCollection.findOne(query);
         res.json(service);
      });

      //POST PLACE ORDER API
      app.post("/placeorder", async (req, res) => {
         const orderData = req.body;
         console.log("orderData", orderData);
         const result = await ordersCollection.insertOne(orderData);
         res.json(result);
      });

      //USERS API
      app.post("/users", async (req, res) => {
         const user = req.body;
         const result = await usersCollection.insertOne(user);
         console.log(result);
         res.json(result);
      });
   } finally {
      // await client.close();
   }
}

run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Elegent Automobile Server is running!");
});

app.listen(port, () => {
   console.log(`listening at ${port}`);
});
