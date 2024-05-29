import React, { useEffect, useState, useRef } from 'react'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import tinycolor from 'tinycolor2'
import { defaultColor, defaultCursorType } from '../constants/defaults'
import Swatches from './components/Swatches'
import CursorTypes from './components/CursorTypes'
import '../styles/popup.css'

const Popup = () => {
  const [yPosition, setYPosition] = useState<number>(-100)
  const [appActive, setAppActive] = useState(false)
  const [initialised, setInitialised] = useState(false)
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(
    CursorTypeEnum.DOUBLE,
  )

  const wrapperRef = useRef(null)

  const handleClickOutside = (event: any) => {
    // @ts-ignore
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setYPosition(-100)
    }
  }

  const handleReInvokeCursorPopup = () => {
    console.log('const handleReInvokeCursorPopup = () => {')
    setYPosition(2)
  }

  useEffect(() => {
    if (!initialised) {
      console.log('INITIALISING')
      // @ts-ignore
      window.addEventListener(
        'reInvokeCursorPopup',
        handleReInvokeCursorPopup,
        false,
      )
      document.addEventListener('mousedown', handleClickOutside)
      setInitialised(true)
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

  const divider = (
    <div
      className="ab-cursor-divider"
      style={{ width: '1px', height: '26px' }}
    />
  )
  const colorToUseTC = tinycolor(cursorColor)
  const colorToUseTCTransparent = colorToUseTC.setAlpha(0.5)
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
          borderRadius: '10px',
          position: 'fixed',
          top: yPosition,
          transition: 'top 0.3s',
          display: 'flex',
          flexDirection: 'column',
          marginRight: '120px',
          height: '60px',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          borderWidth: '2px',
          borderStyle: 'solid',
          paddingTop: '10px',
          paddingRight: '18px',
          paddingLeft: '10px',
          paddingBottom: '10px',
          borderColor: colorToUseTCTransparent.toRgbString(),
        }}
      >
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
          <CursorTypes
            handleSetCursorType={handleSetCursorType}
            cursorColor={cursorColor}
            cursorType={cursorType}
          />
          {divider}
          <Swatches handleSetColor={handleSetColor} cursorColor={cursorColor} />
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
