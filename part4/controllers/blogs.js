const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json()
  }

  else {
    const res = await blog.save()
    response.status(201).json(res)
  }
})

module.exports = blogsRouter