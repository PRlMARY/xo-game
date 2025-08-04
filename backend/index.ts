import connectDB from "./src/database/connect.db";
import Elysia from "elysia";

connectDB();

const app = new Elysia();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});