import {
  darkModeIconPaths,
  lightModeIconPaths,
  activeModeIconPaths,
} from './constants/icon_paths'

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chrome.runtime.sendMessage({ scheme: 'dark' })
} else {
  chrome.runtime.sendMessage({ scheme: 'light' })
}



let intervalVar: any
intervalVar = setInterval(() => {
  console.log('setInterval (toggle_icon)')
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    chrome.runtime.sendMessage({ scheme: 'dark' })
    console.log('matches')
    // chrome.storage.local.set({
    //   colorScheme: 'dark',
    // })
    // chrome.browserAction.setIcon({
    //   path: darkModeIconPaths,
    // })
    // clearInterval(intervalVar)
  } else {
    console.log('matches not')
    chrome.runtime.sendMessage({ scheme: 'light' })
    // chrome.storage.local.set({
    //   colorScheme: 'light',
    // })
    // chrome.browserAction.setIcon({
    //   path: lightModeIconPaths,
    // })
    // clearInterval(intervalVar)
  }
}, 1000)
