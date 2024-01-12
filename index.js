const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//listtubeUser
//m9ptmDKGUTznNRBx

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const filesCollection = client.db("listtubeDB").collection("blog");
    //  const resourcesCollection = client.db("easyCodeDB").collection("resources");

    //const userCollection = client.db("bistroDB").collection("users");

    const picCollection = client.db("myTube").collection("picStore");
    const CPersonCollection = client.db("myTube").collection("CPerson");

    //CPerson releted
    app.get("/cPerson", async (req, res) => {
        const result = await CPersonCollection.find().toArray();
        res.send(result);
      });


    //pic related

    app.get("/pic", async (req, res) => {
      const result = await picCollection.find().toArray();
      res.send(result);
    });

    app.post("/pic", async (req, res) => {
      const item = req.body;
      const result = await picCollection.insertOne(item);
      res.send(result);
    });

    //update
    app.put("/cPerson/:id", async (req, res) => {
      try {
        const id = req.params.id;

        console.log("update id : ", id);

        const filter = { _id: new ObjectId(id) };

        const options = { upsert: true };

        const updatedBook = req.body;

       
        const book = {
          $set: {
          
            ...updatedBook,
          },
        };

        const result = await CPersonCollection.updateOne(filter, book, options);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("List Tube IS RUNNING");
});

app.listen(port, () => {
  console.log(`List Tube is running on Port , ${port}`);
});
