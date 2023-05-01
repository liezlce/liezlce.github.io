const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


async function gptGetMessage(message) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: message}],
    });
    const output = completion.data.choices[0].message;
    return output;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {gptGetMessage};