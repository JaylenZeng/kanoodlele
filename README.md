# Kanoodle Puzzle Game

A web-based recreation of the classic Kanoodle puzzle game. Every day, a new puzzle is generated with two starting pieces locked on the board. Your goal is to fill the entire board using all 12 pieces as fast as possible!

## 🎮 Play Now

[Play Kanoodle](https://your-deployment-url.com)

## 🧩 How to Play

- **Drag** pieces onto the board to place them
- **Right-click** or **double-click** to rotate a piece
- **Shift + right-click** to flip/reflect a piece
- **Gray pieces** are locked and cannot be moved
- Fill every cell on the board to win!

## ✨ Features

- **Daily Puzzles** - A new puzzle every day, same for everyone (using UTC time)
- **Save Progress** - Your progress is automatically saved. Come back anytime to continue!
- **Timer** - Track how fast you can solve each puzzle
- **Smart Validation** - Pieces snap to valid positions and prevent impossible placements
- **Responsive Design** - Play on desktop or mobile devices

## 🛠️ Built With

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [@dnd-kit](https://dndkit.com/) - Drag and drop functionality
- CSS Modules - Scoped styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/kanoodle.git
   cd kanoodle
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/          # Game board component
│   ├── Pieces/         # Draggable piece component
│   └── UI/             # UI components (Timer, Modals, Buttons)
├── constants/          # Game constants and piece definitions
├── game/               # Game logic (puzzle generation, win condition)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (grid, rotations, storage)
```

## 🎯 Future Enhancements

- [ ] Puzzle solver / hint system
- [ ] Share results (like Wordle)
- [ ] Statistics tracking
- [ ] Difficulty levels (1, 2, or 3 starting pieces)
- [ ] Sound effects
- [ ] Dark mode

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original [Kanoodle](https://www.educationalinsights.com/kanoodle) puzzle game by Educational Insights
- Thanks to the [@dnd-kit](https://dndkit.com/) team for the excellent drag and drop library
