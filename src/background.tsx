import { defaultColor, defaultCursorType } from './constants/defaults'
import {
  darkModeIconPaths,
  lightModeIconPaths,
  activeModeIconPaths,
} from './constants/icon_paths'

let isDarkMode = false
let isOpen = false

chrome.runtime.onInstalled.addListener(({ reason }) => {
  // if (reason === 'install') {
  chrome.storage.sync.set({
    cursorColor: defaultColor,
    cursorType: defaultCursorType,
    appActive: false,
  })
  // }
  // tryQueryingTab()
})

// chrome.runtime.onStartup.addListener(() => {
//   chrome.storage.sync.get().then(result => {
//     console.log('Cursor Highlighter Pro : onStartup : props is ' + result)
//     if(result.appActive) {
//       chrome.action.setIcon({
//         path: activeModeIconPaths,
//       })
//       chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         files: ['./js/app.js'],
//       })
//     }
//   })
// })

let themeInterval: any

themeInterval = setInterval(() => {
  // console.log('setInterval (toggle_icon)')
  chrome.storage.sync.get().then(result => {
    console.log('Background polling result is ' + result)
    console.log('result.colorScheme', result.colorScheme)
    console.log('result.appActive', result.appActive)
    // console.dir('result', result)
    if (!result) {
      return
    }
    if (result.appActive === true) {
      chrome.action.setIcon({
        path: activeModeIconPaths,
      })
      // clearInterval(themeInterval)
    } else if (result.colorScheme === 'dark') {
      chrome.action.setIcon({
        path: darkModeIconPaths,
      })
      // clearInterval(themeInterval)
    } else if (result.colorScheme === 'light') {
      chrome.action.setIcon({
        path: lightModeIconPaths,
      })
      // clearInterval(themeInterval)
    }
  })
}, 500)

chrome.runtime.onMessage.addListener(function (request) {
  if (request.scheme && (request.scheme === 'dark' || request.scheme === 'light')) {
    // isDarkMode = true
    chrome.storage.sync.set({
      colorScheme: request.scheme,
    })
    // chrome.storage.sync.get().then(result => {
    //   chrome.action.setIcon({
    //     path: result.appActive ? activeModeIconPaths : darkModeIconPaths,
    //   })
    // })
  }
})

// when clicking the action, if the app is not active
// both the popup and app should be injected
// and the popup should be shown
chrome.action.onClicked.addListener((tab: any) => {
  const tabId = tab.id
  chrome.storage.sync.get().then(result => {
    console.log('Color setting : value is ' + result)
    if (!result.appActive) {
      chrome.storage.sync.set({
        appActive: true,
      })
    }
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['./js/wake_event.js'],
      })
    }, 100)
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['./js/popup_invoker.js'],
      })
    }, 300)
  })
})

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.order === 'close_app') {
//     chrome.action.setIcon({ path: '/icon.png' })
//     return true
//   }
// })

const ensureMounted = (tabId: any) => {
  console.log('ensureMounted tabId:', tabId)
  chrome.storage.sync.get().then(result => {
    console.log('Cursor Highlighter Pro : onStartup : props is ' + result)
    // if (result.appActive) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['./js/app.js'],
    })
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['./js/popup.js'],
      })
    }, 200)
    // }

    // setTimeout(() => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tabId },
    //     files: ['./js/wake_event.js'],
    //   })
    // }, 400)
  })
}

const handleTabPing = (tabId: number) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log('tabs', tabs)
    if (tabs && tabs[0] && tabs[0].url) {
      console.log('handleActivated passed : tabs[0].url: ', tabs[0].url)
      ensureMounted(tabId)
      chrome.storage.sync.get().then(result => {
        console.log('handleActivated : result.appActive ' + result.appActive)
        if (!result.appActive) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['./js/cleanup.js'],
          })
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['./js/wake_event.js'],
          })
        }
      })
    }
  })
}
function handleActivated(activeInfo: any) {
  console.log('handleActivated activeInfo.tabId:', activeInfo.tabId)
  handleTabPing(activeInfo.tabId)
}

// when reloading or activating another tab with the app cursor app active,
// both the popup and app should be injected
// both the popup should not be shown
chrome.tabs.onActivated.addListener(handleActivated)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  handleTabPing(tabId)
})
