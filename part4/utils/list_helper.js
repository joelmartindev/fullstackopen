const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    
    return blogs.length === 0
        ? 0
        : blogs.reduce((total, currentBlog) => total + currentBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    // returns last blog with greatest value of likes
    return blogs.reduce((favorite, current) => {
        return favorite.likes > current.likes
        ? favorite
        : {title: current.title, author: current.author, likes: current.likes}
    }, {likes: -1})
}

const mostBlogs = (blogs) => {
    //Array of authors and their blogs. Adds an author if not found already, otherwise adds to their blog count per blog
    const authors = blogs.reduce((acc, cur) => {
        const author = cur.author
        if (!acc[author]) {
          acc[author] = { author: author, blogs: 0 }
        }
        acc[author].blogs++
        return acc
      }, {})
      
      return Object.values(authors).reduce((max, cur) => max.blogs > cur.blogs ? max : cur)
}
const mostLikes = (blogs) => {
    //Array of authors and their blogs. Adds an author if not found already, otherwise adds to their blog count per blog
    const authors = blogs.reduce((acc, cur) => {
        const author = cur.author
        if (!acc[author]) {
          acc[author] = { author: author, likes: 0 }
        }
        acc[author].likes += cur.likes
        return acc
      }, {})
      
      return Object.values(authors).reduce((max, cur) => max.likes > cur.likes ? max : cur)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}