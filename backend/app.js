import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDatabase} from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

import path from "path";
// import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cookieParser());

if(process.env.NODE_ENV !== "PRODUCTION"){
dotenv.config({path:'backend/config/config.env'});
}

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
}); 


// connecting to database
connectDatabase();



app.use(express.json({ 
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
 }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// importing all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import { fileURLToPath } from "url";



app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*path", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
}

//Using middleware for errors
app.use(errorMiddleware);
app.set('query parser', 'extended'); 



const server = app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})