const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const accountDB = null; //how to import mongodb database

class AccountController {
    // Handle Google OAuth 2.0 login
    async login(req, res) {
      const token = req.body.token;
      try {
        const sessionToken = await this.createSession(token);
        res.cookie('session_token', sessionToken, { httpOnly: true, secure: true });
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    }
  
    // Verify Google OAuth 2.0 token and create user session
    async createSession(token) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        const user = await this.getUserByGoogleId(userId);
        if (!user) {
          // Create new user account
          const email = payload['email'];
          const name = payload['name'];
          const picture = payload['picture'];
          const newUser = await this.createUser(email, name, picture, userId);
          user = newUser;
        }
        const sessionToken = this.generateSessionToken(user);
        return sessionToken;
      } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid token');
      }
    }
  
    // Example user data storage functions
    async getUserByGoogleId(googleId) {
      queryDatabase(accountDatabase, googleId);
    }
    
    async createAccount(email, name, picture, googleId) {
      addToDatabase(accountDatabase, googleId);
    }
    
    generateSessionToken(user) {
      const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      };
      const options = { expiresIn: '1h' };
      const secret = 'YOUR_SESSION_SECRET';
      const sessionToken = jwt.sign(payload, secret, options);
      return sessionToken;
    }
  }
