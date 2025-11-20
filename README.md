# Wavelength Game 🎮

A Chinese-language web-based party game inspired by the board game "Wavelength". Play with friends online or challenge yourself in single-player mode!

**Live Demo:** [wavelength-game.netlify.app](https://wavelength-game.netlify.app/)

## 📖 About

Wavelength is a social guessing game where players try to read each other's minds. One player gives a clue based on a spectrum (like "hot" to "cold"), and the other player guesses where on that spectrum the clue falls.

### Features

- 🎲 **Multiplayer Mode**: Create rooms and play with friends remotely
- 🧠 **Single-Player Mode**: Challenge yourself against AI creators
- 🌐 **Bilingual Support**: Switch between Chinese and English
- 🎨 **Multiple Creators**: Each with unique question styles
- 💬 **Player-Generated Content**: Create and share your own questions
- 🎉 **Interactive Feedback**: Visual and audio effects for perfect hits

## 🗂️ Project Structure

```
Wavelength/
├── public/                      # Deployable files
│   ├── index.html              # Multiplayer mode
│   ├── singleplayer.html       # Single-player mode
│   ├── assets/
│   │   ├── audio/              # Sound effects (partypop.mp3, tick.mp3)
│   │   ├── images/             # Images (loading.gif)
│   │   └── fonts/              # Custom fonts
│   └── data/
│       ├── question_bank.json  # Single-player questions
│       └── wordbank.json       # Word bank for hints
│
├── src/                         # Source code
│   ├── js/
│   │   ├── multiplayer.js      # Multiplayer game logic
│   │   ├── singleplayer.js     # Single-player game logic
│   │   └── lang.js             # i18n translations
│   └── css/
│       └── style.css           # Styles
│
├── docs/                        # Documentation
│   ├── en/                     # English docs
│   └── zh/                     # Chinese docs
│
├── .env.example                # Firebase config template
├── .gitignore                  # Git ignore rules
├── package.json                # Project metadata
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase and CDN resources)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Wavelength
   ```

2. **Serve the files**

   Using Python:
   ```bash
   python -m http.server 8080
   ```

   Using Node.js (http-server):
   ```bash
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:8080/public/index.html
   ```

### Deployment

The project is a static website and can be deployed to any static hosting service:

- **Netlify** (current deployment)
- Vercel
- GitHub Pages
- Firebase Hosting

For Netlify, set the publish directory to `public/`.

## 🎯 How to Play

### Multiplayer Mode

1. **Host**: Click "创建房间" (Create Room) and share the room number
2. **Guest**: Enter the room number and click "加入" (Join)
3. **Take Turns**:
   - One player sees the spectrum and gives a hint
   - The other player guesses where on the spectrum the hint falls
4. **Score**: Try to land in the green zone for points!

### Single-Player Mode

1. Choose a creator (Sean, Charles, Brus) or play player-created questions
2. Read the question and the spectrum endpoints
3. Guess where the answer falls on the spectrum
4. Get instant feedback and try to improve your guessing skills!

## 🛠️ Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: Firebase Realtime Database
- **Styling**: Custom CSS with gradients and animations
- **Fonts**:
  - Google Fonts (Noto Sans SC, ZCOOL XiaoWei)
  - Custom fonts (Source Han Sans CN, Zaio)
- **Libraries**:
  - Firebase SDK 8.10.0
  - Canvas Confetti 1.6.0

## 📝 Configuration

### Firebase Setup

The project uses Firebase for:
- Real-time multiplayer synchronization
- Storing player-created questions
- Game analytics

**⚠️ Security Note**: Firebase credentials are currently hardcoded in the JavaScript files. For production use, implement proper Firebase Security Rules and consider using environment variables.

To use your own Firebase:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Copy `.env.example` to `.env`
3. Update the Firebase config in:
   - `src/js/multiplayer.js`
   - `src/js/singleplayer.js`

## 🎨 Customization

### Visual Question Editor

The easiest way to manage questions is using the built-in visual editor:

1. Open `http://localhost:8080/public/question-editor.html`
2. Add, edit, or delete questions with a user-friendly interface
3. Export the updated JSON file
4. Replace `public/data/question_bank.json`

Features:
- ✏️ Visual form for adding/editing questions
- 🎨 Color-coded topic pairs
- 📊 Interactive position slider
- 🔍 Search and filter by creator
- 💾 Export/import JSON with one click

See [docs/en/QUESTION_EDITOR_GUIDE.md](docs/en/QUESTION_EDITOR_GUIDE.md) for detailed instructions.

### Manual JSON Editing

Alternatively, edit `public/data/question_bank.json` directly:

```json
{
  "id": "unique_id",
  "topic_pair": "左端点 ↔ 右端点",
  "target_position": 45,
  "question_text": "你的问题"
}
```

### Adding Words to Hint Bank

Edit `public/data/wordbank.json`:

```json
{
  "words": [
    "新词1",
    "新词2",
    "新词3"
  ]
}
```

### Adding Hints to Multiplayer

Edit `public/data/hintlist.json`:

```json
{
  "hints": [
    {
      "left": "冷",
      "right": "热",
      "category": "形态与特征"
    }
  ]
}
```

## 🐛 Known Issues

1. **Large Font File**: Source Han Sans CN font is 8MB. Consider subsetting or using WOFF2 format
2. **Exposed Firebase Credentials**: Implement Firebase Security Rules for production
3. **No Build Process**: No minification or bundling. Consider adding Vite or webpack for optimization

## 📊 Performance

- **Total Size**: ~16MB (8MB is the Chinese font)
- **Load Time**: 2-4 seconds on fast connections
- **Code Size**: ~2,800 lines of JavaScript

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Optimize font files (subset, WOFF2 conversion)
- [ ] Add build process for minification
- [ ] Implement proper environment variable handling
- [ ] Add more question creators
- [ ] Improve mobile responsiveness
- [ ] Add sound effect toggles
- [ ] Implement leaderboards

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- Inspired by the board game "Wavelength" by Cmyk Games
- Thanks to all players who contributed questions
- Built with ❤️ for friends and family

## 📧 Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

**Have fun playing Wavelength! 🎉**
