const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
//config express.js
app.use(express.json())
app.set('port',3000)
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})


let db;
MongoClient.connect('mongodb+srv://aa5226:tiger@gettingstarted.tciwwxu.mongodb.net', (err,client) => {
    db = client.db('afterschool')
})

//display a message for root path to show that API is working
app.get('/', (req,res,next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

//get collection name
app.param('collectionName', (req,res,next,collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

//retrieve all the objects from a collection
app.get('/collection/:collectionName',(req,res,next)=>{
    req.collection.find({}).toArray((e,results)=>{
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName',(req,res,next)=>{
    req.collection.insert(req.body, (e,results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})


//run app
app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000')
})