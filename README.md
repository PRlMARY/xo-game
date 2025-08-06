# XO Game (Tic-Tac-Toe)

## การติดตั้งและ Setup

### ข้อกำหนดของระบบ
- **Bun** (v1.2.18)
- **MongoDB**
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd xo-game
```

### 2. Setup Backend

#### ติดตั้ง Dependencies
```bash
cd backend
bun install
```

#### ตั้งค่า Environment Variables
```bash
# คัดลอกตัวอย่างไฟล์ environment
cp .env.example .env

# แก้ไขไฟล์ .env
nano .env
```

**ตัวอย่าง .env:**
```env
MONGO_URI=mongodb://localhost:27017/xo-game
JWT_SECRET=your-secret-jwt-key-at-least-32-characters
PORT=3000
```

### 3. Setup Frontend

#### ติดตั้ง Dependencies
```bash
cd ../frontend
bun install
```

## วิธีการรันโปรแกรม

### Development Mode

#### เริ่ม Backend Server
```bash
cd backend
bun run dev
```
**Backend จะรันที่:** `http://localhost:3000`

#### เริ่ม Frontend Server
```bash
# เปิด Terminal ใหม่
cd frontend
bun run dev
```
**Frontend จะรันที่:** `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd frontend
bun run build
```

#### Start Production Backend
```bash
cd backend
bun run start
```

## การออกแบบโปรแกรม

### สถาปัตยกรรมระบบ (System Architecture)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│  (React + TS)   │◄──►│ (Bun + Elysia)  │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 3000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Algorithm ที่ใช้

### 1. Win Detection Algorithm

**Complexity**: O(n) where n = board size

```typescript
function checkWinner(board: Board, lastMove: {row: number, col: number}): Winner {
  const { row, col } = lastMove;
  const player = board[row][col];
  
  // ตรวจแนวนอน (Horizontal)
  // ตรวจแนวตั้ง (Vertical)  
  // ตรวจแนวทแยง (Diagonal)
  // ตรวจแนวทแยงย้อน (Anti-diagonal)
}
```

**การทำงาน:**
- ตรวจสอบเฉพาะบริเวณที่มีการเดินล่าสุด
- ใช้การนับต่อเนื่องในแต่ละทิศทาง
- รองรับบอร์ดทุกขนาด (3x3 ถึง 10x10)

### 2. Bot AI Algorithm (Strategic AI)

**Complexity**: O(n²) where n = number of empty cells

```typescript
class BotAI {
  getBestMove(board: Board): Move {
    const winMove = this.findWinningMove(board, 'O');
    const blockMove = this.findWinningMove(board, 'X');
    const strategicMove = this.findStrategicMove(board);
    
    return winMove || blockMove || strategicMove;
  }
}
```

**กลยุทธ์ AI:**
1. **Winning**: หาการเดินที่ทำให้ชนะทันที
2. **Blocking**: บล็อกการเดินที่ฝ่ายตรงข้ามจะชนะ
3. **Strategic**: เลือกตำแหน่งที่มีศักยภาพสูงสุด
   - มุมบอร์ด (สำหรับบอร์ดเล็ก)
   - ตรงกลาง (สำหรับบอร์ดใหญ่)
   - ตำแหน่งที่สร้างโอกาสชนะได้หลายทาง

### 3. Board State Reconstruction Algorithm

**Complexity**: O(m) where m = number of moves

```typescript
function reconstructBoardState(moves: Move[], targetIndex: number): Board {
  const board = createEmptyBoard(rows, columns);
  
  for (let i = 0; i <= targetIndex; i++) {
    const move = moves[i];
    board[move.row][move.column] = move.player;
  }
  
  return board;
}
```

**การทำงาน:**
- สร้างบอร์ดใหม่และเล่นการเดินทุกครั้งจนถึงจุดที่ต้องการ
- ใช้ในระบบ Replay สำหรับแสดงสถานะบอร์ดในแต่ละขั้นตอน

### 4. JWT Authentication Algorithm

```typescript
// Token Generation
function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '3h' }
  );
}

// Token Verification
function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET);
}
```

### 5. Password Hashing Algorithm

```typescript
// เข้ารหัสรหัสผ่าน
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ตรวจสอบรหัสผ่าน
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

## โครงสร้างโปรเจค

```
xo-game/
├── README.md
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.ts    # Authentication logic
│   │   │   └── gameController.ts    # Game history logic
│   │   ├── models/
│   │   │   ├── User.ts             # User schema
│   │   │   └── connectDB.ts        # Database connection
│   │   └── routes/
│   │       ├── userRoutes.ts       # Auth endpoints
│   │       └── gameRoutes.ts       # Game endpoints
│   ├── index.ts                    # Main server file
│   ├── package.json
│   ├── .env                        # Environment variables
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── containers/             # Page containers
│   │   ├── hooks/                  # Custom hooks
│   │   ├── utils/                  # Utility functions
│   │   ├── types/                  # TypeScript definitions
│   │   ├── services/               # API services
│   │   └── assets/                 # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── .git/
```