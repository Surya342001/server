// const express = require("express");
// const app = express();
// var Mongoclient = require("mongodb").MongoClient;
// const multer = require("multer");
// require("dotenv").config();
// var CONNECTION_STRING = process.env.CONNECTION_STRING;
// var DATABASENAME = "Templedb";

// var database;

// app.listen(3001, () => {
//   Mongoclient.connect(CONNECTION_STRING, (error, client) => {
//     console.log("the connection string is ", CONNECTION_STRING);
//     if (error) {
//       console.error("Error connecting to the database:", error);
//       return;
//     }
//     database = client.db(DATABASENAME);
//     console.log(database);
//     console.log("Connected to the database");
//   });
// });

// const cors = require("cors");
// const { User } = require("./config");
// require("dotenv").config();
// const port = process.env.PORT;

// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/create", async (req, res) => {
//   const data = req.body;

//   console.log("the data of users ", data);

//   await User.add(data);
//   res.send({ msg: "User created successfully" });
// });

// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });
// const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend origin
  })
);

const uri = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 3001;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
};

const client = new MongoClient(uri, options, {
  serverApi: ServerApiVersion.v1,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World from Express server!");
});

app.get("/api/users", async (req, res) => {
  const users = await client
    .db("Templedb")
    .collection("Templedb")
    .find()
    .toArray();
  res.json(users);
});

app.listen(PORT, async () => {
  try {
    await client.connect();
    console.log(`Connected successfully to MongoDB!,running port in ${PORT}`);

    const pingResult = await client.db("admin").command({ ping: 1 });
    console.log("MongoDB ping result:", pingResult);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
});

async function getTemples() {
  try {
    await client.connect();
    const database = client.db("Templedb");
    const collection = database.collection("Templedb");

    const temples = await collection.find().toArray();
    return temples;
  } catch (error) {
    console.error("Error retrieving temples:", error);
    throw error; // Re-throw the error for handling in the route
  } finally {
    await client.close();
  }
}

// GET API to retrieve all temples from the collection
app.get("/api/temples", async (req, res) => {
  try {
    const temples = await getTemples();
    res.json(temples);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving temples" });
  }
});

// GET API to retrieve specific temple by name
app.get("/api/temples/:templeName", async (req, res) => {
  const { templeName } = req.params;

  try {
    const temple = await client
      .db("Templedb")
      .collection("Templedb")
      .findOne({ templeName });
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }
    res.json(temple);
  } catch (error) {
    console.error("Error retrieving temple:", error);
    res.status(500).json({ message: "Error retrieving temple" });
  } finally {
    await client.close();
  }
});

app.post("/submit-form", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Templedb");
    const collection = database.collection("Templedb");

    const formData = req.body;
    const result = await collection.insertOne(formData);
    res
      .status(200)
      .json({ message: "Form data submitted successfully", result });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json("Error submitting form data");
  } finally {
    await client.close();
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
