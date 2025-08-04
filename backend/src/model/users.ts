import { Schema, model, Document } from 'mongoose';

interface IGameHistory {
    mode: "pvp" | "pve";
    settings: {
        column: number;
        row: number;
    };
    moves: {
        player: "X" | "O";
        row: number;
        column: number;
    }[];
    winner: "X" | "O" | "draw";
    status: "complete" | "ongoing" | "incomplete";
}

const GameHistorySchema = new Schema<IGameHistory>({
    mode: {
        type: String,
        enum: ['pvp', 'pve'],
        required: true
    },
    settings: {
        column: {
            type: Number,
            required: true,
            min: 3,
            max: 10
        },
        row: {
            type: Number,
            required: true,
            min: 3,
            max: 10
        }
    },
    moves: [{
        player: {
            type: String,
            enum: ['X', 'O'],
            required: true
        },
        row: {
            type: Number,
            required: true
        },
        column: {
            type: Number,
            required: true
        }
    }],
    winner: {
        type: String,
        enum: ['X', 'O', 'draw'],
        required: true
    },
    status: {
        type: String,
        enum: ['complete', 'ongoing', 'incomplete'],
        required: true
    }
});

interface IUser extends Document {
    username: string;
    password: string;
    history: IGameHistory[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    history: {
        type: [GameHistorySchema],
        default: []
    }
}, { timestamps: true });

export default model<IUser>('User', UserSchema);