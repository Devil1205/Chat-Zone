const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const fetchUser = async (req,res,next)=>{
    const authToken = req.header('auth-token');
    // console.log(authToken);
    if(!authToken)
    {
        return res.status(401).json({error: "Unautharized access. Please kindly login."});
    }
    try {
        const data = jwt.verify(authToken,jwt_secret);
        // console.log(data);
        req.user = data.user;
        // console.log(req.user);
    } catch (error) {
        return res.status(401).json({error: "Unautharized access. Please kindly login."});
    }
    next();
}

module.exports = fetchUser;