const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id
  })

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).end()
  }

  else {
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    } catch (e) {
      next(e)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  if (request.token === undefined) {
    return response.status(401).json({ error: 'missing token' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  try {
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    if (blog.user.toString() === decodedToken.id.toString()) {
      await blog.deleteOne({_id: blog._id})
      response.status(204).end()
    } else {
      response.status(401).end()
    }
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  const req = request.body

  const blog = {
    title: req.title,
    author: req.author,
    url: req.url,
    likes: req.likes
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog)
    response.status(200).json(blog)
  } catch (e) {
    next(e)
  }
})

module.exports = blogsRouter