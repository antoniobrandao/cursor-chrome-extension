import { defaultColor, defaultCursorType } from './constants/defaults'
import { getColorName } from './helpers'
import { ColorsEnum } from './constants/enums'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  chrome.storage.local.set({
    cursorColor: defaultColor,
    cursorType: defaultCursorType,
    appActive: false,
  })
})

const updateIcon = () => {
  chrome.storage.local.get().then(result => {
    // console.log('Background polling result is ' + result)
    // console.log('result.colorScheme', result.colorScheme)
    // console.log('result.appActive', result.appActive)
    if (!result) {
      return
    }
    if (!result.colorScheme) {
      return
    }

    const typeName = String(result.cursorType).toLowerCase()
    const colorName = getColorName(result.cursorColor).toLowerCase()

    let iconName
    if (result.appActive) {
      iconName = `${typeName}-on-${colorName}`
      if (result.cursorColor === ColorsEnum.AUTO) {
        iconName = `${typeName}-on-auto-${result.colorScheme}`
      }
    } else {
      iconName = `${typeName}-off-${result.colorScheme}`
    }

    const iconPath = `/icons/icon-${iconName}.png`

    const iconPathsObject = {
      '128': iconPath,
      '48': iconPath,
      '32': iconPath,
      '16': iconPath,
    }

    chrome.action.setIcon({
      path: iconPathsObject,
    })
  })
}

setInterval(updateIcon, 500)

chrome.runtime.onMessage.addListener(function (request) {
  console.log('request chrome.runtime.onMessage', request);
  
  if (
    request.scheme &&
    (request.scheme === 'dark' || request.scheme === 'light')
  ) {
    chrome.storage.local.set({
      colorScheme: request.scheme,
    })
  }
})

// when clicking the action, if the app is not active
// both the popup and app should be injected
// and the popup should be shown
chrome.action.onClicked.addListener((tab: any) => {
  const tabId = tab.id
  chrome.storage.local.get().then(result => {
    console.log('Color setting : value is ' + result)
    if (!result.appActive) {
      chrome.storage.local.set({
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

const ensureMounted = (tabId: any) => {
  chrome.storage.local.get().then(result => {
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
  })
}

const handleTabPing = (tabId: number) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url) {
      ensureMounted(tabId)
      chrome.storage.local.get().then(result => {
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
