const countDocument = async (Model, options = null) => {
    let query = Model.find();

    if(options)
    query = query.find(options);

    return await query.count();
}

export default countDocument;