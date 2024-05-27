// on action click, inject popup into the page
// popup will save setings to storage and send events to App to request settings update
//
// when tab is invoked and app is active, inject app anyway
// but in this case, app checks that app is already there, and send event to update settings
//
//

import React, { useEffect, useState, useRef } from 'react'
// import Popup from './Popup'
import { appElementClass } from '../appConfig'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import '../styles/animations.css'

const App = () => {
  const [mouseX, setMouseX] = useState(0)
  const [radius, setRadius] = useState(80)
  const [mouseY, setMouseY] = useState(0)
  const [mouseOpacity, setMouseOpacity] = useState('0')
  // const [ignoringMouseUp, setIgnoringMouseUp] =
  //   useState<boolean>(false)
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

  const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.clientX)
    setMouseY(e.clientY)
    if (mouseOpacity !== '1') {
      setMouseOpacity('1')
    }
  }
  const handleMouseDown = (e: MouseEvent) => {
    setMouseDown(true)
    // setIgnoringMouseUp(true)
    if (pointClickElementRef && pointClickElementRef.current) {
      const clickEventElement: HTMLElement = pointClickElementRef.current
      clickEventElement.style.transition = 'none'
      clickEventElement.style.opacity = '0.6'
      // clickEventElement.style.transform = 'scale(0.3)'
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
  const handleTogglePower = (e: CustomEvent) => {
    chrome.storage.local.get().then(result => {
      console.log('handleWakeEvent chrome.storage.local.get() : result', result)
      setAppActive(result.appActive)
    })
  }
  const handleCloseAppEvent = (e: Event) => {
    // removeApp()
    setAppActive(false)
  }
  const handleWakeEvent = (e: Event) => {
    chrome.storage.local.get().then(result => {
      console.log('handleWakeEvent chrome.storage.local.get() : result', result)
      setAppActive(result.appActive)
    })
  }
  // const handleGetSettings = (e: CustomEvent) => {
  //   console.log('get settings', e.detail)
  //   setCursorType(e.detail.cursorType)
  //   setCursorColor(e.detail.cursorColor)
  //   if (powerOff) {
  //     setAppActive(false)
  //   }
  // }

  // const removeApp = () => {
  //   const rootEl = document.getElementById(appElementClass)
  //   if (rootEl) {
  //     window.removeEventListener('mousemove', handleMouseMove)
  //     window.removeEventListener('mousedown', handleMouseDown)
  //     window.removeEventListener('mouseup', handleMouseUp)
  //     window.removeEventListener('closeCursorAppEvent', handleCloseAppEvent)
  //     // @ts-ignore
  //     // window.removeEventListener(
  //     //   'dispatchCursorAppSettingsFromContentScript',
  //     //   handleGetSettings,
  //     // )
  //     // @ts-ignore
  //     // window.removeEventListener(
  //     //   'dispatchCursorAppSettingsFromPopup',
  //     //   handleGetSettings,
  //     // )
  //     // @ts-ignore
  //     window.removeEventListener('togglePowerButton', handleTogglePower)
  //     // @ts-ignore
  //     window.removeEventListener('cursorAppWakeEvent', handleWakeEvent)
  //     rootEl.remove()
  //     // const closeEvent = new CustomEvent('dispatchCloseFromCursorApp')
  //     // window.dispatchEvent(closeEvent)
  //   }
  // }

  const handleRequestSettingsUpdate = () => {
    chrome.storage.local.get().then(result => {
      console.log('chrome.storage.local.get() : result', result)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
    })
  }

  useEffect(() => {
    console.log('CURSOR APP  - useEffect')
    handleRequestSettingsUpdate()
    setMouseX(window.innerWidth / 2)
    setMouseY(window.innerHeight / 2)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('closeCursorAppEvent', handleCloseAppEvent, false)
    // @ts-ignore
    window.addEventListener(
      'requestCursorSettingsUpdate',
      handleRequestSettingsUpdate,
      false,
    )
    // @ts-ignore
    window.addEventListener('togglePowerButton', handleTogglePower, false)
    // @ts-ignore
    window.addEventListener('cursorAppWakeEvent', handleWakeEvent, false)

    chrome.storage.local.get().then(result => {
      console.log('CURSOR APP onStart - STORAGE: cursorType', result.cursorType)
      console.log(
        'CURSOR APP onStart - STORAGE: cursorColor',
        result.cursorColor,
      )
      console.log('CURSOR APP onStart - STORAGE: appActive', result.appActive)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
      setAppActive(result.appActive)
    })
  }, [])

  const commonValues = {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 999999999,
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
        className="AQUI CARALHO"
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
