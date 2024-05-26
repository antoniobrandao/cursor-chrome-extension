import React, { useEffect, useState, useRef } from 'react'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import {
  darkModeIconPaths,
  lightModeIconPaths,
  activeModeIconPaths,
} from '../constants/icon_paths'

const Popup = () => {
  const [yPosition, setYPosition] = useState<number>(-100)
  // const [appDismissed, setAppDismissed] = useState(true)
  const [appActive, setAppActive] = useState(false)
  const [initialised, setInitialised] = useState(false)
  // const [gotSettings, setGotSettings] = useState(false)
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(
    CursorTypeEnum.DOUBLE,
  )

  const wrapperRef = useRef(null)

  const handleClickOutside = (event: any) => {
    // @ts-ignore
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setYPosition(-100)
      // setAppDismissed(true)
    }
  }

  const handleReInvokeCursorPopup = () => {
    console.log('const handleReInvokeCursorPopup = () => {')
    setYPosition(0)
  }

  // const handleCloseCursorAppEvent = () => {
  //   console.log('handleCloseCursorAppEvent')
  //   // @ts-ignore
  //   window.removeEventListener('closeCursorAppEvent', handleCloseCursorAppEvent)
  // }

  useEffect(() => {
    if (!initialised) {
      console.log('INITIALISING')
      // @ts-ignore
      // window.addEventListener(
      //   'closeCursorAppEvent',
      //   handleCloseCursorAppEvent,
      //   false,
      // )
      // @ts-ignore
      window.addEventListener(
        'reInvokeCursorPopup',
        handleReInvokeCursorPopup,
        false,
      )
      document.addEventListener('mousedown', handleClickOutside)
      setInitialised(true)
      // setAppDismissed(false)
    }
    chrome.storage.sync.get().then(result => {
      console.log('POPUP onStart - STORAGE: cursorType', result.cursorType)
      console.log('POPUP onStart - STORAGE: cursorColor', result.cursorColor)
      console.log('POPUP onStart - STORAGE: appActive', result.appActive)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
      setAppActive(result.appActive)
    })
  }, [wrapperRef])

  const handleSetColor = (newColor: ColorsEnum) => {
    setCursorColor(newColor)
    if (!chrome || !chrome.storage) return
    console.log('popup trying to set storage : cursorColor: ' + newColor)
    chrome.storage.sync.set({ cursorColor: newColor }).then(() => {
      window.dispatchEvent(new Event('requestCursorSettingsUpdate'))
    })
  }

  const handleSetCursorType = (newCursorType: CursorTypeEnum) => {
    setCursorType(newCursorType)
    if (!chrome || !chrome.storage) return
    console.log('popup trying to set storage : cursorType: ' + newCursorType)
    chrome.storage.sync.set({ cursorType: newCursorType }).then(() => {
      window.dispatchEvent(new Event('requestCursorSettingsUpdate'))
    })
  }

  const handleToggleAppActive = () => {
    chrome.storage.sync.get().then(result => {
      console.log('popup - chrome.storage.sync.get() : result', result)
      if (result.appActive) {
        chrome.storage.sync.set({ appActive: false }).then(() => {
          setAppActive(false)
          window.dispatchEvent(new CustomEvent('togglePowerButton'))
        })
      } else {
        chrome.storage.sync.set({ appActive: true }).then(() => {
          setAppActive(true)
          window.dispatchEvent(new CustomEvent('togglePowerButton'))
        })
      }
    })
  }

  const swatchBaseStyle = {
    display: 'block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    cusror: 'pointer',
  }

  return (
    <div
      style={{
        zIndex: '9999999',
        display: 'flex',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '1px',
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          boxSizing: 'border-box',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
          position: 'fixed',
          // top: `${appDismissed || !initialised || !gotSettings ? -100 : 0}px`,
          top: yPosition,
          transition: 'top 0.3s',
          background: '#0D0F14',
          display: 'flex',
          flexDirection: 'column',
          marginRight: '120px',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: '2px solid rgb(162 176 184 / 9%)',
          borderTop: 'none',
          paddingTop: '14px',
          paddingRight: '20px',
          paddingLeft: '20px',
          paddingBottom: '16px',
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '22px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              gap: '8px',
              justifyContent: 'space-between',
            }}
          >
            <div
              onClick={() => handleSetCursorType(CursorTypeEnum.DOUBLE)}
              style={{
                boxSizing: 'border-box',
                cursor: 'pointer',
                border: `2px solid ${cursorColor}`,
                opacity: cursorType === CursorTypeEnum.DOUBLE ? 1 : 0.3,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  opacity: '0.5',
                  border: `4px solid ${cursorColor}`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                }}
              ></div>
            </div>
            <div
              onClick={() => handleSetCursorType(CursorTypeEnum.SINGLE)}
              style={{
                boxSizing: 'border-box',
                cursor: 'pointer',
                border: `5px solid ${cursorColor}`,
                opacity: cursorType === CursorTypeEnum.SINGLE ? 1 : 0.3,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            ></div>
            <div
              onClick={() => handleSetCursorType(CursorTypeEnum.FLAT)}
              style={{
                boxSizing: 'border-box',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                borderRadius: '50%',
                overflow: 'hidden',
                background: cursorColor,
                opacity: cursorType === CursorTypeEnum.FLAT ? 1 : 0.3,
              }}
            ></div>
          </div>
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '4px',
              }}
            >
              <div
                onClick={() => handleSetColor(ColorsEnum.GREEN)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.GREEN,
                  opacity: cursorColor !== ColorsEnum.GREEN ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.YELLOW)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.YELLOW,
                  opacity: cursorColor !== ColorsEnum.YELLOW ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.ORANGE)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.ORANGE,
                  opacity: cursorColor !== ColorsEnum.ORANGE ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.RED)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.RED,
                  opacity: cursorColor !== ColorsEnum.RED ? '0.3' : '1',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '4px',
              }}
            >
              <div
                onClick={() => handleSetColor(ColorsEnum.PURPLE)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.PURPLE,
                  opacity: cursorColor !== ColorsEnum.PURPLE ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.BLUE)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.BLUE,
                  opacity: cursorColor !== ColorsEnum.BLUE ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.CYAN)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.CYAN,
                  opacity: cursorColor !== ColorsEnum.CYAN ? '0.3' : '1',
                }}
              />
              <div
                onClick={() => handleSetColor(ColorsEnum.AUTO)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: ColorsEnum.AUTO,
                  opacity: cursorColor !== ColorsEnum.AUTO ? '0.3' : '1',
                }}
              />
            </div>
          </div>
          <>
            <PowerIcon
              onClick={handleToggleAppActive}
              style={{
                cursor: 'pointer',
                opacity: appActive ? '1' : '0.5',
                transform: 'scale(0.9)',
              }}
            />
          </>
        </div>
      </div>
    </div>
  )
}

export default Popup

function PowerIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      fill="none"
      viewBox="0 0 21 21"
    >
      <path
        fill="#A4B1B9"
        fillRule="evenodd"
        d="M10 0a1 1 0 011 1v7a1 1 0 11-2 0V1a1 1 0 011-1z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#A4B1B9"
        fillRule="evenodd"
        d="M15.693 3.893a1 1 0 011.414 0 10 10 0 11-14.189.044 1 1 0 011.424 1.406 8 8 0 1011.35-.036 1 1 0 01.001-1.414z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
