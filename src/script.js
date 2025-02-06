let N = null;
let lastN = null;
let currentStep = 1;
let totalSteps = 10;

document.addEventListener("DOMContentLoaded", () => {
    disableAllButtons(true);
    document.getElementById("checkButton").disabled = true;
    document.getElementById("checkButton").classList.add("disabled");
    document.getElementById("numberN").addEventListener("input", validateInput);
    document.getElementById("randomN").addEventListener("click", generateRandomN);
    document.getElementById("startGame").addEventListener("click", startGame);
    document.getElementById("restartGame").addEventListener("click", restartGame);
});

//Функция проверки введённого N (должно быть от 1 до 10)
export function validateInput() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 1 || value > 10) {
        document.getElementById("error-message").innerText = "Please enter a number between 1 and 10!";
        document.getElementById("error-message").style.display = "block";
        disableAllButtons(true);
    } else {
        document.getElementById("error-message").style.display = "none";
        disableAllButtons(false);
    }
}

//Генерация случайного N
export function generateRandomN() {
    let newN;
    do {
        newN = Math.floor(Math.random() * 10) + 1;
    } while (newN === lastN);

    lastN = newN;
    document.getElementById("numberN").value = newN;
    validateInput.call(document.getElementById("numberN"));
}

//Запуск игры
export function startGame() {
    N = parseInt(document.getElementById("numberN").value);
    if (!isNaN(N) && N >= 1 && N <= 10) {
        document.getElementById("chooseN").style.display = "none";
        document.getElementById("multiplicationTable").style.display = "block";
        document.getElementById("checkButton").style.display = "block";
        disableAllButtons(true);
        generateRow(1);
    } else {
        alert("Please enter a number between 1 and 10!");
    }
}

//Генерация строки примеров
export function generateRow(step) {
    let table = document.getElementById("multiplicationTable");
    let row = document.createElement("tr");
    row.id = `row-${step}`;
    row.innerHTML = `
        <td>${N} × ${step} =&nbsp;</td>
        <td><input type="number" id="input-${step}" class="answer-input" inputmode="numeric"></td>
        <td class="hint-container"></td>
    `;
    // Скрываем строку до появления эффекта
    row.style.display = "none";
    table.appendChild(row);

    // Используем jQuery для fadeIn эффекта за 500 мс
    $(row).fadeIn(500);

    let hintContainer = row.querySelector(".hint-container");
    for (let i = 0; i < N; i++) {
        let cube = document.createElement("div");
        cube.classList.add("cube");
        hintContainer.appendChild(cube);
    }

    setTimeout(() => {
        const cubes = hintContainer.querySelectorAll('.cube');
        cubes.forEach(cube => {
            cube.classList.add('rise');
        });
    }, 100);

    setTimeout(() => {
        document.getElementById(`input-${step}`).focus();
    }, 600);

    document.getElementById(`input-${step}`).addEventListener("input", function () {
        let value = this.value.replace(/[^0-9]/g, '');
        this.value = value;
        disableAllButtons(this.value.trim() === "");
    });

    document.getElementById(`input-${step}`).addEventListener("keypress", function (event) {
        if (event.key === "Enter" && this.value.length > 0) {
            checkAnswer(step);
        }
    });

    document.getElementById("checkButton").addEventListener("click", function () {
        checkAnswer(step);
    });
}

//Проверка ответа
function checkAnswer(step) {
    let userInput = document.getElementById(`input-${step}`).value.trim();
    let userAnswer = parseInt(userInput);
    let correctAnswer = N * step;

    if (userInput === "") {
        showError(step);
    } else if (!isNaN(userAnswer)) {
        if (userAnswer === correctAnswer) {
            document.getElementById("checkButton").classList.remove("wrong");
            document.getElementById("checkButton").classList.add("correct");

            let inputField = document.getElementById(`input-${step}`);
            inputField.insertAdjacentHTML("afterend", `<span>${correctAnswer}</span>`);
            inputField.remove();

            setTimeout(() => {
                currentStep++;
                if (currentStep <= totalSteps) {
                    generateRow(currentStep);
                    document.getElementById("checkButton").classList.remove("correct");
                    document.getElementById("checkButton").classList.add("disabled");
                    document.getElementById("checkButton").disabled = true;
                } else {
                    endGame();
                }
            }, 500);
        } else {
            showError(step);
        }
    }
}

//Показ ошибки
function showError(step) {
    document.getElementById("checkButton").classList.add("wrong");
    document.getElementById(`input-${step}`).classList.add("wrong");

    setTimeout(() => {
        document.getElementById("checkButton").classList.remove("wrong");
        document.getElementById(`input-${step}`).classList.remove("wrong");
    }, 1000);
}

//Отключение/включение всех кнопок
function disableAllButtons(state) {
    const buttonIds = ["checkButton", "restartGame", "startGame"];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        btn.disabled = state;
        if (state) {
            btn.classList.add("disabled");
        } else {
            btn.classList.remove("disabled");
        }
    });
}

//Завершение игры
function endGame() {
    document.getElementById("checkButton").style.display = "none";
    document.getElementById("restartGame").style.display = "block";
}

//Перезапуск игры
export function restartGame() {
    N = null;
    currentStep = 1;
    document.getElementById("multiplicationTable").innerHTML = "";

    document.getElementById("chooseN").style.display = "block";
    document.getElementById("chooseN").removeAttribute("style");

    document.getElementById("multiplicationTable").style.display = "none";
    document.getElementById("restartGame").style.display = "none";

    document.getElementById("numberN").disabled = false;
    document.getElementById("randomN").disabled = false;
}