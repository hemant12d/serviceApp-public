import dotenv from "dotenv";
dotenv.config();

import netWorkIp from "../devHelper/getNetworkIp.js";

const getBaseUrl = ()=>{    
    return `${process.env.ACTIVE_PROTOCOL}://${netWorkIp}:${process.env.APP_PORT}`
}

export default getBaseUrl;