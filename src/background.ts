function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();

// chrome.action.onClicked.addListener((tab: any) => {
//   chrome.scripting.executeScript({
//     target: {tabId: tab.id},
//     files: ['./js/popup.js']
//   });
// });

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   console.log('sender', sender)
//   console.log('msg', msg)
//   if (msg.cursorApp) {
//     chrome.scripting.executeScript({
//       target: { tabId: msg.tabId },
//       files: ['./js/cursorApp.js'],
//     })
//   }
// })

// @ts-ignore
// window.cursorAppEvent = new Event('closeCursorAppEvent');