const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
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

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});