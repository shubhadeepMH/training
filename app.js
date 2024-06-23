const express = require('express');
const cors = require('cors');
const DbConnect = require('./public/DbConnect');
const addPost = require('./public/Controllers/addPost');
const postSchema = require('./public/Schemas/postSchema');
const Pusher = require("pusher");
const {shuffleArray} =require('./public/Utils/ShufflePosts')

const pusher = new Pusher({
  appId: "1804330",
  key: "85b16538859776a18088",
  secret: "7f1e7098ab6fe6d43835",
  cluster: "us3",
  useTLS: true
});

let userCount = 0;

// Create an Express application
const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to the database
// Real time user fetch
app.post('/increment-user-count', (req, res) => {
  userCount++;
  pusher.trigger('user-count', 'update', { userCount });
  res.sendStatus(200);
});

app.post('/decrement-user-count', (req, res) => {
  userCount--;
  pusher.trigger('user-count', 'update', { userCount });
  res.sendStatus(200);
});

// Define routes
app.get('/', (req, res) => {
  res.send("Home API");
});

app.post('/add-post', async (req, res) => {
  try {
    let post = new postSchema(req.body);
    await post.save();
    res.send({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/report', async (req, res) => {
  try {
    let post = await postSchema.findOne({ uniqueId: req.body.uniqueId });
    post.reports += 1;
    await post.save();
    res.send({ success: true, message: "Post reported" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.post('/comment', async (req, res) => {
  try {
    let post = await postSchema.findOne({ uniqueId: req.body.uniqueId });
    post.comments.unshift(req.body.comment);
    await post.save();
    res.send({ success: true, message: "Comment added" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Fetching all posts
app.post('/posts', async (req, res) => {
  try {
    let posts = await postSchema.find({ board: req.body.board }).sort({ date: -1 });
    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Fetching all reported posts
app.get('/reported-posts', async (req, res) => {
  try {
    const posts = await postSchema.find({ reports: { $gt: 0 } });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts with reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/all-posts', async (req, res) => {
  try {
    const posts = await postSchema.find();
    let shuffledPosts=shuffleArray(posts) //Shuffling the posts forcreate differnt feed for everyone.
    res.json({shuffledPosts});
  } catch (error) {
    console.error('Error fetching Number of all posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Deleting post
app.delete('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const deletedPost = await postSchema.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/trend-post",async(req,res)=>{
  const options = { new: true }; // Return the updated document
  let postUid=req.postUid;
  let post=await postSchema.findOneAndUpdate({uniqueId:postUid},{trending:true},options)
 
  res.send({message:"trending the post",success:true,data:post})

})

app.get("/trending",async(req,res)=>{
    let trendingPosts=await postSchema.find({trending:true}).sort({ 'comments.length': -1 });
    res.send({trending:trendingPosts})


})

// Create an HTTP server using Express
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});


