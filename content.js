function logToBackground(...args) {
    chrome.runtime.sendMessage({
        action: 'logToBackground',
        data: args,
    });
}

function pressEnterKey(inputElement) {
    inputElement.focus();
    document.execCommand('insertText', false, '\n');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendToChatGPT') {
        setTimeout(() => {
            logToBackground("messagereceived");
            const inputFieldSelector = 'textarea';
            const inputField = document.querySelector(inputFieldSelector);

            // Select the path with the specific d attribute
            let path = document.querySelector('path[d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"]');
            // Get the parent SVG of the path
            let svg = path.parentElement;
            // Get the parent button of the SVG
            let button = svg.parentElement;
            inputField.value = request.prompt; // add placeholder to box, wait until placeholder is gone
            button.removeAttribute('disabled'); // attempt to enable button
            button.click(); // attempt to click button
            pressEnterKey(inputField); // Failsafe attempt to press enter in the box

        }, 1000);
    }
});
