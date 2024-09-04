const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { API_KEY } = require("./key");

const apiKey = API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage("Hello, how are you?");
    console.log(await result.response.text());
  } catch (error) {
    console.error("An error occurred while generating the response:", error);

    // Retry logic in case of a 500 error
    if (error.status === 500) {
      console.log("Retrying the request due to an internal server error...");
      setTimeout(async () => {
        try {
          const result = await chatSession.sendMessage("Hello, how are you?");
          console.log(await result.response.text());
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }, 3000); // Retry after 3 seconds
    }
  }
}

run();
