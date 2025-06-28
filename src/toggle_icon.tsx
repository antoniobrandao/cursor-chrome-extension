// Helper to safely call Chrome APIs
const safeChromeAPI = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall()
  } catch (error) {
    if (error.message?.includes('Extension context invalidated')) {
      console.log('Extension context invalidated in content script')
      return null
    }
    console.log('Chrome API error:', error)
    return null
  }
}

const updateColorScheme = async () => {
  const scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
  try {
    // Send message to background script
    chrome.runtime.sendMessage({ scheme })
    
    // Also update local storage
    await safeChromeAPI(() => chrome.storage.local.set({
      colorScheme: scheme,
    }))
  } catch (error) {
    console.log('Failed to update color scheme:', error)
  }
}

// Initial update
updateColorScheme()

// Listen for system theme changes instead of polling
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', updateColorScheme)

// Fallback polling with much lower frequency and error handling
let pollCount = 0
const maxPolls = 60 // Stop after 1 minute

const intervalId = setInterval(async () => {
  pollCount++
  
  if (pollCount > maxPolls) {
    clearInterval(intervalId)
    console.log('Stopped color scheme polling after max attempts')
    return
  }
  
  await updateColorScheme()
}, 1000)
