import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_LOCAL);
    console.log("Database connection established");
  } catch (err) {
    console.log(err.msg);
    console.log(err.stack);
    console.log(err);
  }
};
export default dbConnect;