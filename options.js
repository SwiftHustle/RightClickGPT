document.addEventListener('DOMContentLoaded', () => {
  const promptFormat = document.getElementById('promptFormat');
  const chatID = document.getElementById('chatID');
  const saveButton = document.getElementById('save');
  const currentPromptFormat = document.getElementById('currentPromptFormat');
  const currentChatID = document.getElementById('currentChatID');
  const focusExistingTab = document.getElementById('focusExistingTab');

  // Load saved values
  chrome.storage.local.get(['promptFormat', 'chatID', 'focusExistingTab'], (data) => {
    if (data.promptFormat) {
      promptFormat.value = data.promptFormat;
      currentPromptFormat.innerText = data.promptFormat;
    } else {
      const defaultPromptFormat = 'Explain <prompt>';  // Default value
      promptFormat.value = defaultPromptFormat;
      currentPromptFormat.innerText = defaultPromptFormat;
    }
    if (data.chatID) {
      chatID.value = data.chatID;
      currentChatID.innerText = data.chatID;
    }
    if (data.focusExistingTab !== undefined) {
      focusExistingTab.checked = data.focusExistingTab;
    } else {
      focusExistingTab.checked = false;  // Default value
    }
  });

  // Save the user's choice
  saveButton.addEventListener('click', () => {
    if (!promptFormat.value.includes('<prompt>')) {
      alert('Please include <prompt> in your custom format.');
      return;
    }
    chrome.storage.local.set(
      {
        promptFormat: promptFormat.value,
        chatID: chatID.value,
        focusExistingTab: focusExistingTab.checked
      },
      () => {
        currentPromptFormat.innerText = promptFormat.value;
        currentChatID.innerText = chatID.value;
        alert('Settings saved');
      }
    );
  });
});
