const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

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

describe('Tests on initial blogs', () => {
    
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
})
describe('Adding blogs', () => {

    let token = ''
    beforeAll(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekrit', 10)
        const user = await new User({ username: 'Testman', passwordHash }).save()

        const tokenUser = { username: 'Testman', id: user.id }
        return (token = jwt.sign(tokenUser, process.env.SECRET))
    })

    test('adding a blog successfully', async () => {
        const response = await api.post('/api/blogs')
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Testing with Jest',
                author: 'Test Testerson',
                likes: 1
            })
            .expect(400)
    })

    test('fails with 401 if no token is provided', async () => {
        const response = await api.post('/api/blogs')
            .send({
                title: 'Testing with Jest',
                author: 'Test Testerson',
                likes: 1
            })
            .expect(401)
    })
})

describe('Deleting blogs', () => {

    let token = ''
    beforeAll(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('sekrit', 10)
        const user = await new User({ username: 'Testman', passwordHash }).save()

        const tokenUser = { username: 'Testman', id: user.id }
        token = jwt.sign(tokenUser, process.env.SECRET)

        const newBlog = {
            title: "React patterns 3",
            author: "Michael Chan",
            url: 'someaddress.com',
            likes: 2
        }

        const res = await api.post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect("Content-Type", /application\/json/)
            .expect(201)
    })

    test('deleting a single blog', async () => {
        const blog = await Blog.find({ title: "React patterns 3" })
        await api.delete(`/api/blogs/${blog[0]._id.toString()}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204)

        const blogAfter = await Blog.find({ title: "React patterns 3" })
        expect(blogAfter).toEqual([])
    })
})

describe('Editing blogs', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        let blogObject = new Blog(initialBlogs[0])
        await blogObject.save()
        blogObject = new Blog(initialBlogs[1])
        await blogObject.save()
    })

    test('Editing a single blog', async () => {
        const blog = await Blog.find({ title: "React patterns 2" })

        const newBlog = {
            title: blog[0].title,
            author: blog[0].author,
            url: blog[0].url,
            likes: blog[0].likes + 1
        }
        await api.put(`/api/blogs/${blog[0]._id.toString()}`)
            .set('Content-Type', 'application/json')
            .send(newBlog)
            .expect(200)

        const blogAfter = await Blog.find({ title: "React patterns 2" })
        expect(blogAfter[0].likes).toBe(3)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})