const textArea = document.getElementById('text-area');
const userInput = document.getElementById('user-input');

// Sound files
const clickSound = new Audio('./sounds/click.mp3');

// Automatically focus the input field on page load
window.onload = () => {
    userInput.focus();
};

userInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter' && userInput.value.trim() !== '') {
        const question = userInput.value.trim();
        appendUserMessage(`<user> : ${question}`);
        userInput.value = '';

        // Fetch the "godly" response from the backend
        const response = await getGodResponse(question);
        addTypingAnimation(`Kami Sama: `, response);

        // Automatically refocus the input field
        userInput.focus();
    }
});

// Function to instantly append user message
function appendUserMessage(message) {
    const newLine = document.createElement('div');
    newLine.textContent = message;
    textArea.appendChild(newLine);
    textArea.scrollTop = textArea.scrollHeight; // Keep chat scrolled to the bottom
}

// Function to add a godly response with typing animation
function addTypingAnimation(prefix, message) {
    const newLine = document.createElement('div');
    textArea.appendChild(newLine); // Add the new message line
    textArea.scrollTop = textArea.scrollHeight;

    let i = 0; // Index for the character being typed

    function typeChar() {
        if (i < prefix.length) {
            newLine.textContent += prefix[i];
            i++;
            playClickSound(); // Play click sound for each letter
        } else if (i < prefix.length + message.length) {
            newLine.textContent += message[i - prefix.length];
            i++;
            playClickSound(); // Play click sound for each letter
        } else {
            clearInterval(typingInterval); // Stop typing when the message is complete
        }
        textArea.scrollTop = textArea.scrollHeight; // Keep chat scrolled to bottom
    }

    const typingInterval = setInterval(typeChar, 100); // Slower speed (100ms per character)
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

// Function to play click sound
function playClickSound() {
    clickSound.currentTime = 0; // Reset sound to start
    clickSound.play();
}
