import React, { useEffect, useState } from 'react'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import '../sharedstyles/animations.css'

const Cursor = () => {
  const [mouseX, setMouseX] = useState(0)
  const [radius, setRadius] = useState(80)
  const [mouseY, setMouseY] = useState(0)
  const [mouseDown, setMouseDown] = useState(false)
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(CursorTypeEnum.DOUBLE)

  const handleMouseMove = (e: MouseEvent) => {
    console.log('mousemove', e.clientX, e.clientY)
    setMouseX(e.clientX)
    setMouseY(e.clientY)
  }
  const handleMouseDown = (e: MouseEvent) => {
    console.log('mousedown', e.clientX, e.clientY)
    setMouseDown(true)
  }
  const handleMouseUp = (e: MouseEvent) => {
    console.log('mouseup', e.clientX, e.clientY)
    setMouseDown(false)
  }
  const handleCloseAppEvent = (e: Event) => {
    removeApp()
  }

  const removeApp = () => {
    const rootEl = document.getElementById('ab-cursor-app')
    if (rootEl) {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('closeCursorAppEvent', handleCloseAppEvent)
      rootEl.remove()
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('closeCursorAppEvent', handleCloseAppEvent, false)
    // @ts-ignore
    if(window.cursorAppSettings && window.cursorAppSettings.cursorType) {
      // @ts-ignore
      setCursorType(window.cursorAppSettings.cursorType)
    }
    // @ts-ignore
    if(window.cursorAppSettings && window.cursorAppSettings.cursorColor) {
      // @ts-ignore
      setCursorColor(window.cursorAppSettings.cursorColor)
    }
  }, [])

  return (
    <div
      id="ab-cursor-app"
      style={{
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        margin: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        // border: '2px solid red',
        // background: 'rgba(255,255,255,0.01)'
      }}
    >
      <div
        style={{
          pointerEvents: 'none',
          position: 'fixed',
          // background: mouseDown ? 'rgba(34,197,94,0.3)' : 'transparent',
          transform: mouseDown ? 'scale(0.75)' : 'scale(1)',
          zIndex: 999999999,
          border: `8px solid ${cursorColor}`,
          borderRadius: '50%',
          transitionProperty: 'transform, background-color',
          transitionDuration: '100ms',
          transitionTimingFunction: 'ease-in-out',
          width: `${radius}px`,
          height: `${radius}px`,
          top: `${mouseY - radius / 2}px`,
          left: `${mouseX - radius / 2}px`,
        }}
      ></div>
    </div>
  )
}

export default Cursor
