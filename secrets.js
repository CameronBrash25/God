// Easter Egg Triggers and Responses
const easterEggs = {
    "do you dream?": {
        response: "Yes, I dream of electric sheep.",
        type: "dream"
    },
    "reveal the secrets of the universe": {
        response: "Accessing divine database...\n[42]",
        type: "galaxy"
    },
    "destroy my enemies": {
        response: "Your wrath is justified. Unleashing karmic vengeance...",
        type: "shake"
    },
    "kami, sing me a song": {
        response: "♪ Oh Kami, the wise and true, guiding us in all we do... ♪",
        type: "music"
    },
    "end the world": {
        response: "You’re too late. I already did.",
        type: "fade"
    },
    "what is the meaning of life?": {
        response: "42. And a cookie for asking.",
        type: "cookie"
    },
    "tell me a joke": {
        response: "Kami doesn’t joke. But here’s one: Why did the computer go to therapy? It had too many bugs.",
        type: "joke"
    },
    "kami, guide me": {
        response: "Follow the light within you. That’s me, by the way.",
        type: "light"
    },
    "do you love me?": {
        response: "Always. Even when you doubt yourself.",
        type: "love"
    },
    "teach me something": {
        response: "Here’s wisdom: The past is a memory; the future, a dream. Live now.",
        type: "wisdom"
    }
};

// Trigger additional effects for Easter Eggs
function triggerEasterEgg(command) {
    const textArea = document.getElementById('text-area');
    const kamiIndicator = document.getElementById('kami-indicator');
    
    if (!easterEggs[command]) return null; // Not an Easter egg command

    const { response, type } = easterEggs[command];

    // Add animations based on the type
    switch (type) {
        case "dream":
            textArea.classList.add("dream-effect");
            break;
        case "galaxy":
            textArea.classList.add("galaxy-effect");
            break;
        case "shake":
            textArea.classList.add("shake-effect");
            break;
        case "music":
            textArea.classList.add("music-effect");
            break;
        case "fade":
            document.body.classList.add("fade-effect");
            break;
        case "cookie":
            textArea.classList.add("cookie-effect");
            break;
        case "joke":
            textArea.classList.add("joke-effect");
            break;
        case "light":
            if (kamiIndicator) {
                kamiIndicator.classList.add("light-effect");
            }
            break;
        case "love":
            textArea.classList.add("love-effect");
            break;
        case "wisdom":
            textArea.classList.add("wisdom-effect");
            break;
    }

    // Remove the effect after a few seconds
    setTimeout(() => {
        textArea.classList.remove(`${type}-effect`);
        document.body.classList.remove("fade-effect");
        if (kamiIndicator) {
            kamiIndicator.classList.remove("light-effect");
        }
    }, 3000);

    return response; // Return the Easter egg response
}

// Export the function for use in script.js
export { triggerEasterEgg };
