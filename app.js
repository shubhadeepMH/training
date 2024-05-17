const express = require('express');
const cors = require('cors');
const DbConnect = require('./public/DbConnect');
const addPost = require('./public/Controllers/addPost');
const postSchema = require('./public/Schemas/postSchema');
const WebSocket = require('ws');

// Create an Express application
const app = express();
const PORT = 8000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to the database


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
    res.json({postsLength:posts.length});
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

// Create an HTTP server using Express
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

let userCount = 0;

wss.on('connection', (ws) => {
  userCount++;
  console.log(`New connection. Total users: ${userCount}`);

  // Broadcast the new user count to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ userCount }));
    }
  });

  ws.on('close', () => {
    userCount--;
    console.log(`Connection closed. Total users: ${userCount}`);

    // Broadcast the updated user count to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ userCount }));
        console.log(userCount)
      }
    });
  });
});
