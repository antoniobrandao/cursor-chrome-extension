chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('msg', msg)
  console.log('msg.message', msg.message)
  if (msg.message) {
    switch (msg.message) {
      case 'check_open_apps':
        sendResponse({
          cursorApp: document.getElementById('ab-cursor-app') !== null,
        })
        break
      case 'close_cursor_app':
        window.dispatchEvent(new Event('closeCursorAppEvent'))
        break
      case 'invert_colors':
        console.log('Receive color = ' + msg.color)
        const invertFilter =
          'invert(1) hue-rotate(180deg) saturate(80%) brightness(0.5) contrast(84%)'
        document.documentElement.style.filter = invertFilter

        sendResponse('Change color to ' + msg.color)
        break
    }
  }
})
