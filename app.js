const express = require('express');

const app = express()
const PORT = 8000

app.get('/', (req, res) => {
  res.send([
    {
    "name":"rohan",
    "age":45,
    "prof":"Teacher"
  },
    {
    "name":"Manas",
    "age":25,
    "prof":"Accountant"
  },
    {
    "name":"Rajiv",
    "age":35,
    "prof":"Doctor"
  },
])
})

app.get('/about', (req, res) => {
  res.send('About Page🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})