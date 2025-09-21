import jwt from 'jsonwebtoken';

async function verifyjwt(req, res, next){
    try{
    const token = req.cookies.accessToken;
    if(!token) return res.status(403).send('No access token');

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    req.user = decoded;
    //console.log(decoded);
    next();
    
}catch(e){ return res.status(401).send('Invalid or expired access token'); }
}

export default verifyjwt;