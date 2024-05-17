chrome.action.onClicked.addListener((tab: any) => {
  const tabId = tab.id

  chrome.storage.sync.get().then(result => {
    console.log('Color setting : value is ' + result)

    chrome.tabs.sendMessage(tabId, { message: 'check_open_apps', settings: result }, msg => {
      console.log('check_for_crosshair_app result message:', msg)
      
      if (msg.alreadyRunning !== true) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['./js/cursorApp.js'],
        })
      }

    })
  })
})
