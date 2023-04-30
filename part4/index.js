const app = require('./app') // varsinainen Express-sovellus
const { PORT } = require('./utils/config')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })