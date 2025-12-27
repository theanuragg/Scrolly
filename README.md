
# Ping Pong GameJam - Solana Integration

A modern, real-time ping pong game built with Next.js, featuring advanced physics simulation, AI opponents, and Solana blockchain integration for cryptocurrency rewards.

## Installation & Setup

```bash
npm install
# or
yarn install
```

## Run the Game

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## Game Features

### 🏓 Advanced Physics Engine
- Real-time collision detection with elastic response
- Smooth 60 FPS gameplay with requestAnimationFrame
- Multi-axis paddle movement (X and Y positioning)
- Progressive difficulty scaling with ball speed increases

### 🤖 AI Opponent System
- Predictive movement algorithm tracking ball trajectory
- Adaptive difficulty based on player performance
- Realistic opponent behavior with variable response times

### 💰 Cryptocurrency Integration
- Solana wallet connection for balance display
- Earn currency (💎) by scoring points
- Blockchain-ready reward system infrastructure

### 🎵 Immersive Audio Experience
- Background music integration via YouTube API
- Toggleable audio controls with visual feedback
- Seamless audio state management

### 🎨 Visual Design
- Custom background imagery with atmospheric effects
- Isometric 3D table rendering with realistic shadows
- Responsive UI with mobile touch support
- Animated particle effects and smooth transitions

### 🎮 Game Mechanics
- Lives system (3 stars) with progressive difficulty
- Level progression with increasing challenges
- Pause/resume functionality
- Score tracking with opponent AI
- Game over states with restart capability

## How to Play

1. **Connect Wallet**: Link your Solana wallet to see your balance
2. **Start Game**: Click the "🚀 Start Game" button
3. **Control Paddle**: Move your mouse/touch to control the orange paddle
4. **Score Points**: Hit the ball past your opponent to score
5. **Earn Rewards**: Gain currency (💎) for each point scored
6. **Progress**: Advance through levels as difficulty increases
7. **Lives System**: You have 3 lives (⭐) - don't let the ball pass you!

## Controls
- **Mouse/Touch**: Move paddle left/right and forward/back
- **Pause Button (⏸️)**: Pause/resume gameplay
- **Sound Button (🔊/🔇)**: Toggle background music

## Technical Architecture

The game is implemented in `src/views/home/index.tsx` with:
- **React Hooks**: useState, useEffect, useRef for state management
- **Real-time Physics**: 60 FPS game loop with collision detection
- **AI System**: Predictive opponent movement algorithm
- **Audio Integration**: YouTube API for background music
- **Responsive Design**: Mobile and desktop optimized
- **Solana Integration**: Wallet connection and balance display

## Built With
- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Solana Web3.js
- YouTube IFrame API
