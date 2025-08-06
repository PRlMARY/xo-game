import connectDB from "./src/database/connect.db";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { userRoutes } from "./src/routes/userRoutes";
import { gameRoutes } from "./src/routes/gameRoutes";

connectDB();

const app = new Elysia()
    .use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .onError(({ code, error, set }) => {
        console.error('Server Error:', code, error);
        
        if (code === 'VALIDATION') {
            set.status = 400;
            return { error: 'Validation failed', message: 'Invalid request data' };
        }
        
        set.status = 500;
        return { error: 'Internal server error', message: 'Something went wrong' };
    })
    .use(userRoutes)
    .use(gameRoutes)
    .get('/', () => ({ message: 'XO Game API Server' }))
    .get('/health', () => ({ status: 'healthy', timestamp: new Date().toISOString() }));

app.listen(3000, () => {
    console.log("Server running on port 3000");
    console.log("API Documentation: http://localhost:3000/swagger");
});