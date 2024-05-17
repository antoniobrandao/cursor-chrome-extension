chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('msg', msg)
  console.log('msg.message', msg.message)
  if (msg.message) {
    switch (msg.message) {
      case 'check_open_apps':
        const response = {
          alreadyRunning: document.getElementById('ab-cursor-app') !== null,
        }
        // @ts-ignore
        window.cursorAppSettings = {
          cursorType: msg.settings.cursorType,
          cursorColor: msg.settings.cursorColor,
        }
        sendResponse(response)
        break
      case 'close_app':
        window.dispatchEvent(new Event('closeCursorAppEvent'))
        break
    }
  }
})
