import connectDB from "./src/database/connect.db";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { userRoutes } from "./src/routes/userRoutes";

connectDB();

const app = new Elysia()
    .use(cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true
    }))
    .use(userRoutes)
    .get('/', () => ({ message: 'XO Game API Server' }))
    .get('/health', () => ({ status: 'healthy', timestamp: new Date().toISOString() }));

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
    console.log("📚 API Documentation: http://localhost:3000/swagger");
});