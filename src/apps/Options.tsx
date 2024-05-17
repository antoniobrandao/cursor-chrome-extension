import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import Switch from '../components/options/Switch'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import CloseIconLarge from '../components/CloseIconLarge'
import '../sharedstyles/tailwind.css'

const getColorName = (color: ColorsEnum) => {
  switch (color) {
    case ColorsEnum.AUTO:
      return 'Auto'
    case ColorsEnum.GREEN:
      return 'Green'
    case ColorsEnum.YELLOW:
      return 'Yellow'
    case ColorsEnum.ORANGE:
      return 'Orange'
    case ColorsEnum.RED:
      return 'Red'
    case ColorsEnum.PURPLE:
      return 'Purple'
    case ColorsEnum.BLUE:
      return 'Blue'
    case ColorsEnum.CYAN:
      return 'Cyan'
  }
}
const getModeName = (color: CursorTypeEnum) => {
  switch (color) {
    case CursorTypeEnum.DOUBLE:
      return 'Double border'
    case CursorTypeEnum.SINGLE:
      return 'Single border'
    case CursorTypeEnum.FLAT:
      return 'Flat'
  }
}

const Options = () => {
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(CursorTypeEnum.DOUBLE)

  useEffect(() => {
    if (!chrome || !chrome.storage) return
    chrome.storage.sync.get().then(result => {
      console.log('result', result)
      setCursorType(result.cursorType)
      setCursorColor(result.cursorColor)
    })
  }, [])

  const handleSetColor = (newColor: ColorsEnum) => {
    setCursorColor(newColor)
    if (!chrome || !chrome.storage) return
    chrome.storage.sync.set({ color: newColor })
  }

  const handleSetCursorType = (newCursorType: CursorTypeEnum) => {
    setCursorType(newCursorType)
    if (!chrome || !chrome.storage) return
    chrome.storage.sync.set({ cursorType: newCursorType })
  }

  const swatchBaseStyle = 'block w-[38px] h-[38px] rounded-full cursor-pointer'

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 m-0 p-0 flex flex-col">
      <div className="w-[400px] max-w-[90%] mx-auto pt-10 pb-10 flex flex-col gap-4">
        <p className="text-[48px] leading-none mb-4 text-white">Cursor Highlight</p>
        <p className="text-[12px] text-white/50">OPTIONS</p>

        <div className="w-full h-[1px] bg-white/50 mb-5" />

        <div className="w-full flex justify-between mt-2">
          <div
            onClick={() => handleSetCursorType(CursorTypeEnum.DOUBLE)}
            style={{
              cursor: 'pointer',
              border: `2px solid ${cursorColor}`,
              opacity: cursorType === CursorTypeEnum.DOUBLE ? 1 : 0.3,
            }}
            className="relative w-[70px] h-[70px] rounded-full overflow-hidden"
          >
            <div
              style={{ cursor: 'pointer', opacity: '0.5', border: `6px solid ${cursorColor}` }}
              className="w-[66px] h-[66px] rounded-full overflow-hidden absolute top-[0] left-[0]"
            ></div>
          </div>
          <div
            onClick={() => handleSetCursorType(CursorTypeEnum.SINGLE)}
            style={{
              cursor: 'pointer',
              border: `8px solid ${cursorColor}`,
              opacity: cursorType === CursorTypeEnum.SINGLE ? 1 : 0.3,
            }}
            className="w-[70px] h-[70px] rounded-full overflow-hidden"
          ></div>
          <div
            onClick={() => handleSetCursorType(CursorTypeEnum.FLAT)}
            style={{
              background: cursorColor,
              opacity: cursorType === CursorTypeEnum.FLAT ? 1 : 0.3,
            }}
            className="w-[70px] h-[70px] rounded-full overflow-hidden"
          ></div>
        </div>
        <div className="flex justify-between mt-10 mb-10">
          <div
            onClick={() => handleSetColor(ColorsEnum.GREEN)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.GREEN && 'opacity-30')}
            style={{ background: ColorsEnum.GREEN }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.YELLOW)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.YELLOW && 'opacity-30')}
            style={{ background: ColorsEnum.YELLOW }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.ORANGE)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.ORANGE && 'opacity-30')}
            style={{ background: ColorsEnum.ORANGE }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.RED)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.RED && 'opacity-30')}
            style={{ background: ColorsEnum.RED }}
          />
        </div>
        <div className="flex justify-between">
          <div
            onClick={() => handleSetColor(ColorsEnum.BLUE)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.BLUE && 'opacity-30')}
            style={{ background: ColorsEnum.BLUE }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.PURPLE)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.PURPLE && 'opacity-30')}
            style={{ background: ColorsEnum.PURPLE }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.CYAN)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.CYAN && 'opacity-30')}
            style={{ background: ColorsEnum.CYAN }}
          />
          <div
            onClick={() => handleSetColor(ColorsEnum.AUTO)}
            className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.AUTO && 'opacity-30')}
            style={{ background: ColorsEnum.AUTO }}
          />
        </div>
        <div>
          <p className="text-[12px] text-white/50 leading-none mt-5 mb-4">
            Mode: {getModeName(cursorType)}
          </p>
          <p className="text-[12px] text-white/50 leading-none mt-1 mb-0">
            Color: {getColorName(cursorColor)}
          </p>
          {cursorColor === ColorsEnum.AUTO && (
            <p className="text-[12px] text-white/30 mt-1.5">
              This color mode will use white or black depending on the color below the cursor, to
              ensure visibility.
            </p>
          )}
        </div>
      </div>
      <a
        href="https://antoniobrandao.com"
        target="_blank"
        className="w-full flex flex-col items-center justify-center mt-auto mb-10 text-white/50 hover:text-white transition-color duration-300"
      >
        <p className="text-[12px] mb-4">A CHROME EXTENSION BY ANTONIO BRANDAO</p>
        <AbIcon />
      </a>
    </div>
  )
}

export default Options

function AbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 36 36">
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M18 36c9.941 0 18-8.059 18-18S27.941 0 18 0 0 8.059 0 18s8.059 18 18 18zm-.497-25.302h-2.77l8.646 14.728 7.065-12.225h-11.36l-1.58-2.503zm-4.955 0L5.484 22.924h11.36l1.58 2.502h2.77l-8.646-14.728zm13.943 5.028l-3.112 5.198-3.076-5.198h6.188zM12.548 15.2l3.077 5.198H9.436l3.112-5.198z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
