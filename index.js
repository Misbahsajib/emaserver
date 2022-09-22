const express = require('express')
const app = express()
var cors = require('cors')
const port =process.env.PORT || 5000
app.use(express.json())
require('dotenv').config()
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_name}:${process.env.PASS_word}@cluster0.4tiocny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();

        const dataCollection=client.db("emajhon").collection("allproduct");
       
        app.get('/myproduct',async(req,res)=>{
          console.log('query',req.query)
          const page=parseInt(req.query.page)
          const size=parseInt(req.query.size)
            const query={}
            let products;
            const cursor =dataCollection.find(query)
            if(page || size){
              products=await cursor.skip(page*size).limit(size).toArray();
            }
            else{
              products=await cursor.toArray();
            }
          
            res.send(products)
        })

        app.get('/productCount',async(req,res)=>{
          // const query={}
          // const cursor =dataCollection.find((query))
          const count=await dataCollection.estimatedDocumentCount();
          res.send({count})
        })

        // post

        app.post('/productbykeys',  async(req,res)=>{
          const keys=req.body;
          const ids=keys.map(id=>ObjectId(id))
          const query={_id:{$in:ids}}
          const cursor=dataCollection.find(query)
          const products=await cursor.toArray();
          console.log(keys)
          res.send(products)
        })

      }
    finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('hello count')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})