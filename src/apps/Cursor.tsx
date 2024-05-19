import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import '../sharedstyles/animations.css'

const Cursor = () => {
  const [mouseX, setMouseX] = useState(0)
  const [radius, setRadius] = useState(80)
  const [mouseY, setMouseY] = useState(0)
  const [mouseDown, setMouseDown] = useState(false)
  const [cursorColor, setCursorColor] = useState<ColorsEnum | string>('transparent')
  const [cursorType, setCursorType] = useState<CursorTypeEnum | string>(CursorTypeEnum.DOUBLE)

  const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.clientX)
    setMouseY(e.clientY)
  }
  const handleMouseDown = (e: MouseEvent) => {
    setMouseDown(true)
  }
  const handleMouseUp = (e: MouseEvent) => {
    setMouseDown(false)
  }
  const handleCloseAppEvent = (e: Event) => {
    removeApp()
  }
  const handleGetSettings = (e: CustomEvent) => {
    console.log('get settings', e.detail)
    setCursorType(e.detail.cursorType)
    setCursorColor(e.detail.cursorColor)
  }

  const removeApp = () => {
    const rootEl = document.getElementById('ab-cursor-app')
    if (rootEl) {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('closeCursorAppEvent', handleCloseAppEvent)
      // @ts-ignore
      window.removeEventListener('dispatchCursorAppSettingsFromContentScript', handleGetSettings)
      // @ts-ignore
      window.removeEventListener('dispatchCursorAppSettingsFromApp', handleGetSettings)
      rootEl.remove()
    }
  }

  useEffect(() => {
    console.log('CURSOR APP  - useEffect')
    setMouseX(window.innerWidth / 2)
    setMouseY(window.innerHeight / 2)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('closeCursorAppEvent', handleCloseAppEvent, false)
    // @ts-ignore
    window.addEventListener('dispatchCursorAppSettingsFromContentScript', handleGetSettings, false)
    // @ts-ignore
    window.addEventListener('dispatchCursorAppSettingsFromApp', handleGetSettings, false)
    // @ts-ignore
    if (window.cursorAppSettings && window.cursorAppSettings.cursorType) {
      // @ts-ignore
      setCursorType(window.cursorAppSettings.cursorType)
    }
    // @ts-ignore
    if (window.cursorAppSettings && window.cursorAppSettings.cursorColor) {
      // @ts-ignore
      setCursorColor(window.cursorAppSettings.cursorColor)
    }
  }, [])

  const commonValues = {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 999999999,
    borderRadius: '50%',
    transform: mouseDown ? 'scale(0.75)' : 'scale(1)',
    transitionProperty: 'transform, background-color',
    transitionDuration: '100ms',
    transitionTimingFunction: 'ease-in-out',
    width: `${radius}px`,
    height: `${radius}px`,
    top: `${mouseY - radius / 2}px`,
    left: `${mouseX - radius / 2}px`,
  }

  const stylesDouble = { ...commonValues, border: `2px solid ${cursorColor}` }
  const stylesDoubleInner = {
    opacity: cursorColor === ColorsEnum.AUTO ? '0.2' : '0.5',
    borderRadius: '50%',
    border: `6px solid ${cursorColor}`,
    width: `${radius - 4}px`,
    height: `${radius - 4}px`,
    top: '0',
    left: '0',
  }
  
  const stylesSingle = { 
    ...commonValues,
    border: `8px solid ${cursorColor}`,
    opacity: cursorColor === ColorsEnum.AUTO ? '1' : '0.7'
  }

  const stylesFlat = {
    ...commonValues,
    background: cursorColor,
    opacity: cursorColor === ColorsEnum.AUTO ? '1' : '0.5',
  }

  return (
    <>
      <Popup />
      <div
        style={{
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
          margin: '0',
          position: 'fixed',
          zIndex: 999999999,
          top: '0',
          left: '0',
          mixBlendMode: cursorColor === ColorsEnum.AUTO ? 'difference' : 'unset',
          // border: '2px solid red',
          // background: 'rgba(255,255,255,0.01)'
        }}
      >
        {cursorType === CursorTypeEnum.DOUBLE && (
          <div
            // @ts-ignore
            style={stylesDouble}
          >
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
    </>
  )
}

export default Cursor
