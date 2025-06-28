// Global flag to track extension context
let extensionValid = true

// Helper to safely call Chrome APIs with better error handling
const safeChromeAPI = async (apiCall: () => Promise<any>): Promise<any> => {
  if (!extensionValid) {
    console.log('Extension context invalidated, skipping API call')
    return null
  }
  
  try {
    // Check if chrome APIs are available
    if (!chrome || !chrome.runtime || !chrome.storage) {
      throw new Error('Chrome APIs not available')
    }
    
    return await apiCall()
  } catch (error: any) {
    if (error?.message?.includes('Extension context invalidated') || 
        error?.message?.includes('message channel closed') ||
        error?.message?.includes('receiving end does not exist')) {
      console.log('Extension context invalidated in content script')
      extensionValid = false
      return null
    }
    console.log('Chrome API error:', error)
    return null
  }
}

// Helper to check if extension context is still valid
const isContextValid = (): boolean => {
  try {
    return extensionValid && 
           typeof chrome !== 'undefined' && 
           !!chrome.runtime && 
           !!chrome.runtime.id && 
           !!chrome.storage
  } catch {
    extensionValid = false
    return false
  }
}

const updateColorScheme = async () => {
  if (!isContextValid()) {
    console.log('Extension context invalid, skipping color scheme update')
    return
  }
  
  const scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
  try {
    // Send message to background script with error handling
    await safeChromeAPI(async () => {
      return chrome.runtime.sendMessage({ scheme })
    })
    
    // Also update local storage
    await safeChromeAPI(async () => {
      return chrome.storage.local.set({ colorScheme: scheme })
    })
  } catch (error) {
    console.log('Failed to update color scheme:', error)
    extensionValid = false
  }
}

// Initial update with delay to ensure extension is ready
setTimeout(() => {
  if (isContextValid()) {
    updateColorScheme()
  }
}, 100)

// Listen for system theme changes instead of polling (more efficient)
try {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (isContextValid()) {
      updateColorScheme()
    }
  })
} catch (error) {
  console.log('Failed to set up media query listener:', error)
}

// Remove the problematic polling mechanism entirely
// The media query listener above is sufficient and more efficient


