// chatbot.js

// Elementos del DOM
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbot = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Abrir el chatbot
chatbotToggle.addEventListener('click', () => {
    chatbot.style.display = 'flex';
    chatbotToggle.style.display = 'none';
});

// Cerrar el chatbot
chatbotClose.addEventListener('click', () => {
    chatbot.style.display = 'none';
    chatbotToggle.style.display = 'block';
});

// Enviar mensaje al presionar el botón
chatbotSend.addEventListener('click', sendMessage);

// Enviar mensaje al presionar Enter
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


// Función para enviar mensajes
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message !== '') {
        // Mostrar el mensaje del usuario en la interfaz
        appendMessage('user', message);
        chatbotInput.value = '';

        // Enviar el mensaje al backend
        fetch('https://hook.eu2.make.com/fsxy48jbqulknw19xq1iakmjuwsh92n3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del bot
            appendMessage('bot', data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('bot', 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.');
        });
    }
}

        
// Función para agregar mensajes al chat
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', sender);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Ejemplo de respuesta automática (puedes eliminar esto cuando integres el backend)
function botResponse(message) {
    setTimeout(() => {
        appendMessage('bot', `Echo: ${message}`);
    }, 1000);
}
