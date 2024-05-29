if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chrome.runtime.sendMessage({ scheme: 'dark' })
} else {
  chrome.runtime.sendMessage({ scheme: 'light' })
}

let intervalVar: any
intervalVar = setInterval(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    chrome.runtime.sendMessage({ scheme: 'dark' })
  } else {
    chrome.runtime.sendMessage({ scheme: 'light' })
  }
}, 1000)
