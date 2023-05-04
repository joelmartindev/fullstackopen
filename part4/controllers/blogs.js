const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  //I'd use findByID, but it keeps returning null when given a correct id
  const user = await User.findOne({ username: request.body.username })
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
    response.status(400).json()
  }

  else {
    try {
      const res = await blog.save()
      user.blogs = user.blogs.concat(res._id)
      await user.save()
      response.status(201).json(res)
    } catch (e) {
      next(e)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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