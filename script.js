const textArea = document.getElementById('text-area');
const userInput = document.getElementById('user-input');
let connectionEstablished = false; // Track connection state

// Sound files
const clickSound = new Audio('./sounds/click.mp3');

window.onload = async () => {
    const messages = [
        "Awaiting Connection...",
        "Connection Received...",
        "Divine Connection Established...",
        "Kami Sama Online:"
    ];

    // Disable input initially
    userInput.disabled = true;

    // Play turn-on sound with delay
    playTurnOnSound();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Display boot messages in sequence
    for (const message of messages) {
        appendBootMessage(message);
        playClickSound();
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay for each message
    }

    // Show the connection indicator and enable input
    document.getElementById('kami-connection').style.display = 'flex';
    userInput.disabled = false; // Enable input
    connectionEstablished = true; // Update connection state

    // Focus the input field after connection
    userInput.focus();
};

// Append boot-up messages dynamically
function appendBootMessage(message) {
    const newLine = document.createElement('div');
    newLine.textContent = message;
    textArea.appendChild(newLine);
    textArea.scrollTop = textArea.scrollHeight; // Auto-scroll to bottom
}

// Play turn-on sound effect
function playTurnOnSound() {
    const turnOnSound = new Audio('./sounds/turn_on.mp3');
    turnOnSound.volume = 0.3;
    turnOnSound.play();
}

// Handle user input
userInput.addEventListener('keydown', async function (event) {
    if (!connectionEstablished) return; // Block input if not connected

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

// Fetch a placeholder response from the backend
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
