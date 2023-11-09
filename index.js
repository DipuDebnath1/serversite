
const express = require("express")
const cors = require("cors")
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
require('dotenv').config()


// USER_NAME
// USER_PASS


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.sqwmnep.mongodb.net/?retryWrites=true&w=majority`;

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


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const roomsCollections = client.db("hotel").collection("rooms");
    const roomsBookingCollections = client.db("hotel").collection("bookig");

    app.get('/rooms', async (req, res) => {
      const cursor = await roomsCollections.find().toArray();
      res.send(cursor)

    })
    app.get('/rooms/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollections.findOne(query)
      res.send(result)

    })

    // booking post 
    app.post('/bookigs', async (req, res) => {
      const bookigInfo = req.body
      const addedData = roomsBookingCollections.find()
      console.log(addedData);
      // const result = await roomsBookingCollections.insertOne(bookigInfo);
      // res.send(result)

      const bookingId = bookigInfo._id
      const isexsit = await roomsBookingCollections.findOne({ _id: bookingId })
      if (isexsit) {
        res.send({ acknowledged: false })
      }
      else {
        const result = await roomsBookingCollections.insertOne(bookigInfo)
        res.send(result)
      }

    })

    app.get('/bookigs', async (req, res) => {
      const result = await roomsBookingCollections.find().toArray()
      res.send(result)
    })

    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id
      const result = await roomsBookingCollections.deleteOne({ _id: id })
      res.send(result)
    })

    //upadate booking date 


    app.patch('/booking/:id', async (req, res) => {
      const _id = req.params.id;
      const data = req.body;
      const options = { upsert: true };
      const updateDocument = {
        $set: {
          day: data.day,
          month: data.month,
          year: data.year,
        }

      }
      const result = await roomsBookingCollections.updateOne({ _id }, updateDocument, options)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // await client.close();

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hotel server in running')
})

app.listen(port, () => {
  console.log(`server in running port : ${port}`);

})