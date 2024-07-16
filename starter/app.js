const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Sample data: List of blog posts
let blogPosts = [
    { id: 1, title: 'First Post', content: 'This is the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the second post.' },
];

// GET /posts - Retrieve all blog posts
app.get('/posts', (req, res) => {
    res.status(200).json(blogPosts);
});

// GET /posts/:id - Retrieve a single blog post by ID
app.get('/posts/:id', (req, res) => {
    //convert the blog id in int and 10 use to convert in base 10 decimal
    const postId = parseInt(req.params.id, 10);
    const post = blogPosts.find(p => p.id === postId);

    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// POST /posts - Create a new blog post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = {
        id: blogPosts.length + 1,
        title,
        content,
    };

    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

// PUT /posts/:id - Update an existing blog post by ID
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    post.title = title;
    post.content = content;
    res.status(200).json(post);
});

// DELETE /posts/:id - Delete a blog post by ID
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = blogPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    blogPosts.splice(postIndex, 1);
    res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
