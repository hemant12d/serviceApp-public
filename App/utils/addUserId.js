const adduserId = (req, res, next)=>{
    req.body.user = req.user._id
    next();
}

export default adduserId;