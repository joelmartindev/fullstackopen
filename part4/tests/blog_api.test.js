const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: 'someaddress.com',
        likes: 5
    },
    {
        title: "React patterns 2",
        author: "Michael Chan",
        url: 'someaddress.com',
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('there are 2 blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(2)
})

test('there is an id field', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body[0].id).toBeDefined()
})

test('adding a blog', async () => {
    const response = await api.post('/api/blogs')
        .send({
            title: 'Testing with Jest',
            author: 'Test Testerson',
            url: 'someaddress.com',
            likes: 1
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toMatchObject({
        title: 'Testing with Jest',
        author: 'Test Testerson',
        url: 'someaddress.com',
        likes: 1
    })

    const newBlogs = await Blog.find({})
    expect(newBlogs).toHaveLength(3)
})

test('likes are 0 if not specified', async () => {
    const response = await api.post('/api/blogs')
        .send({
            title: 'Testing with Jest',
            author: 'Test Testerson',
            url: 'someaddress.com'
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
})

test('if title and url missing, send status code 400', async () => {
    const response = await api.post('/api/blogs')
        .send({
            title: 'Testing with Jest',
            author: 'Test Testerson',
            likes: 1
        })
        .expect('Content-Type', /application\/json/)
        .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})