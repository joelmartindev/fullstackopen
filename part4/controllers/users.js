const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username === undefined || name === undefined || password === undefined) {
    return response.status(400).json({ error: "Missing request parameters" })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: "Password is too short" })
  }
  
  //Unique username validation
  if (await User.findOne({ username: username})) {
    return response.status(400).json({ error: "expected `username` to be unique" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter