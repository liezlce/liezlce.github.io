const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: 'fZyee5InYPNlO7uOmy5DOUTeDay612tN',
  issuerBaseURL: 'https://dev-5llc17ro8lwz6ecr.us.auth0.com',
  secret: '-Tzi1Q_f-DC21h0Ncv3oYwGkoIib7HATbJvsRahEtB23mB1dteao_wv8S52jq87F'
};

// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
app.use(auth(config));

// req.oidc.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  )
});

// The /profile route will show the user profile as JSON
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function connect() {
  await mongoose.connect("mongodb+srv://abigaelluetaa:<y4eXjFND-yzs!pK>@cluster0.qwy4fob.mongodb.net/test") // MAYBE CHANGE THIS TO MY OWN?????
}

const messageSchema = new mongoose.schema({
  to: String,
  content: String,
  from: String,
  time: Date
})

const Message = mongoose.model('Message', messageSchema)

app.get("/chat/:from/:to", async (req, res) => {
  const foundMes = await Message.find({$or: [{$and: [{to: req.params.to, from:req.params.from}, {to:req.params.from, from:req.params.to}]}]});
  return res.send(foundMes)
})

app.post("/chat/send/:from/:to", async (req, res) => {
  var today = new Date();
  const newMessage = new Message({to:req.body.to, content:req.body.content, from:req.body.from, time:today})
  return res.send(newMessage)
})

connect().catch(err => console.log(err))

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});