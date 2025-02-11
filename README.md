# 🃏 Poker CLI Game

A simple command-line poker game built with pure Node.js.

## 🎮 Features
- Draw 5 cards at once
- System also draws 5 cards
- Determines the winner based on poker hand rankings
- Ace can be counted as **1 (low straight)** or **14 (high straight)**
- Suits matter in the game

## 🚀 Installation

### Option 1: Run with Node.js
1. Clone this repository:
   ```sh
   git clone https://github.com/jokevin716/simple-poker.git
   cd simple-poker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the game:
   ```sh
   node index.js
   ```

### Option 2: Run as an Executable
1. Download the prebuilt executable from [Releases](https://github.com/jokevin716/simple-poker/releases).
2. Run it:
   ```sh
   ./simple-poker   # macOS/Linux
   simple-poker.exe  # Windows
   ```

## 🌜 How to Play
1. The user and the system each draw 5 cards.
2. The game automatically determines the winner.
3. Hands are ranked based on standard poker rules.

## 🏆 Poker Hand Rankings
| Rank        | Description |
|------------|-------------|
| Royal Flush | A-K-Q-J-10 of the same suit |
| Straight Flush | Five consecutive cards of the same suit |
| Four of a Kind | Four cards of the same rank |
| Full House | Three of a kind + a pair |
| Flush | Five cards of the same suit |
| Straight | Five consecutive cards (A can be 1 or 14) |
| Three of a Kind | Three cards of the same rank |
| Two Pair | Two different pairs |
| One Pair | A single pair |
| High Card | Highest individual card |

## 🛠️ Testing
If you want to run test mode:
```sh
npm run test
```

## 📌 License
This project is licensed under the MIT License.

---