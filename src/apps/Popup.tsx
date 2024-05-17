import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import '../sharedstyles/tailwind.css'
import { ColorsEnum, CursorTypeEnum } from '../constants/enums'
import CloseIcon from '../components/CloseIcon'

const Popup = () => {
  const [cursorAppOpen, setCursorAppOpen] = useState(false)
  const [tabId, setTabId] = useState<number>()
  const [cursorColor, setCursorColor] = useState<ColorsEnum>(ColorsEnum.GREEN)
  const [cursorType, setCursorType] = useState<CursorTypeEnum>(CursorTypeEnum.DOUBLE)

  useEffect(() => {
    if (!chrome || !chrome.tabs) return
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('rulersAppOpen useEffect chrome.tabs.query')
      const tab = tabs[0]
      console.log('tabs', tabs)
      if (tab.id) {
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
          },
        )
      }
    })
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

  const handleClose = () => {
    sendMessageWithoutResponse('close_app')
    window.close()
  }

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

  const swatchBaseStyle = 'block w-[18px] h-[18px] rounded-full cursor-pointer'

  return (
    <div className="text-white bg-gray-900 p-4 flex flex-col gap-4 w-[192px] h-[140px]">
      <div className="w-full flex justify-between">
        <div
          onClick={() => handleSetCursorType(CursorTypeEnum.DOUBLE)}
          style={{
            cursor: 'pointer',
            border: `2px solid ${cursorColor}`,
            opacity: cursorType === CursorTypeEnum.DOUBLE ? 1 : 0.3,
          }}
          className="relative w-[38px] h-[38px] rounded-full overflow-hidden"
        >
          <div
            style={{ cursor: 'pointer', opacity: '0.5', border: `4px solid ${cursorColor}` }}
            className="w-[34px] h-[34px] rounded-full overflow-hidden absolute top-[0] left-[0]"
          ></div>
        </div>
        <div
          onClick={() => handleSetCursorType(CursorTypeEnum.SINGLE)}
          style={{
            cursor: 'pointer',
            border: `5px solid ${cursorColor}`,
            opacity: cursorType === CursorTypeEnum.SINGLE ? 1 : 0.3,
          }}
          className="w-[38px] h-[38px] rounded-full overflow-hidden"
        ></div>
        <div
          onClick={() => handleSetCursorType(CursorTypeEnum.FLAT)}
          style={{ background: cursorColor, opacity: cursorType === CursorTypeEnum.FLAT ? 1 : 0.3 }}
          className="w-[38px] h-[38px] rounded-full overflow-hidden"
        ></div>
      </div>
      <div className="grid grid-cols-5 gap-[18px]">
        <div
          onClick={() => handleSetColor(ColorsEnum.GREEN)}
          className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.GREEN && 'opacity-30')}
          style={{ background: ColorsEnum.GREEN }}
        />
        <div
          onClick={() => handleSetColor(ColorsEnum.CYAN)}
          className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.CYAN && 'opacity-30')}
          style={{ background: ColorsEnum.CYAN }}
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
      <div className="grid grid-cols-5 gap-[18px]">
        <div
          onClick={() => handleSetColor(ColorsEnum.PURPLE)}
          className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.PURPLE && 'opacity-30')}
          style={{ background: ColorsEnum.PURPLE }}
        />
        <div
          onClick={() => handleSetColor(ColorsEnum.BLUE)}
          className={clsx(swatchBaseStyle, cursorColor !== ColorsEnum.BLUE && 'opacity-30')}
          style={{ background: ColorsEnum.BLUE }}
        />
        <div
          onClick={() => handleSetColor(ColorsEnum.AUTO)}
          className={clsx(
            swatchBaseStyle,
            cursorColor !== ColorsEnum.AUTO && 'opacity-30',
            'w-auto col-span-2',
          )}
          style={{ background: ColorsEnum.AUTO }}
        />
        <div
          onClick={handleClose}
          className={clsx(swatchBaseStyle, 'relative opacity-30 hover:opacity-100')}
          style={{ border: `2px solid ${ColorsEnum.AUTO}` }}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  )
}

export default Popup


