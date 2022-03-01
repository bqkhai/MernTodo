import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mvpzx.mongodb.net/MernTodo?retryWrites=true&w=majority`
        );
        console.log("Connected DB");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`);
});
