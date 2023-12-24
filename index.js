const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1i8cb8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

    const usersCollection = client.db("taskManagementDB").collection("users")
    const tasksCollection = client.db("taskManagementDB").collection("tasks")


    // user related api
    app.post('/users', async (req, res) => {
      try {
        const newUser = req.body
        const query = { email: newUser.email }
        console.log(newUser);
        const existingUser = await usersCollection.findOne(query)
        if (existingUser) {
          return res.send({ message: 'User already exist', insertedId: null })
        }
        const result = await usersCollection.insertOne(newUser)
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })

    app.get('/users', async (req, res) => {
      try {
        const result = await usersCollection.find().toArray()
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })


    app.get('/users/:id', async (req, res) => {
      try {
        const id = req.params.id
        console.log(id);
        const query = {
          _id: new ObjectId(id)
        }
        const result = await usersCollection.findOne(query)
        console.log(result);
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })

    // tasks related api
    app.post('/tasks', async (req, res) => {
      try {
        const newTask = req.body
        const result = await tasksCollection.insertOne(newTask)
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })

    app.get('/tasks', async (req, res) => {
      try {
        const email = req.query.email
        query = { email: email };
        const result = await tasksCollection.find(query).toArray()
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })
    app.get('/tasks/:id', async (req, res) => {
      try {
        const id = req.params.id
        console.log(id);
        const query = {
          _id: new ObjectId(id)
        }
        const result = await tasksCollection.findOne(query)
        console.log(result);
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })

    app.patch('/tasks/:id', async (req, res) => {
      try {
        const updatedInfo = req.body
        const id = req.params.id
        const filter = {
          _id: new ObjectId(id)
        }
        const updatedTaskInfo = {
          $set: {
            title: updatedInfo.title,
            description: updatedInfo.description,
            deadline: updatedInfo.deadline,
            priority: updatedInfo.priority,
            email: updatedInfo.email,
            status: updatedInfo.status
          }
        }
        const result = await tasksCollection.updateOne(filter, updatedTaskInfo)
        res.send(result)
      }
      catch (err) {
        console.log(err);
      }
    })

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log("delete", id);
        const query = {
          _id: new ObjectId(id),
        };
        const result = await tasksCollection.deleteOne(query);
        console.log(result);
        res.send(result);
      }
      catch (err) {
        console.log(err);
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task Management App is running')
})

app.listen(port, () => {
  console.log(`Task Management App is running on port ${port}`);
})
