const express = require('express');
const cors = require('cors');
const DbConnect=require('./public/DbConnect')
const addPost=require('./public/Controllers/addPost')
const postSchema=require('./public/Schemas/postSchema')
// require('dotenv').config();


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
    res.send({success:true,message:"Post created succesfully"})
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})

app.post('/like-post',async(req, res) => {
 
  let post=await postSchema.findOne({uniqueId:req.body.uniqueId})
  let likes=post.likes
  post.likes=likes+1
  await post.save()
  
  // await postSchema.findOneAndUpdate({uniqueId: uniqueId},{likes:result.likes+1});
  res.send({success:true,message:"Post Liked"})


})
app.post('/comment', async(req, res) => {
  let post=await postSchema.findOne({uniqueId:req.body.uniqueId})
  let comment=req.body.comment
  post.comments.push(comment)
  await post.save()
  res.send({success:true,message:"Comment added"})
})
app.get('/posts',async(req,res)=>{
 let posts=await postSchema.find({board:req.body.board})
 res.send(posts)
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})