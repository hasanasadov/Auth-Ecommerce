import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@has.3480r.mongodb.net/Auth-Ecommerce?retryWrites=true&w=majority&appName=Cluster0`
  );
}
