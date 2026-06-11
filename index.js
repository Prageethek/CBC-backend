import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRouter from "./routes/studentRouter.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {

	const token = req.header("Authorization")?.slice(7);
	if (token) {
		jwt.verify(token, "jwt-secretKey",
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

	}else {
		next(); //login wage feauture walata token ekak na
	}

})

mongoose.connect("mongodb+srv://admin:123@cluster0.fp9wfgh.mongodb.net/?appName=Cluster0").then(() => {
	console.log("Database connected");
}).catch(() => {
	console.log("Failed to connect to db");
});


// app.use("/students", studentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);

app.listen(3000, () =>
	console.log("server is running on port 3000"));
