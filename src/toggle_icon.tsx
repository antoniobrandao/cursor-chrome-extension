if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chrome.runtime.sendMessage({ scheme: 'dark' })
} else {
  chrome.runtime.sendMessage({ scheme: 'light' })
}

setInterval(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    chrome.runtime.sendMessage({ scheme: 'dark' })
    chrome.storage.local.set({
      colorScheme: 'dark',
    })
  } else {
    chrome.runtime.sendMessage({ scheme: 'light' })
    chrome.storage.local.set({
      colorScheme: 'light',
    })
  }
}, 1000)
