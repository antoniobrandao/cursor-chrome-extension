// import { appElementClass } from './appConfig'

// chrome.runtime.onMessage.addListener(function (
//   msg,
//   sender,
//   sendResponse,
// ) {
//   console.log('content_script: message listener: msg', msg)
//   if (msg.message) {
//     switch (msg.message) {
//       case 'get_color_mode':
//         const test = window.matchMedia(
//           '(prefers-color-scheme: light)',
//         )
//         console.log('test', test)
//         const responseColorMode = {
//           isLightMode: test.matches,
//         }
//         console.log('responseColorMode', responseColorMode)
//         sendResponse(responseColorMode)
//         break
//       case 'close_app':
//         window.dispatchEvent(new Event('closeCursorAppEvent'))
//         break
//     }
//   }
//   return true
// })
