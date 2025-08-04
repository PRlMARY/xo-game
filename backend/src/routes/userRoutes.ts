import { Elysia, t } from 'elysia';
import { signup, login } from '../controller/userController';

export const userRoutes = new Elysia({ prefix: '/api/auth' })
    .post('/signup', async ({ body, set }) => {
        const result = await signup(body);
        
        if (!result.success) {
            set.status = 400;
        }
        
        return result;
    }, {
        body: t.Object({
            username: t.String({
                minLength: 5,
                maxLength: 20,
                description: 'Username must be between 5 and 20 characters'
            }),
            password: t.String({
                minLength: 8,
                description: 'Password must be at least 8 characters long'
            })
        }),
        detail: {
            summary: 'User Signup',
            description: 'Create a new user account',
            tags: ['Authentication']
        }
    })
    .post('/login', async ({ body, set }) => {
        const result = await login(body);
        
        if (!result.success) {
            set.status = 401;
        }
        
        return result;
    }, {
        body: t.Object({
            username: t.String({
                description: 'Username'
            }),
            password: t.String({
                description: 'Password'
            })
        }),
        detail: {
            summary: 'User Login',
            description: 'Authenticate user',
            tags: ['Authentication']
        }
    });
