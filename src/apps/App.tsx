import React, { useEffect, useState, useRef } from 'react'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import '../styles/animations.css'

const App = () => {
  const [mouseX, setMouseX] = useState(0)
  const [radius, setRadius] = useState(80)
  const [mouseY, setMouseY] = useState(0)
  const [mouseOpacity, setMouseOpacity] = useState('0')
  const [appActive, setAppActive] = useState(true)
  const [mouseDown, setMouseDown] = useState(false)
  const [cursorColor, setCursorColor] = useState<ColorsEnum | string>(
    'transparent',
  )
  const [cursorType, setCursorType] = useState<CursorTypeEnum | string>(
    CursorTypeEnum.DOUBLE,
  )

  const pointClickElementRef = useRef(null)
  const pointClickElementRefA = useRef(null)
  const pointClickElementRadius = 58
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Global flag to track extension context
  const [extensionValid, setExtensionValid] = useState(true)

  // Helper to safely call Chrome APIs with comprehensive error handling
  const safeChromeAPI = async (apiCall: () => Promise<any>): Promise<any> => {
    if (!extensionValid) {
      console.log('Extension context invalidated, skipping API call in App')
      return null
    }
    
    try {
      // Check if Chrome APIs are available
      if (!chrome || !chrome.runtime || !chrome.storage) {
        console.log('Chrome APIs not available in App')
        return null
      }
      
      return await apiCall()
    } catch (error: any) {
      if (error?.message?.includes('Extension context invalidated') ||
          error?.message?.includes('message channel closed') ||
          error?.message?.includes('receiving end does not exist')) {
        console.log('Extension context invalidated in App')
        setExtensionValid(false)
        return null
      }
      console.log('Chrome API error in App:', error)
      return null
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.clientX)
    setMouseY(e.clientY)
    if (mouseOpacity !== '1') {
      setMouseOpacity('1')
    }
  }
  const handleMouseDown = (e: MouseEvent) => {
    setMouseDown(true)
    if (pointClickElementRef && pointClickElementRef.current) {
      const clickEventElement: HTMLElement = pointClickElementRef.current
      clickEventElement.style.transition = 'none'
      clickEventElement.style.opacity = '0.6'
      clickEventElement.style.top = `${
        e.clientY - pointClickElementRadius / 2
      }px`
      clickEventElement.style.left = `${
        e.clientX - pointClickElementRadius / 2
      }px`
      setTimeout(() => {
        clickEventElement.style.transition = 'all 1s ease-out'
      }, 5)
      setTimeout(() => {
        clickEventElement.style.opacity = '0'
      }, 10)
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    setMouseDown(false)
  }
  const handleTogglePower = async (e: Event) => {
    const result = await safeChromeAPI(async () => {
      return chrome.storage.local.get()
    })
    if (result) {
      console.log('handleTogglePower chrome.storage.local.get() : result', result)
      setAppActive(result.appActive)
    }
  }
  
  const handleCloseAppEvent = (e: Event) => {
    setAppActive(false)
  }

  const handleWakeEvent = async (e: Event) => {
    const result = await safeChromeAPI(async () => {
      return chrome.storage.local.get()
    })
    if (result) {
      console.log('handleWakeEvent chrome.storage.local.get() : result', result)
      setAppActive(result.appActive)
    }
  }

  const handleRequestSettingsUpdate = async () => {
    const result = await safeChromeAPI(async () => {
      return chrome.storage.local.get()
    })
    if (result) {
      console.log('chrome.storage.local.get() : result', result)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
    }
  }

  const checkStorageSettings = async () => {
    if (!extensionValid) {
      console.log('Extension context invalid, skipping storage check')
      return
    }
    
    const result = await safeChromeAPI(async () => {
      return chrome.storage.local.get()
    })
    if (result) {
      console.log('checkStorageSettings timeout : result', result)
      setAppActive(result.appActive)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
    }
  }

  useEffect(() => {
    console.log('CURSOR APP  - useEffect')

    // Storage change listener with proper error handling
    const handleStorageChange = (changes: any, namespace: string) => {
      if (!extensionValid) return
      
      if (namespace === 'local') {
        if (changes.appActive) setAppActive(changes.appActive.newValue)
        if (changes.cursorType) setCursorType(changes.cursorType.newValue)
        if (changes.cursorColor) setCursorColor(changes.cursorColor.newValue)
      }
    }

    // Set up chrome storage listener if available and context is valid
    let storageListenerAdded = false
    if (extensionValid && chrome?.storage?.onChanged) {
      try {
        chrome.storage.onChanged.addListener(handleStorageChange)
        storageListenerAdded = true
      } catch (error) {
        console.log('Failed to add storage listener:', error)
        setExtensionValid(false)
      }
    }

    // Fallback interval with much lower frequency and proper cleanup
    intervalRef.current = setInterval(checkStorageSettings, 5000) // Reduced from 1000ms to 5000ms
    
    handleRequestSettingsUpdate()
    setMouseX(window.innerWidth / 2)
    setMouseY(window.innerHeight / 2)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('closeCursorAppEvent', handleCloseAppEvent, false)
    window.addEventListener(
      'requestCursorSettingsUpdate',
      handleRequestSettingsUpdate,
      false,
    )
    window.addEventListener('togglePowerButton', handleTogglePower as EventListener, false)
    window.addEventListener('cursorAppWakeEvent', handleWakeEvent, false)

    // Initial settings load
    safeChromeAPI(async () => {
      return chrome.storage.local.get()
    }).then(result => {
      if (result) {
        console.log('CURSOR APP onStart - STORAGE: cursorType', result.cursorType)
        console.log(
          'CURSOR APP onStart - STORAGE: cursorColor',
          result.cursorColor,
        )
        console.log('CURSOR APP onStart - STORAGE: appActive', result.appActive)
        setCursorType(result.cursorType)
        setCursorColor(result.cursorColor)
        setAppActive(result.appActive)
      }
    }).catch(error => {
      console.log('Error loading initial settings:', error)
    })

    // Cleanup function
    return () => {
      console.log('CURSOR APP - Cleanup')
      
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      // Remove storage listener with error handling
      if (storageListenerAdded && chrome?.storage?.onChanged) {
        try {
          chrome.storage.onChanged.removeListener(handleStorageChange)
        } catch (error) {
          console.log('Error removing storage listener:', error)
        }
      }
      
      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('closeCursorAppEvent', handleCloseAppEvent)
      window.removeEventListener(
        'requestCursorSettingsUpdate',
        handleRequestSettingsUpdate
      )
      window.removeEventListener('togglePowerButton', handleTogglePower as EventListener)
      window.removeEventListener('cursorAppWakeEvent', handleWakeEvent)
    }
  }, [extensionValid]) // Add extensionValid as dependency

  const commonValues = {
    pointerEvents: 'none',
    position: 'fixed',
    // zIndex: 999999999,
    zIndex: 2147483647,
    borderRadius: '50%',
    transform: mouseDown ? 'scale(0.75)' : 'scale(1)',
    // transform: 'scale(1)',
    transitionProperty: 'transform, background-color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-in-out',
    width: `${radius}px`,
    height: `${radius}px`,
    top: `${mouseY - radius / 2}px`,
    left: `${mouseX - radius / 2}px`,
    boxSizing: 'border-box',
  }

  const stylesDouble = {
    ...commonValues,
    border: `2px solid ${cursorColor}`,
  }
  const stylesDoubleInner = {
    opacity: cursorColor === ColorsEnum.AUTO ? '0.2' : '0.5',
    borderRadius: '50%',
    border: `6px solid ${cursorColor}`,
    width: `${radius - 4}px`,
    height: `${radius - 4}px`,
    top: '0',
    left: '0',
    position: 'absolute',
    boxSizing: 'border-box',
    
  }

  const stylesSingle = {
    ...commonValues,
    border: `8px solid ${cursorColor}`,
    opacity: cursorColor === ColorsEnum.AUTO ? '1' : '0.7',
  }

  const stylesFlat = {
    ...commonValues,
    background: cursorColor,
    opacity: cursorColor === ColorsEnum.AUTO ? '1' : '0.5',
  }

  if (!appActive) return null
  if (mouseX === 0) return null
  if (mouseY === 0) return null
  if (window && mouseX === window.innerWidth) return null
  if (window && mouseY === window.innerHeight) return null

  return (
    <div
      style={{
        boxSizing: 'border-box',
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        margin: '0',
        position: 'fixed',
        zIndex: 999999999,
        top: '0',
        left: '0',
        opacity: mouseOpacity,
        mixBlendMode: cursorColor === ColorsEnum.AUTO ? 'difference' : 'unset',
      }}
    >
      <div
        ref={pointClickElementRef}
        style={{
          opacity: '0',
          position: 'fixed',
          width: `${pointClickElementRadius}px`,
          height: `${pointClickElementRadius}px`,
          background: cursorColor,
          boxSizing: 'border-box',
          borderRadius: '50%',
        }}
      />
      {cursorType === CursorTypeEnum.DOUBLE && (
        <div
          ref={pointClickElementRefA}
          // @ts-ignore
          style={stylesDouble}
        >
          {/* @ts-ignore */}
          <div style={stylesDoubleInner}></div>
        </div>
      )}
      {cursorType === CursorTypeEnum.SINGLE && (
        <div
          // @ts-ignore
          style={stylesSingle}
        ></div>
      )}
      {cursorType === CursorTypeEnum.FLAT && (
        <div
          // @ts-ignore
          style={stylesFlat}
        ></div>
      )}
    </div>
  )
}

export default App
