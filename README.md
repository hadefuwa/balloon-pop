# 🎈 Balloon Pop Game

A fun and addictive balloon popping game that gets progressively faster as your score increases! Built with HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

## 🎮 How to Play

1. **Start the Game**: Click the "Start Game" button to begin
2. **Pop Balloons**: Click on balloons as they float up from the bottom of the screen
3. **Score Points**: Each balloon gives you points based on the current level
4. **Level Up**: Every 10 seconds, the game increases in difficulty
5. **Don't Let Them Escape**: If a balloon reaches the top of the screen, it's game over!

## 🎯 Game Features

- **Progressive Difficulty**: Speed and spawn rate increase with each level
- **Colorful Balloons**: 6 different colored balloons (red, blue, green, yellow, purple, pink)
- **Score System**: Points increase with each level
- **Visual Effects**: Smooth animations and score popups
- **Sound Effects**: Pop sounds when balloons are clicked
- **Pause Function**: Pause/resume the game anytime
- **Keyboard Shortcuts**: 
  - `Spacebar`: Pause/Resume
  - `M`: Mute/Unmute sound
  - `R`: Restart game
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deploy to GitHub Pages

### Option 1: Simple Deployment
1. Create a new repository on GitHub
2. Upload all the game files (`index.html`, `style.css`, `script.js`)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your game will be available at `https://yourusername.github.io/repository-name`

### Option 2: Using GitHub CLI
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Balloon Pop Game"

# Create repository on GitHub and push
gh repo create balloon-pop-game --public
git branch -M main
git push -u origin main

# Enable GitHub Pages
gh repo edit --enable-pages
```

## 📁 File Structure

```
balloon-pop/
├── index.html      # Main HTML file
├── style.css       # Game styling and animations
├── script.js       # Game logic and mechanics
└── README.md       # This file
```

## 🎨 Customization

You can easily customize the game by modifying these values in `script.js`:

- **Balloon Colors**: Edit the `balloonColors` array
- **Spawn Rate**: Modify `baseSpawnRate` (in milliseconds)
- **Balloon Speed**: Adjust `baseSpeed` (pixels per frame)
- **Level Progression**: Change the level calculation in `updateLevel()`
- **Points System**: Modify the points calculation in `createBalloon()`

## 🐛 Debugging

The game includes console logging for debugging. Open your browser's developer tools (F12) to see:
- Game initialization
- Balloon spawning events
- Level progression
- Score updates
- Game state changes

You can also access the game object globally via `window.balloonGame` for debugging.

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎵 Audio Notes

The game uses the Web Audio API for sound effects. Some browsers may block audio until user interaction. The game gracefully handles audio failures and continues to work without sound.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- High score system with localStorage
- Power-ups and special balloons
- Different game modes
- Background music
- Particle effects
- Multiplayer support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Have fun popping balloons! 🎈💥** 