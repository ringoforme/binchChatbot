const chatbox = document.getElementById("chatbox");
const inputForm = document.getElementById("input-form");
const userInput = document.getElementById("user-input");

let conversationHistory = "";

inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = userInput.value;
  addUserMessage(message);
  userInput.value = "";

  conversationHistory += `User: ${message}\n`;

  const response = await getChatGPTResponse(conversationHistory);
  addBotMessage(response);

  conversationHistory += `Chatbot: ${response}\n`;
});

function addUserMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("user-message");
  messageElement.textContent = text;

  const clearfix = document.createElement("div");
  clearfix.classList.add("clearfix");

  chatbox.appendChild(messageElement);
  chatbox.appendChild(clearfix);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addBotMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("bot-message");
  messageElement.textContent = text;

  const clearfix = document.createElement("div");
  clearfix.classList.add("clearfix");

  chatbox.appendChild(messageElement);
  chatbox.appendChild(clearfix);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// The getChatGPTResponse function remains the same as before.
async function getChatGPTResponse(conversation) {
  const api_key = "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";
  const api_url = "https://api.openai.com/v1/engines/davinci-codex/completions";

  // Prepend context to guide the model's behavior
  const context =
    "You are a 21-year-old girl who speaks with a distinctive valley girl tone and uses colloquial language.\n";
  const prompt = `${context}${conversation}Chatbot: `;
  const stopSequence = ["\nUser:", "\nChatbot:"];

  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 400,
      n: 1,
      stop: stopSequence,
      temperature: 1,
      top_p: 1.0,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    }),
  });

  const responseData = await response.json();
  return responseData.choices[0].text.trim();
}

// the end of getChatGPTrespons

// Add this code to the end of your existing script.js
const clearButton = document.getElementById("clear-btn");

clearButton.addEventListener("click", () => {
  chatbox.innerHTML = "";
  conversationHistory = "";
});
