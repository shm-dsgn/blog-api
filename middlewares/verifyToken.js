import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
  
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.sendStatus(403);
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  