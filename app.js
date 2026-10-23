const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}

let deck = [];

const board =
    document.getElementById("board");

const movesDisplay =
    document.getElementById("moves");

const statusDisplay =
    document.getElementById("status");

const flippedCards = [];

let moves = 0;
let waiting = false;
let timerId = null;

function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);

    board.replaceChildren();

    deck.forEach(function (fruit, i) {
        const card =
            document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.dataset.index = i;

        card.setAttribute(
            "aria-label",
            `Card ${i + 1}, face down`
        );

        board.appendChild(card);
    });
}

board.addEventListener("click", function (event) {
    const card = event.target;

    if (!card.classList.contains("card")) {
        return;
    }

    if (
        waiting ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    const index = Number(card.dataset.index);
    const fruit = deck[index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");

    card.setAttribute(
        "aria-label",
        `Card ${index + 1}, ${fruit.name}`
    );

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const firstCard = flippedCards[0];
        const secondCard = flippedCards[1];

        const firstFruit =
            deck[Number(firstCard.dataset.index)];

        const secondFruit =
            deck[Number(secondCard.dataset.index)];

        if (firstFruit.name === secondFruit.name) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            firstCard.disabled = true;
            secondCard.disabled = true;

            statusDisplay.textContent =
                "That's a pair!";

            flippedCards.length = 0;
        } else {
            statusDisplay.textContent =
                "Not a pair. Try again.";

            waiting = true;

            timerId = setTimeout(function () {
                firstCard.textContent = "";
                secondCard.textContent = "";

                firstCard.classList.remove(
                    "flipped"
                );

                secondCard.classList.remove(
                    "flipped"
                );

                const firstNumber =
                    Number(firstCard.dataset.index) + 1;

                const secondNumber =
                    Number(secondCard.dataset.index) + 1;

                firstCard.setAttribute(
                    "aria-label",
                    `Card ${firstNumber}, face down`
                );

                secondCard.setAttribute(
                    "aria-label",
                    `Card ${secondNumber}, face down`
                );

                flippedCards.length = 0;
                waiting = false;
                timerId = null;
            }, 1000);
        }
    }
});

buildBoard();