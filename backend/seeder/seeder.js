import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";


const seedproducts = async () => {
    try {

        await mongoose.connect("mongodb+srv://ayushsojitra19:&Ayush19@shopit.yzqq3iy.mongodb.net/?appName=shopit");

        await Product.deleteMany();
        console.log("All products deleted");

        await Product.insertMany(products);
        console.log("All products inserted");
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}
seedproducts();