const express = require('express');
const cors = require('cors');
const DbConnect=require('./public/DbConnect')
const addPost=require('./public/Controllers/addPost')
const postSchema=require('./public/Schemas/postSchema')
require('dotenv').config();


const app = express()
const PORT = 8000

// Middleweares
app.use(express.json())
app.use(cors());

// Connect to Data Base
 

app.get('/',(req,res)=>{
  res.send("Home Api")
})
app.post('/add-post',async (req, res) => {
  try {
    let post=new postSchema(req.body)
    await post.save()
    res.send({status:"Okay",message:"Post created succesfully"})
  } catch (error) {
    console.log(error);
  }
})

app.post('/like-post', (req, res) => {

})
app.post('/comment-post', (req, res) => {

})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})