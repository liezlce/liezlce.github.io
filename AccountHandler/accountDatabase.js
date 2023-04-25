const express = require("express")
const app = express()

var cors = require('cors')
app.use(cors())

const mongoose = require('mongoose');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { OAuth2Client } = require('google-auth-library'); //for account verification
const jwt = require('jsonwebtoken');

const CLIENT_ID = '<YOUR_CLIENT_ID.apps.googleusercontent.com>';
const client = new OAuth2Client(CLIENT_ID);

connect().catch(err => console.log(err))

async function connect() {
    await mongoose.connect("mongodb+srv://abigaelluetaa:<y4eXjFND-yzs!pK>@cluster0.qwy4fob.mongodb.net/test")
}

const accountSchema = new mongoose.schema({
    googleID: String,
    email: String
})

const Account = new mongoose.model('Account', accountSchema)

// Handle Google OAuth 2.0 login
app.post('/login', async (req, res) => {
  const token = req.body.token;
  try {
      const sessionToken = await createSession(token);
      res.cookie('session_token', sessionToken, { httpOnly: true, secure: true });
      res.status(200).json({ success: true });
  } catch (error) {
      res.status(401).json({ error: error.message });
  }
});

// Verify Google OAuth 2.0 token and create user session 
async function createSession(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token, 
      audience: CLIENT_ID})
    const payload = ticket.getPayload();
    if (!payload.email_verified) {
      throw new Error("Email not verified");
    }
    let account = await Account.findById(payload.sub);

    if (!account) {
      //create a new account
      account = new Account({
        googleId: payload.sub,
        email: payload.email,
      });
      await account.save();
    }
    return res.send(newAcc)
  }

  catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Invalid token');
  }
}
// app.post("/new", async (req, res) => {
//     const {token} = req.body;
//     try {
//       const ticket = await client.verifyIdToken({idToken: token, audience: CLIENT_ID})
//       const payload = ticket.getPayload();
//       if (!payload.email_verified) {
//         throw new Error("Email not verified");
//       }
//       let account = await Account.findById(payload.sub);

//       if (!account) {
//         //create a new account
//         account = new Account({
//           googleId: payload.sub,
//           email: payload.email,
//         });
//         await account.save();
//       }
//       return res.send(newAcc)
//     }

//     catch (error) {
//       console.error('Error verifying Google token:', error);
//       throw new Error('Invalid token');
//     }
    
// })

app.get("/accounts", async (req, res) => {
    const foundAcc = await Account.find();
    return res.send(foundAcc)
})


app.get("/account/:id", async (req, res) => {
    let id = req.params.id
    const foundAcc = await Account.findById(req.params.id);
    return res.send(foundAcc)
})


app.get("/delete/:id", async (req, res) => {
    let id = req.params.id
    const foundAcc = await Account.findByIdAndDelete(req.params.id);
    return res.send(foundAcc)
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
})

