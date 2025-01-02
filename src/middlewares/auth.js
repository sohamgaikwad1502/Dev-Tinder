const auth = (req,res,next) => 
{
    console.log("authenticating admin");
    const token = 'xyz';
    const result = token === 'xyz';
    if (result) {
        next();
    }
    else 
    {
        res.status(401).send("Authentication Failed");
    }
        
}

const userAuth = (req,res,next) =>{
    const token = "xyz";
    const result = token === 'xyz';
    if (result)
    {
        next()
    }
    else{
        res.status(401).send("Invalid User")
    }
}

module.exports = {auth,userAuth};