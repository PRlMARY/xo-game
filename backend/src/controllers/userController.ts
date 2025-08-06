import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/users';

interface SignupRequest {
    username: string;
    password: string;
}

interface SignupResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        username: string;
        createdAt: Date;
    };
}

export const signup = async (body: SignupRequest): Promise<SignupResponse> => {
    try {
        const { username, password } = body;

        if (!username || !password) {
            return {
                success: false,
                message: 'Username and password are required'
            };
        }

        if (username.length < 5 || username.length > 20) {
            return {
                success: false,
                message: 'Username must be between 5 and 20 characters'
            };
        }

        if (password.length < 8) {
            return {
                success: false,
                message: 'Password must be at least 8 characters long'
            };
        }

        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username: username.trim(),
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
        const token = jwt.sign(
            { userId: (savedUser._id as any).toString() },
            JWT_SECRET,
            { expiresIn: '3h' }
        );

        return {
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: (savedUser._id as any).toString(),
                username: savedUser.username,
                createdAt: savedUser.createdAt
            }
        };

    } catch (error) {
        console.error('Signup error:', error);
        
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }

        return {
            success: false,
            message: 'Internal server error'
        };
    }
};

export const login = async (body: { username: string; password: string }) => {
    try {
        const { username, password } = body;

        if (!username || !password) {
            return {
                success: false,
                message: 'Username and password are required'
            };
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
        const token = jwt.sign(
            { userId: (user._id as any).toString() },
            JWT_SECRET,
            { expiresIn: '3h' }
        );

        return {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: (user._id as any).toString(),
                username: user.username,
                createdAt: user.createdAt
            }
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Internal server error'
        };
    }
};
