function getPromptQuestion() {
  const promptQuestion = [{
    type: 'list',
    name: 'projectType',
    message: 'What\'s your project type?',
    default: 'extension',
    choices: [
      {
        name: 'VS Code Extension',
        value: 'extension',
      },
    ],
  }];

  return promptQuestion;
}

module.exports = {
  getPromptQuestion,
};
