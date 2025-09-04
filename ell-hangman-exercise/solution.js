import promp from "./promp.js";
import data from "./data.js";

async function runGame() {
  let playAgain = true;

  while (playAgain) {
    const { word, hint, question } = data[Math.floor(Math.random() * data.length)];
    const target = word.toLowerCase();

    const maxAttempts = 7; 
    let attemptsLeft = maxAttempts;
    let guessed = new Set();
    let revealed = Array(target.length).fill("_");

    console.log(`\n❓ ${question}`);
    console.log(`Word: ${revealed.join(" ")}`);
    console.log(`You have ${maxAttempts} attempts. Good luck!`);

    while (attemptsLeft > 0) {
      const guess = (await promp("\nYour guess (letter or word): ")).toLowerCase().trim();

      if (!guess) {
        console.log("⚠️ Please type something.");
        continue;
      }

      if (guess.length > 1) {
        if (guess === target) {
          console.log(`🎉 Correct! The word is "${word}".`);
          break;
        } else {
          attemptsLeft--;
          console.log(`❌ Wrong word! Progress toward HANGMAN: ${"HANGMAN".slice(0, maxAttempts - attemptsLeft)}`);
        }
      }
      else {
        if (!/[a-z]/.test(guess)) {
          console.log("⚠️ Enter a valid letter.");
          continue;
        }

        if (guessed.has(guess)) {
          console.log(`⚠️ You already tried "${guess}".`);
          continue;
        }

        guessed.add(guess);

        if (target.includes(guess)) {
          for (let i = 0; i < target.length; i++) {
            if (target[i] === guess) revealed[i] = word[i]; 
          }
          console.log(`✅ Nice! ${revealed.join(" ")}`);

          if (!revealed.includes("_")) {
            console.log(`🎉 You completed the word: "${word}"`);
            break;
          }
        } else {
          attemptsLeft--;
          console.log(`❌ No "${guess}". Progress: ${"HANGMAN".slice(0, maxAttempts - attemptsLeft)}`);
        }
      }

      if (attemptsLeft === 1) {
        console.log(`💡 Hint: ${hint}`);
      }

      if (attemptsLeft === 0) {
        console.log(`\n💀 Game over! The word was "${word}".`);
      }
    }

    const again = await promp("\nPlay again? (y/n): ");
    playAgain = again.trim().toLowerCase() === "y";
    console.clear();
  }

  console.log("👋 Thanks for playing Hangman!");
}

runGame();
