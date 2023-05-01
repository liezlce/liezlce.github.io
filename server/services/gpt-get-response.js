const got = require('got');

const OPENAI_SECRET_KEY='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';

async function gptGetMessage(message) {
  const url = 'https://api.openai.com/v1/engines/davinci/completions';
  const params = {
    "prompt": message,
    "max_tokens": 160,
    "temperature": 0.7,
    "frequency_penalty": 0.5
  };
  const headers = {
    'Authorization': `Bearer ${OPENAI_SECRET_KEY}`,
  };

  try {
    const response = await got.post(url, { json: params, headers: headers }).json();
    let output = `${message}${response.choices[0].text}`;
    return output;
  } catch (err) {
    console.log(err);
  }
};

module.exports = gptGetMessage;