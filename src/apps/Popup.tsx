import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
// import '../sharedstyles/tailwind.css'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import CloseIcon from '../components/CloseIcon'

const componentWidth = 260

const Popup = () => {
  const [yPosition, setYPosition] = useState<number>(-100)
  const [appDismissed, setAppDismissed] = useState(false)
  const [cursorAppOpen, setCursorAppOpen] = useState(false)
  const [receivedSettings, setReceivedSettings] = useState(false)
  const [popupLeft, setPopupLeft] = useState<number>(-200)
  const [tabId, setTabId] = useState<number>()
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(CursorTypeEnum.DOUBLE)

  const wrapperRef = useRef(null)
  
  const handleGetSettings = (e: CustomEvent) => {
    console.log('get settings', e.detail)
    setCursorType(e.detail.cursorType)
    setCursorColor(e.detail.cursorColor)
  }

  // const closePopup = () => {
  //   setYPosition(-100)
  //   setReceivedSettings(false)
  //   // window.removeEventListener('mousedown', closePopup)
  //   // // @ts-ignore
  //   // window.removeEventListener('dispatchCursorAppSettings', handleGetSettings)
  // }
  
  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setYPosition(-100)
        setAppDismissed(true)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  useEffect(() => {
    if(!receivedSettings && !appDismissed) {
      setPopupLeft(window.innerWidth / 2 - componentWidth / 2)
      setTimeout(() => {
        setYPosition(0)
      }, 300)
      // @ts-ignore
      window.addEventListener('dispatchCursorAppSettings', handleGetSettings, false)
      setReceivedSettings(true)
    }
    
    // @ts-ignore
    // window.addEventListener('mousedown', closePopup)
    // if (!chrome || !chrome.tabs) return
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   console.log('cursorAPP : POPUP : useEffect : inside chrome.tabs.query')
    //   const tab = tabs[0]
    //   console.log('tabs', tabs)
    //   if (tab.id) {
    //     setTabId(tab.id)
    //     chrome.tabs.sendMessage(
    //       tab.id,
    //       {
    //         message: 'check_if_app_is_open',
    //         tabId: tabId,
    //       },
    //       msg => {
    //         console.log('toggleCursorApp result message:', msg)
    //         if (msg.alreadyOpen) {
    //           setCursorAppOpen(true)
    //         }
    //       },
    //     )
    //   }
    // })
  })

  const sendMessageWithoutResponse = (message: string) => {
    if (!chrome || !chrome.tabs) return
    chrome.tabs.sendMessage(tabId!, { message: message })
  }

  // const toggleCursorApp = () => {
  //   console.log('toggleCursorApp')
  //   if (cursorAppOpen) {
  //     setCursorAppOpen(false)
  //     sendMessageWithoutResponse('close_cursor_app')
  //     return
  //   }
  //   if (chrome || !chrome.scripting) {
  //     chrome.scripting.executeScript({
  //       target: { tabId: tabId! },
  //       files: ['./js/cursorApp.js'],
  //     })
  //   }
  //   setCursorAppOpen(true)
  //   window.close()
  // }

  // const handleClose = () => {
  //   sendMessageWithoutResponse('close_app')
  //   window.close()
  // }

  const handleSetColor = (newColor: ColorsEnum) => {
    setCursorColor(newColor)
    const settingsPackage = {
      cursorType: cursorType,
      cursorColor: newColor,
    }
    const newEvent = new CustomEvent('dispatchCursorAppSettings', { detail: settingsPackage })
    window.dispatchEvent(newEvent)
    if (!chrome || !chrome.storage) return
    chrome.storage.sync.set({ color: newColor })
  }

  const handleSetCursorType = (newCursorType: CursorTypeEnum) => {
    setCursorType(newCursorType)
    const settingsPackage = {
      cursorType: newCursorType,
      cursorColor: cursorColor,
    }
    const newEvent = new CustomEvent('dispatchCursorAppSettings', { detail: settingsPackage })
    window.dispatchEvent(newEvent)
    if (!chrome || !chrome.storage) return
    chrome.storage.sync.set({ cursorType: newCursorType })
  }

  const swatchBaseStyle = {
    display: 'block',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cusror: 'pointer',
  }

  //   <div
  //   onClick={handleClose}
  //   className={clsx(swatchBaseStyle, 'relative opacity-30 hover:opacity-100')}
  //   style={{ border: `2px solid ${ColorsEnum.AUTO}` }}
  // >
  //   <CloseIcon />
  // </div>

  return (
    <div
      ref={wrapperRef}
      style={{
        boxSizing: 'border-box',
        width: `${componentWidth}px`,
        left: `${popupLeft}px`,
        borderBottomRightRadius: '6px',
        borderBottomLeftRadius: '6px',
        position: 'fixed',
        top: `${receivedSettings ? yPosition : -100}px`,
        transition: 'top 0.3s',
        background: '#121212',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        height: '70px',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            gap: '8px',
            justifyContent: 'space-between',
            paddingRight: '16px',
          }}
        >
          <div
            onClick={() => handleSetCursorType(CursorTypeEnum.DOUBLE)}
            style={{
              boxSizing: 'border-box',
              cursor: 'pointer',
              border: `2px solid ${cursorColor}`,
              opacity: cursorType === CursorTypeEnum.DOUBLE ? 1 : 0.3,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                cursor: 'pointer',
                opacity: '0.5',
                border: `6px solid ${cursorColor}`,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'absolute',
                top: '17px',
                left: '17px',
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
            justifyContent: 'space-between',
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
                background: ColorsEnum.GREEN,
                opacity: cursorColor !== ColorsEnum.GREEN ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.YELLOW)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
                background: ColorsEnum.YELLOW,
                opacity: cursorColor !== ColorsEnum.YELLOW ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.ORANGE)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
                background: ColorsEnum.ORANGE,
                opacity: cursorColor !== ColorsEnum.ORANGE ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.RED)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
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
                background: ColorsEnum.PURPLE,
                opacity: cursorColor !== ColorsEnum.PURPLE ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.BLUE)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
                background: ColorsEnum.BLUE,
                opacity: cursorColor !== ColorsEnum.BLUE ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.CYAN)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
                background: ColorsEnum.CYAN,
                opacity: cursorColor !== ColorsEnum.CYAN ? '0.3' : '1',
              }}
            />
            <div
              onClick={() => handleSetColor(ColorsEnum.AUTO)}
              style={{
                ...swatchBaseStyle,
                boxSizing: 'border-box',
                background: ColorsEnum.AUTO,
                opacity: cursorColor !== ColorsEnum.AUTO ? '0.3' : '1',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
