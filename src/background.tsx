import { defaultColor, defaultCursorType } from './constants/defaults'
import { getColorName } from './helpers'
import { ColorsEnum } from './constants/enums'

// Global flag to track extension context
let extensionValid = true

// Helper to safely call Chrome APIs
const safeChromeAPI = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  if (!extensionValid) {
    console.log('Extension context invalidated, skipping API call')
    return null
  }
  
  try {
    return await apiCall()
  } catch (error) {
    if (error.message?.includes('Extension context invalidated')) {
      console.log('Extension context invalidated')
      extensionValid = false
      return null
    }
    throw error
  }
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  safeChromeAPI(() => chrome.storage.local.set({
    cursorColor: defaultColor,
    cursorType: defaultCursorType,
    appActive: false,
  }))
})

// Helper function to check if URL is injectable
const isInjectableUrl = (url: string): boolean => {
  if (!url) return false
  
  const restrictedProtocols = [
    'chrome://',
    'chrome-extension://',
    'moz-extension://',
    'about:',
    'edge://',
    'opera://',
    'vivaldi://',
    'brave://'
  ]
  
  return !restrictedProtocols.some(protocol => url.startsWith(protocol))
}

// Helper function to safely execute script
const safeExecuteScript = async (tabId: number, files: string[]) => {
  try {
    // Get tab info first
    const tab = await chrome.tabs.get(tabId)
    
    if (!tab.url || !isInjectableUrl(tab.url)) {
      console.log(`Skipping script injection for restricted URL: ${tab.url}`)
      return false
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: files,
    })
    return true
  } catch (error) {
    console.log(`Failed to inject script on tab ${tabId}:`, error)
    return false
  }
}

const updateIcon = async () => {
  const result = await safeChromeAPI(() => chrome.storage.local.get())
  if (!result || !result.colorScheme) {
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

  await safeChromeAPI(() => chrome.action.setIcon({
    path: iconPathsObject,
  }))
}

// Update icon on storage changes instead of continuous polling
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && (changes.appActive || changes.cursorColor || changes.cursorType || changes.colorScheme)) {
    updateIcon()
  }
})

// Initial icon update
updateIcon()

// color scheme listener
chrome.runtime.onMessage.addListener(function (request) {
  console.log('request chrome.runtime.onMessage', request);
  if (
    request.scheme &&
    (request.scheme === 'dark' || request.scheme === 'light')
  ) {
    safeChromeAPI(() => chrome.storage.local.set({
      colorScheme: request.scheme,
    }))
  }
})

// when clicking the action, if the app is not active
// both the popup and app should be injected
// and the popup should be shown
chrome.action.onClicked.addListener(async (tab: any) => {
  const tabId = tab.id
  
  if (!tab.url || !isInjectableUrl(tab.url)) {
    console.log(`Cannot inject on restricted URL: ${tab.url}`)
    return
  }

  try {
    const result = await safeChromeAPI(() => chrome.storage.local.get())
    if (!result) return
    
    console.log('Color setting : value is ' + result)
    
    if (!result.appActive) {
      await safeChromeAPI(() => chrome.storage.local.set({
        appActive: true,
      }))
    }
    
    setTimeout(async () => {
      await safeExecuteScript(tabId, ['./js/wake_event.js'])
    }, 100)
    
    setTimeout(async () => {
      await safeExecuteScript(tabId, ['./js/popup_invoker.js'])
    }, 300)
  } catch (error) {
    console.error('Error in action click handler:', error)
  }
})

const ensureMounted = async (tabId: any) => {
  try {
    await safeExecuteScript(tabId, ['./js/app.js'])
    setTimeout(async () => {
      await safeExecuteScript(tabId, ['./js/popup.js'])
    }, 200)
  } catch (error) {
    console.error('Error ensuring mounted:', error)
  }
}

const handleTabPing = async (tabId: number) => {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
    if (tabs && tabs[0] && tabs[0].url && isInjectableUrl(tabs[0].url)) {
      await ensureMounted(tabId)
      const result = await safeChromeAPI(() => chrome.storage.local.get())
      if (!result) return
      
      if (!result.appActive) {
        await safeExecuteScript(tabId, ['./js/cleanup.js'])
      } else {
        await safeExecuteScript(tabId, ['./js/wake_event.js'])
      }
    }
  } catch (error) {
    console.error('Error in handleTabPing:', error)
  }
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
  // Only handle when page is completely loaded
  if (changeInfo.status === 'complete') {
    handleTabPing(tabId)
  }
})
