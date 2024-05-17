import '../sharedstyles/tailwind.css'

import React, { useEffect, useState } from 'react'

const Popup = () => {
  const [count, setCount] = useState(0)
  const [cursorAppOpen, setCursorAppOpen] = useState(false)
  const [crosshairAppOpen, setCrosshairAppOpen] = useState(false)
  const [rulersAppOpen, setRulersAppOpen] = useState(false)
  const [currentURL, setCurrentURL] = useState<string>()
  const [tabId, setTabId] = useState<number>()

  useEffect(() => {
    if (!chrome || !chrome.action) return
    chrome.action.setBadgeText({ text: count.toString() })
  }, [count])

  useEffect(() => {
    if (!chrome || !chrome.tabs) return
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('rulersAppOpen useEffect chrome.tabs.query')
      const tab = tabs[0]
      console.log('tabs', tabs)
      if (tab.id) {
        setCurrentURL(tabs[0].url)
        setTabId(tab.id)
        chrome.tabs.sendMessage(
          tab.id,
          {
            message: 'check_open_apps',
            tabId: tabId,
          },
          msg => {
            console.log('toggleCursorApp result message:', msg)
            if (msg.cursorApp) {
              setCursorAppOpen(true)
            }
            if (msg.crosshairApp) {
              setCrosshairAppOpen(true)
            }
            if (msg.rulersApp) {
              setRulersAppOpen(true)
            }
          },
        )
      }
    })
  })

  const changeBackground = () => {
    if (!chrome || !chrome.tabs) return
    chrome.tabs.sendMessage(tabId!, { message: 'invert_colors' }, msg => {
      console.log('result message:', msg)
    })
  }

  const sendMessageWithoutResponse = (message: string) => {
    if (!chrome || !chrome.tabs) return
    chrome.tabs.sendMessage(tabId!, { message: message })
  }

  const toggleCursorApp = () => {
    console.log('toggleCursorApp')
    if (cursorAppOpen) {
      setCursorAppOpen(false)
      sendMessageWithoutResponse('close_cursor_app')
      return
    }
    if (chrome || !chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId: tabId! },
        files: ['./js/cursorApp.js'],
      })
    }
    setCursorAppOpen(true)
    window.close()
  }

  const toggleCrosshairApp = () => {
    console.log('crosshairAppOpen')
    if (crosshairAppOpen) {
      setCrosshairAppOpen(false)
      sendMessageWithoutResponse('close_crosshair_app')
      return
    }
    if (chrome || !chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId: tabId! },
        files: ['./js/crosshairApp.js'],
      })
    }
    setCrosshairAppOpen(true)
    window.close()
  }
  const toggleRulersApp = () => {
    console.log('toggleRulersApp')
    if (rulersAppOpen) {
      setRulersAppOpen(false)
      sendMessageWithoutResponse('close_rulers_app')
      return
    }
    if (chrome || !chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId: tabId! },
        files: ['./js/rulersApp.js'],
      })
    }
    setRulersAppOpen(true)
    window.close()
  }

  return (
    <div className="text-white bg-gray-900 p-4 flex flex-col gap-4 w-[300px]">
      <ul style={{ minWidth: '700px' }}>
        <li className="text-green-500">Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '5px' }}>
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
      <button onClick={toggleCursorApp} className={cursorAppOpen ? 'text-blue-500' : 'text-white'}>
        toggleCursorApp
      </button>
      <button
        onClick={toggleCrosshairApp}
        className={crosshairAppOpen ? 'text-blue-500' : 'text-white'}
      >
        toggleCrosshairApp
      </button>
      <button onClick={toggleRulersApp} className={rulersAppOpen ? 'text-blue-500' : 'text-white'}>
        toggleRulersApp
      </button>
      osdifhjodsihfodsihf
    </div>
  )
}

export default Popup
