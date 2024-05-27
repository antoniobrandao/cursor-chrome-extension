import { appElementClass } from './appConfig'

chrome.runtime.onMessage.addListener(function (
  msg,
  sender,
  sendResponse,
) {
  console.log('content_script: message listener: msg', msg)
  if (msg.message) {
    switch (msg.message) {
      case 'get_color_mode':
        const test = window.matchMedia(
          '(prefers-color-scheme: light)',
        )
        console.log('test', test)
        const responseColorMode = {
          isLightMode: test.matches,
        }
        console.log('responseColorMode', responseColorMode)
        sendResponse(responseColorMode)
        break
      case 'close_app':
        window.dispatchEvent(new Event('closeCursorAppEvent'))
        break
    }
  }
  return true
})

// case 'check_if_app_is_open':
//   const response = {
//     alreadyOpen:
//       document.getElementById(appElementClass) !== null,
//   }
//   console.log('sending response', response)
//   const settingsPackage = {
//     cursorType: msg.settings.cursorType,
//     cursorColor: msg.settings.cursorColor,
//   }
//   sendResponse(response)
//   setTimeout(() => {
//     const newEvent = new CustomEvent(
//       'dispatchCursorAppSettingsFromContentScript',
//       {
//         detail: settingsPackage,
//       },
//     )
//     window.dispatchEvent(newEvent)
//   }, 200)
//   break

// const handleGetSettingsFromApp = (e: CustomEvent) => {
//   console.log(
//     'content_script: handleGetSettingsFromApp: e.detail',
//     e.detail,
//   )
//   chrome.storage.local.set({
//     cursorColor: e.detail.cursorColor,
//     cursorType: e.detail.cursorType,
//   })
// }

// const handleCloseFromApp = (e: CustomEvent) => {
//   chrome.runtime.sendMessage({ order: 'close_app' })
//   return true
// }

// @ts-ignore
// window.addEventListener(
//   'dispatchCursorAppSettingsFromApp',
//   handleGetSettingsFromApp,
//   false,
// )
// @ts-ignore
// window.addEventListener(
//   'dispatchCloseFromCursorApp',
//   handleCloseFromApp,
//   false,
// )

// new

// window.addEventListener('message', function ({ data }) {
//   console.log('window message event listener: data:', data)
//   if (data.from === 'discuss') {
//     chrome.runtime.sendMessage(data)
//   }
// })

// chrome.runtime.onMessage.addListener(function (request) {
//   console.log('chrome.runtime.onMessage.addListener: request:', request)
//   window.postMessage(request)
// })

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   console.log('content_script: message listener: msg', msg)
//   sendResponse({response: 'content_script received message'})
//   return true
// })

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   const { from, type, value } = request
//   console.log('chrome.runtime.onMessage.addListener')
//   console.log('request', request)
//   console.log('type', request)
//   console.log('type', value)
//   sendResponse({response: 'content_script received message'})
// })
