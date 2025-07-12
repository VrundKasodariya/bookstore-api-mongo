import express, { json } from 'express';
const app = express();
import { ObjectId } from 'mongodb';
import { connectToDb, getDb } from './db.js';

const port = 3000;
app.use(express.json());
let db;
connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            `Listening on port ${port}.`;
        })
        db = getDb();
    }
})

app.get('/books', (req, res) => {

    db.collection("books")
        .find()
        .sort({ author: 1 })
        .toArray()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Could not fetch the documents" });
        });
});

app.get('/books/:id',(req,res)=>{
    let id = req.params.id;
    if(ObjectId.isValid(id)){

    
    db.collection('books')
    .findOne({_id: new ObjectId(id)})
    .then((doc)=>{
        res.status(200).json(doc);
    })
    .catch((err)=>{
        res.status(500).json({error:"Could not fetch"});
    })
    } else{
        res.status(500).json({error:"Not valid Object Id."});
    }
    
})

app.post('/books',(req,res)=>{
    const book = req.body;

    db.collection('books')
    .insertOne(book)
    .then((result)=>{
        res.status(201).json(result);
    })
    .catch((err)=>{
        res.status(500).json({err:"Cannot upload."});
    })
})

app.delete('/books/:id',(req,res)=>{
    let id = req.params.id;
    if(ObjectId.isValid(id)){
        db.collection('books')
        .deleteOne({_id : new ObjectId(id)})
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((err)=>{
            res.status(500).json({err:"Could not delete."});
        })
    }else{
        res.status(500).json({err:"Not a valid id."});
    }
})

app.patch('/books/:id',(req,res)=>{
    const updates = req.body;
    let id = req.params.id;
    if(ObjectId.isValid(id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(id)},{$set:updates})
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((err)=>[
            res.status(500).json({err:"Could not update."})
        ])
    }else{
        res.status(500).json({err:"Not a valid id."})
    }
})