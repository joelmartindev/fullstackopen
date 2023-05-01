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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}