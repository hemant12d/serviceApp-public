import appConfig from '../config/appConfig.js';

class ApiFeatures{

    constructor(chainQuery, clientOptions){
        this.chainQuery = chainQuery;
        this.clientOptions = clientOptions;       
    }


    // filter the document with regex
    filter(){

        let {...queryObj} = this.clientOptions;

        let popUpList = ["sort", "limit", "page", "fields", "search"];

        for(let pop of popUpList){
            delete queryObj[pop]
        }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        

        this.chainQuery = this.chainQuery.find(JSON.parse(queryStr));

        return this;
    };

    
    search(searchParams){

        if(this.clientOptions.search){
            let searchParameters = regexSearch_With_Parameters(searchParams, this.clientOptions.search)

            this.chainQuery = this.chainQuery.find(
                {
                    $or:searchParameters
                }
            );

        }


        return this;
    };

    // Select specific fields
    fields(){
        if(this.clientOptions.fields){
            // Parameter validation for sort
            let sortFileds = this.clientOptions.fields.split(',').join(' ');
            this.chainQuery = this.chainQuery.select(sortFileds);
        }
        else{
            this.chainQuery = this.chainQuery.select("-__v")
        }

        return this;
    };

    // sort the document
    sort(){

        if (this.clientOptions.sort) {
            let sortBy = this.clientOptions.sort.split(',').join(' ');

            // If there is no match for sortBy or sortBy is empty, then default accending order will be apply
            this.chainQuery = this.chainQuery.sort(sortBy);
        } else {
            // Default Sort (Newest Fast)
            this.chainQuery = this.chainQuery.sort('-createdAt');
        }

        return this;
    };

    // pagination and limit 
    paginate(){
        const page = this.clientOptions.page * 1 || 1;
        const limit = this.clientOptions.limit * 1 || appConfig.pageLimit;
        const skip = (page - 1) * limit;

        this.chainQuery = this.chainQuery.skip(skip).limit(limit);
        return this;
    };


}

export default ApiFeatures;