import getBaseUrl from "./App/utils/getBaseUrl.js";

// Make connection to the database
import DB from "./DB.js"; DB();

// Node app
import App from "./App.js";


// Server listing on local host
App.listen(process.env.APP_PORT * 1, () => {
    console.log(`Local : http://127.0.0.1:${process.env.APP_PORT * 1}`);
    console.log("On network : " + getBaseUrl());
});