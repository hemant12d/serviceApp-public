const addIdToParams = (req, res, next)=>{
    req.params.id = req.user._id;
    next();
}

export default addIdToParams;