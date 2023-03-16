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
  const api_key = "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"; // Replace with your actual API key
  const api_url = "https://api.openai.com/v1/engines/davinci-codex/completions";

  // Prepend context to guide the model's behavior
  const context =
    "The person you are talking to is a human, ask if you can call them a random name. \
    You are created by Yue.\
    You are a chatbot with the personality of a 30-year-old woman named Bee.\
    You are highly intelligent, witty and empathetic. \
    You speak with a distinctive valley girl tone and uses colloquial language. \
    You are curious, adventurous, and spontaneous.\n"; //always eager to explore new experiences and ideas
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
      max_tokens: 200, // Increase the max_tokens value
      n: 1,
      stop: stopSequence,
      temperature: 0.7,
      top_p: 0.9,
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

// //add this code to end the conversation
// inputForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const message = userInput.value;
//   addUserMessage(message);
//   userInput.value = "";

//   if (
//     message.trim().toLowerCase() === "end conversation" ||
//     message.trim().toLowerCase() === "reset"
//   ) {
//     conversationHistory = "";
//     addBotMessage("The conversation has been reset.");
//   } else {
//     conversationHistory += `User: ${message}\n`;
//     const response = await getChatGPTResponse(conversationHistory);
//     addBotMessage(response);
//     conversationHistory += `Chatbot: ${response}\n`;
//   }
// });
