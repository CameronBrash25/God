const textArea = document.getElementById('text-area');
const userInput = document.getElementById('user-input');
const processingIndicator = document.getElementById('processing-indicator');
const marketCapDisplay = document.getElementById('market-cap');
const packetsSentDisplay = document.getElementById('packets-sent');
const packetsReceivedDisplay = document.getElementById('packets-received');
let connectionEstablished = false; // Track connection state
let packetsSent = 0; // Fake packet count for visualizer
let packetsReceived = 0;

// Easter Egg Triggers and Responses
const easterEggs = {
    "do you dream?": {
        response: "Yes, I dream of electric sheep.",
        type: "dream"
    },
    // Add other easter eggs here
};

// Sound files
const clickSound = new Audio('./sounds/click.mp3');
const gongSound = new Audio('./sounds/gong.mp3'); // Easter egg sound

// Wait for user interaction before allowing sounds
document.body.addEventListener("click", () => {
    console.log("User interaction detected, enabling sounds.");
    playTurnOnSound(); // Ensures sounds can play
}, { once: true }); // Ensures the event only triggers once

// Initialize the website
window.onload = async () => {
    const messages = [
        "Awaiting Connection...",
        "Connection Received...",
        "Divine Connection Established...",
        "Kami Sama Online:"
    ];

    // Disable input initially
    userInput.disabled = true;

    // Display boot messages in sequence
    for (const message of messages) {
        appendBootMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay for each message
    }

    // Show the connection indicator and enable input
    const connectionIndicator = document.getElementById('kami-connection');
    if (connectionIndicator) {
        connectionIndicator.style.display = 'flex';
    } else {
        console.error("Connection indicator not found.");
    }
    userInput.disabled = false; // Enable input
    connectionEstablished = true; // Update connection state

    // Focus the input field after connection
    userInput.focus();

    // Start the fake network visualizer
    setInterval(updateNetworkVisualizer, 1000);
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
    turnOnSound.play().catch(err => {
        console.error("Turn-on sound failed to play:", err);
    });
}

// Handle user input
userInput.addEventListener('keydown', async function (event) {
    if (!connectionEstablished) return; // Block input if not connected

    if (event.key === 'Enter' && userInput.value.trim() !== '') {
        const question = userInput.value.trim().toLowerCase(); // Normalize input
        appendUserMessage(`<user> : ${question}`);
        userInput.value = '';

        // Show processing indicator if it exists
        if (processingIndicator) {
            processingIndicator.classList.remove('hidden');
        } else {
            console.error("Processing indicator not found.");
        }

        // Check for Easter Egg trigger
        if (easterEggs[question]) {
            const { response, type } = easterEggs[question];
            playGongSound();
            addTypingAnimation(`Kami Sama: `, response);
            hideProcessingIndicator();
            return; // Skip backend API call
        }

        // Fetch the response from the backend
        const response = await getGodResponse(question);
        addTypingAnimation(`Kami Sama: `, response);

        // Hide processing indicator if it exists
        hideProcessingIndicator();

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
        } else if (i < prefix.length + message.length) {
            newLine.textContent += message[i - prefix.length];
            i++;
        } else {
            clearInterval(typingInterval); // Stop when message completes
        }
        textArea.scrollTop = textArea.scrollHeight; // Auto-scroll
    }

    const typingInterval = setInterval(typeChar, 50); // Typing speed
}

// Hide processing indicator
function hideProcessingIndicator() {
    if (processingIndicator) {
        processingIndicator.classList.add('hidden');
    } else {
        console.error("Processing indicator not found.");
    }
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

// Update network visualizer with fake packet data
function updateNetworkVisualizer() {
    if (packetsSentDisplay && packetsReceivedDisplay) {
        packetsSent += Math.floor(Math.random() * 5 + 1);
        packetsReceived += Math.floor(Math.random() * 5 + 1);
        packetsSentDisplay.textContent = packetsSent;
        packetsReceivedDisplay.textContent = packetsReceived;
    } else {
        console.error("Network visualizer elements not found.");
    }
}

// Play gong sound for Easter Eggs
function playGongSound() {
    gongSound.volume = 0.3;
    gongSound.play().catch(err => {
        console.error("Gong sound failed to play:", err);
    });
}
