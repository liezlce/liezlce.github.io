const express = require('express');
const app = express();
const http = require('http').createServer(app);

// set up middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});