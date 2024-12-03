const textArea = document.getElementById('text-area');
const userInput = document.getElementById('user-input');

// Automatically focus the input field on page load
window.onload = () => {
    userInput.focus();
};

userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && userInput.value.trim() !== '') {
        const question = userInput.value.trim();
        appendUserMessage(`<user> : ${question}`);
        userInput.value = '';

        // Simulate the "godly" response with a delay
        setTimeout(() => {
            const response = getGodResponse(question);
            addTypingAnimation(`Kami Sama: `, response);
        }, 1000);

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
        } else if (i < prefix.length + message.length) {
            newLine.textContent += message[i - prefix.length];
            i++;
        } else {
            clearInterval(typingInterval); // Stop typing when the message is complete
        }
        textArea.scrollTop = textArea.scrollHeight; // Keep chat scrolled to bottom
    }

    const typingInterval = setInterval(typeChar, 50); // Adjust speed (50ms per character)
}

// Function to generate placeholder responses
function getGodResponse(question) {
    return `"${question}" holds infinite possibilities.`; // Example response
}
