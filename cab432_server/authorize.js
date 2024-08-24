const jwt = require("jsonwebtoken");

// Middleware for authorization
const authorize = (req, res, next) => {
    const authorization = req.headers.authorization;
    let token = null;
  
    if (authorization && authorization.split(" ").length === 2){
      token = authorization.split(" ")[1];
      /* **** token will be outputted to console if the token is set correctly ( as "Bearer <token info>"" will be added into the header as the 
      field "authorization" by JWT) **** */
      console.log("Token: ", token);
    }
    else{
      return res.status(401).json({
        error: true,
        message: "Authorisation failed, no token"
      })
    }
  
    // **** validating the token by decoding it with the secret key ****
    try{
      const secretKey = 'your_secret_key';
      const decoded = jwt.verify(token, secretKey)
      
  
      if (decoded.exp > Date.now()){  // **** Date.now() has passed the expiry date ****
        console.log("Token has expired")
        return res.status(401).json({
          error: true,
          message: "Expired token"
        })
      }
      console.log(decoded)
      req.username = decoded.username;
      req.id = decoded.id;
      next();
    }
    catch(err){
      res.status(401).json({
        error: true,
        message: "Token invalid,", err
      })
    }
    
  }

module.exports = authorize;