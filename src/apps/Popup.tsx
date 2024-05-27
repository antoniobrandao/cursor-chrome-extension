import React, { useEffect, useState, useRef } from 'react'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import {
  darkModeIconPaths,
  lightModeIconPaths,
  activeModeIconPaths,
} from '../constants/icon_paths'
import '../styles/popup.css'
import tinycolor from 'tinycolor2'
import { defaultColor, defaultCursorType } from '../constants/defaults'

const Popup = () => {
  const [yPosition, setYPosition] = useState<number>(-100)
  // const [yPosition, setYPosition] = useState<number>(0)
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
    setYPosition(2)
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
    if (chrome && chrome.storage) {
      chrome.storage.local.get().then(result => {
        console.log('POPUP onStart - STORAGE: cursorType', result.cursorType)
        console.log('POPUP onStart - STORAGE: cursorColor', result.cursorColor)
        console.log('POPUP onStart - STORAGE: appActive', result.appActive)
        setCursorType(result.cursorType)
        setCursorColor(result.cursorColor)
        setAppActive(result.appActive)
      })
    } else {
      setCursorType(defaultCursorType)
      setCursorColor(defaultColor)
      setAppActive(appActive)
    }
  }, [wrapperRef])

  const handleSetColor = (newColor: ColorsEnum) => {
    setCursorColor(newColor)
    if (!chrome || !chrome.storage) return
    console.log('popup trying to set storage : cursorColor: ' + newColor)
    chrome.storage.local.set({ cursorColor: newColor }).then(() => {
      window.dispatchEvent(new Event('requestCursorSettingsUpdate'))
    })
  }

  const handleSetCursorType = (newCursorType: CursorTypeEnum) => {
    setCursorType(newCursorType)
    if (!chrome || !chrome.storage) return
    console.log('popup trying to set storage : cursorType: ' + newCursorType)
    chrome.storage.local.set({ cursorType: newCursorType }).then(() => {
      window.dispatchEvent(new Event('requestCursorSettingsUpdate'))
    })
  }

  const handleToggleAppActive = () => {
    chrome.storage.local.get().then(result => {
      console.log('popup - chrome.storage.local.get() : result', result)
      if (result.appActive) {
        chrome.storage.local.set({ appActive: false }).then(() => {
          setAppActive(false)
          window.dispatchEvent(new CustomEvent('togglePowerButton'))
        })
      } else {
        chrome.storage.local.set({ appActive: true }).then(() => {
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

  const divider = <div className='ab-cursor-divider' style={{ width: '1px', height: '26px' }} />
  const colorToUse = cursorColor
  const colorToUseTC = tinycolor(cursorColor)
  const colorToUseTCTransparent = colorToUseTC.setAlpha(.5)
  return (
    <div
      style={{
        zIndex: 9999999999,
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
        className="ab-cursor-popup-bg"
        ref={wrapperRef}
        style={{
          boxSizing: 'border-box',
          // borderBottomRightRadius: '10px',
          // borderBottomLeftRadius: '10px',
          borderRadius: '10px',
          position: 'fixed',
          // top: `${appDismissed || !initialised || !gotSettings ? -100 : 0}px`,
          top: yPosition,
          transition: 'top 0.3s',
          display: 'flex',
          flexDirection: 'column',
          marginRight: '120px',
          height: '60px',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          // border: '2px solid rgb(162 176 184 / 9%)',
          borderWidth: '2px',
          borderStyle: 'solid',
          // borderTop: 'none',
          paddingTop: '10px',
          paddingRight: '18px',
          paddingLeft: '10px',
          paddingBottom: '10px',
          // borderColor: cursorColor,
          borderColor: colorToUseTCTransparent.toRgbString(),
        }}
      >
        {/* <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: cursorColor,
            opacity: '0.1',
            position: 'absolute',
            top: '0',
            left: '0',
          }}
        /> */}
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
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
              className={
                cursorColor === ColorsEnum.AUTO
                  ? 'ab-cursor-bw-element-border'
                  : ''
              }
              onClick={() => handleSetCursorType(CursorTypeEnum.DOUBLE)}
              style={{
                boxSizing: 'border-box',
                cursor: 'pointer',
                border: `2px solid ${cursorColor}`,
                // borderWidth: '2px',
                // borderStyle: 'solid',
                // borderColor: cursorColor === ColorsEnum.AUTO ? }`,
                opacity: cursorType === CursorTypeEnum.DOUBLE ? 1 : 0.3,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                className={
                  cursorColor === ColorsEnum.AUTO
                    ? 'ab-cursor-bw-element-border'
                    : ''
                }
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
              className={
                cursorColor === ColorsEnum.AUTO
                  ? 'ab-cursor-bw-element-border'
                  : ''
              }
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
              className={
                cursorColor === ColorsEnum.AUTO ? 'ab-cursor-bw-element-bg' : ''
              }
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
          {divider}
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
                className="ab-cursor-bw-element-bg"
                onClick={() => handleSetColor(ColorsEnum.AUTO)}
                style={{
                  ...swatchBaseStyle,
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  // background: ColorsEnum.AUTO,
                  opacity: cursorColor !== ColorsEnum.AUTO ? '0.3' : '1',
                }}
              />
            </div>
          </div>
          {divider}
          <PowerIcon
            cursorColor={cursorColor}
            onClick={handleToggleAppActive}
            style={{
              cursor: 'pointer',
              opacity: appActive ? '1' : '0.5',
              marginLeft: '5px',
              position: 'relative',
              top: '-2px',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Popup

type PowerIconProps = {
  cursorColor: any
  onClick: any
  style: any
}

const PowerIcon = (props: PowerIconProps) => {
  const { cursorColor, onClick, style } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      onClick={onClick}
      style={style}
      viewBox="0 0 18 18"
      className={
        cursorColor === ColorsEnum.AUTO ? 'ab-cursor-bw-element-svg' : ''
      }
    >
      <path
        fill={cursorColor}
        fillRule="evenodd"
        d="M8.97221 0.962524C9.18667 0.962524 9.39235 1.04815 9.544 1.20058C9.69565 1.353 9.78085 1.55973 9.78085 1.77529V7.46462C9.78085 7.68017 9.69565 7.8869 9.544 8.03932C9.39235 8.19175 9.18667 8.27738 8.97221 8.27738C8.75775 8.27738 8.55207 8.19175 8.40042 8.03932C8.24877 7.8869 8.16357 7.68017 8.16357 7.46462V1.77529C8.16357 1.55973 8.24877 1.353 8.40042 1.20058C8.55207 1.04815 8.75775 0.962524 8.97221 0.962524Z"
        clipRule="evenodd"
      ></path>
      <path
        fill={cursorColor}
        fillRule="evenodd"
        d="M13.5757 4.1266C13.7274 3.97423 13.933 3.88863 14.1474 3.88863C14.3619 3.88863 14.5675 3.97423 14.7191 4.1266C15.8482 5.26189 16.6174 6.70779 16.93 8.28194C17.2425 9.8561 17.0842 11.488 16.4752 12.9719C15.8662 14.4558 14.8336 15.7252 13.5077 16.62C12.1819 17.5148 10.622 17.995 9.02501 18C7.42798 18.005 5.86524 17.5345 4.53387 16.648C3.2025 15.7614 2.16212 14.4985 1.54394 13.0184C0.925757 11.5384 0.757454 9.90748 1.06025 8.33141C1.36305 6.75533 2.1234 5.30467 3.2454 4.16236C3.39617 4.00888 3.60142 3.92189 3.816 3.92052C4.03058 3.91915 4.23692 4.00351 4.38962 4.15505C4.54232 4.30658 4.62887 4.51288 4.63023 4.72856C4.6316 4.94424 4.54766 5.15163 4.3969 5.3051C3.49922 6.21896 2.89089 7.37953 2.64863 8.64045C2.40637 9.90136 2.54102 11.2061 3.03561 12.3902C3.5302 13.5743 4.36257 14.5847 5.42775 15.2939C6.49293 16.0031 7.7432 16.3794 9.02089 16.3754C10.2986 16.3713 11.5464 15.987 12.6071 15.271C13.6678 14.555 14.4938 13.5394 14.9809 12.3522C15.468 11.1649 15.5944 9.85932 15.3442 8.59997C15.094 7.34063 14.4783 6.18396 13.5749 5.27584C13.4234 5.12332 13.3384 4.91657 13.3386 4.70105C13.3387 4.48554 13.424 4.27891 13.5757 4.1266Z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
