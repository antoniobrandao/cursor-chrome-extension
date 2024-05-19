chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('content_script: message listener: msg', msg)
  if (msg.message) {
    switch (msg.message) {
      case 'check_if_app_is_open':
        const response = { alreadyOpen: document.getElementById('ab-cursor-app') !== null }
        console.log('sending response', response)
        console.log('window', window)
        const settingsPackage = {
          cursorType: msg.settings.cursorType,
          cursorColor: msg.settings.cursorColor,
        }
        // // @ts-ignore
        // window.cursorAppSettings = settingsPackage
        // // @ts-ignore
        // console.log('window.cursorAppSettings', window.cursorAppSettings)
        sendResponse(response)
        setTimeout(() => {
          const newEvent = new CustomEvent('dispatchCursorAppSettings', {detail: settingsPackage})
          window.dispatchEvent(newEvent)
        } , 200)
        break
      case 'close_cursor_app':
        window.dispatchEvent(new Event('closeCursorAppEvent'))
        break
    }
  }
})
