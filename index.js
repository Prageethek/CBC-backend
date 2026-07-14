import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRouter from "./routes/studentRouter.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import jwt from "jsonwebtoken";
import orderRouter from "./routes/orderRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {

	const token = req.header("Authorization")?.slice(7);
	if (token) {
		jwt.verify(token, process.env.JWT_KEY,
			(error, decoded) => {
				if (decoded) {
					req.user = decoded
					next();
					console.log(decoded)
				} else {
					res.status(403).json({
						message: "Invalid token"
					})
				}
			}
		)

	} else {
		next(); //login wage feauture walata token ekak na
	}

})

mongoose.connect(process.env.MONGODB_URL).then(() => {
	console.log("Database connected");
}).catch(() => {
	console.log("Failed to connect to db");
});


// app.use("/students", studentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);


app.listen(3000, () =>
	console.log("server is running on port 3000"));
