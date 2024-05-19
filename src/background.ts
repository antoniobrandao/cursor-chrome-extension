
chrome.action.onClicked.addListener((tab: any) => {
  const tabId = tab.id

  chrome.storage.sync.get().then(result => {
    console.log('Color setting : value is ' + result)

    chrome.tabs.sendMessage(tabId, { message: 'check_if_app_is_open', settings: result }, msg => {
      console.log('check_for_crosshair_app result message:', msg)
      if (msg && msg.alreadyOpen === false) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['./js/cursorApp.js'],
        })
      }
    })

  })
})


// // import { AppEvent as AppEventEnum } from './constants/enums'
// import { defaultColor, defaultCursorType } from './constants/defaults'

// chrome.action.onClicked.addListener((tab: any) => {
//   const tabId = tab.id

//   chrome.storage.sync.get().then(result => {
//     console.log('Background sync.get() : result: ' + result)
//     const cursorColor = result && result.cursorColor ? result.cursorColor : defaultColor
//     const cursorType = result && result.cursorType ? result.cursorType : defaultCursorType

//     const settingsResponse = {
//       cursorColor: cursorColor,
//       cursorType: cursorType,
//     }

//     chrome.tabs.sendMessage(tabId, { message: 'ACTION_STARTUP_CHECK', settings: settingsResponse }, msg => {
//       console.log('ACTION_STARTUP_CHECK result message:', msg)
//       // if (!msg || !msg.alreadyOpen) {
//       //   chrome.scripting.executeScript({
//       //     target: { tabId: tabId },
//       //     files: ['./js/cursorApp.js'],
//       //   })
//       // }
//       return true
//     })
    
//   })
// })
