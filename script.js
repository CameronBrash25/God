const textArea = document.getElementById('text-area');
const userInput = document.getElementById('user-input');
const connectionText = document.getElementById('connection-text');
const kamiIndicator = document.getElementById('kami-indicator');

// Sound files
const clickSound = new Audio('./sounds/click.mp3');

window.onload = async () => {
    const messages = [
        "Awaiting Connection...",
        "Receiving Connection...",
        "Divine Connection Established...",
        "Kami Sama Online:"
    ];

    // Initial state for connection
    setConnectionState("Offline", "off");

    // Play turn-on sound with delay
    playTurnOnSound();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Display boot messages and synchronize the connection state
    for (let i = 0; i < messages.length; i++) {
        appendBootMessage(messages[i]);
        playClickSound();

        if (i === 1) {
            setConnectionState("Receiving", "blinking");
        } else if (i === 3) {
            setConnectionState("Online", "on");
        }
        if (messages[i] == "Awaiting Connection...") {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for each message
        } else if (messages[i] == "Receiving Connection...") {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for each message
        } else if (messages[i] == "Divine Connection Established...") {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for each message
        } else if (messages[i] == "Kami Sama Online:") {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for each message
        }
    }

    // Focus the input field after boot
    userInput.focus();
};

// Function to append boot-up messages dynamically
function appendBootMessage(message) {
    const newLine = document.createElement('div');
    newLine.textContent = message;
    textArea.appendChild(newLine);
    textArea.scrollTop = textArea.scrollHeight; // Auto-scroll to bottom
}

// Function to update connection text and light state
function setConnectionState(state, indicatorState) {
    connectionText.textContent = `${state}`;
    switch (indicatorState) {
        case "off":
            kamiIndicator.style.backgroundColor = "black";
            kamiIndicator.style.boxShadow = "none";
            kamiIndicator.style.animation = "none";
            break;
        case "blinking":
            kamiIndicator.style.backgroundColor = "#20c20e";
            kamiIndicator.style.boxShadow = "0 0 8px #20c20e";
            kamiIndicator.style.animation = "pulse 1s infinite";
            break;
        case "on":
            kamiIndicator.style.backgroundColor = "#20c20e";
            kamiIndicator.style.boxShadow = "0 0 8px #20c20e, 0 0 15px #20c20e";
            kamiIndicator.style.animation = "none";
            break;
    }
}

// Play turn-on sound effect
function playTurnOnSound() {
    const turnOnSound = new Audio('./sounds/turn_on.mp3');
    turnOnSound.volume = 0.3;
    turnOnSound.play();
}

// Handle user input
userInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter' && userInput.value.trim() !== '') {
        const question = userInput.value.trim();
        appendUserMessage(`<user> : ${question}`);
        userInput.value = '';

        // Fetch the response from the backend
        const response = await getGodResponse(question);
        addTypingAnimation(`Kami Sama: `, response);

        // Refocus the input field
        userInput.focus();
    }
});

// Append user message instantly
function appendUserMessage(message) {
    const newLine = document.createElement('div');
    newLine.textContent = message;
    textArea.appendChild(newLine);
    textArea.scrollTop = textArea.scrollHeight; // Auto-scroll
}

// Add typing animation for the godly response
function addTypingAnimation(prefix, message) {
    const newLine = document.createElement('div');
    textArea.appendChild(newLine); // Create a new message line
    textArea.scrollTop = textArea.scrollHeight;

    let i = 0; // Character index

    function typeChar() {
        if (i < prefix.length) {
            newLine.textContent += prefix[i];
            i++;
            playClickSound(); // Sound for each character
        } else if (i < prefix.length + message.length) {
            newLine.textContent += message[i - prefix.length];
            i++;
            playClickSound();
        } else {
            clearInterval(typingInterval); // Stop when message completes
        }
        textArea.scrollTop = textArea.scrollHeight; // Auto-scroll
    }

    const typingInterval = setInterval(typeChar, 50); // Typing speed
}

// Function to generate placeholder responses
async function getGodResponse(question) {
    try {
        const response = await fetch("https://god-hjjh.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: question }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Error fetching response:", error);
        return "I'm sorry, but I cannot provide an answer at this time.";
    }
}
// Play typing click sound
function playClickSound() {
    clickSound.volume = 0.1; // Lower volume for subtlety
    clickSound.currentTime = 0; // Restart sound
    clickSound.play();
}
