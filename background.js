chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'chatgpt',
    title: 'Ask ChatGPT',
    contexts: ['selection'],
  });
  console.log("test");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logToBackground') {
    console.log.apply(null, request.data);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'chatgpt') {
    const selectedText = info.selectionText;
    console.log(selectedText);

    // Get the saved prompt format and settings
    chrome.storage.local.get(['promptFormat', 'chatID', 'focusExistingTab'], (data) => {
      const promptFormat = data.promptFormat || 'Explain <prompt>';
      const chatID = data.chatID || '';
      const formattedPrompt = promptFormat.replace('<prompt>', selectedText);
      const chatURL = `https://chatgpt.com/chat/${chatID}`;

      if (data.focusExistingTab) {
        chrome.tabs.query({ url: ["https://chatgpt.com/c/*", "https://chatgpt.com/g/*"] }, (tabs) => {
          if (tabs.length > 0) {
            // Focus on the existing tab
            const existingTab = tabs[0];
            chrome.tabs.update(existingTab.id, { active: true }, () => {
              chrome.scripting.executeScript(
                {
                  target: { tabId: existingTab.id },
                  files: ['content.js'],
                },
                () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    return;
                  }
                  chrome.tabs.sendMessage(existingTab.id, { action: 'sendToChatGPT', prompt: formattedPrompt });
                }
              );
            });
          } else {
            createNewTab(chatURL, formattedPrompt);
          }
        });
      } else {
        createNewTab(chatURL, formattedPrompt);
      }
    });
  }
});

function createNewTab(chatURL, formattedPrompt) {
  chrome.tabs.create({ url: chatURL }, (newTab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (info.status === 'complete' && tabId === newTab.id) {
        console.log(newTab.id);
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['content.js'],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }
            chrome.tabs.sendMessage(tabId, { action: 'sendToChatGPT', prompt: formattedPrompt });
          }
        );
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
}
