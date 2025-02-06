import './style.css';
import { startGame, generateRow, restartGame, validateInput, generateRandomN } from './script.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("numberN").addEventListener("input", validateInput);
    document.getElementById("randomN").addEventListener("click", generateRandomN);
    document.getElementById("startGame").addEventListener("click", startGame);
    document.getElementById("restartGame").addEventListener("click", restartGame);
});