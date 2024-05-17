import React, { useEffect, useState } from 'react'
import Switch from '../components/options/Switch'
import '../sharedstyles/tailwind.css'

const Options = () => {
  const [outerBorder, setOuterBorder] = useState<boolean>(false)
  const [cursorSize, setCursorSize] = useState<boolean>(false)
  const [disableLockPosition, setDisableLockPosit_ion] = useState<boolean>(false)
  const [color, setColor] = useState<string>('auto')

  useEffect(() => {
    console.log('useEffect(() => {')
    if(!chrome || !chrome.storage) return
    chrome.storage.sync.get().then(result => {
      console.log('result', result)
      setOuterBorder(result.outerBorder)
      setCursorSize(result.cursorSize)
      setDisableLockPosit_ion(result.disableLockPosition)
      setColor(result.color)
    })
  }, [])

  const handleDisableOuterBorder = () => {
    const newState = !outerBorder
    console.log('handleDisableOuterBorder:', newState)
    setOuterBorder(newState)
    if(!chrome || !chrome.storage) return
    chrome.storage.sync.set({ outerBorder: newState })
  }

  const handleCursorSizeClick = () => {
    const newState = !cursorSize
    console.log('handleCursorSizeClick:', newState)
    setCursorSize(newState)
    if(!chrome || !chrome.storage) return
    chrome.storage.sync.set({ cursorSize: newState })
  }
  
  const handleDisableLockPositionClick = () => {
    const newState = !disableLockPosition
    console.log('handleDisableLockPositionClick:', newState)
    setDisableLockPosit_ion(newState)
    if(!chrome || !chrome.storage) return
    chrome.storage.sync.set({ disableLockPosition: newState })
  }


  return (
    <div className="min-w-screen min-h-screen bg-gray-900 m-0 p-0">
      <div className="w-[400px] max-w-[90%] mx-auto pt-10 pb-10">
        <p className='text-[48px] leading-none mb-4 text-white'>Crosshair Pro</p>
        <p className='text-[12px] mb-4 text-white/50'>OPTIONS</p>
        <div className='w-full h-[1px] bg-white/50 mb-10' />
        <div className="flex items-center gap-5 mb-5">
          <Switch active={outerBorder} onClick={handleDisableOuterBorder} />
          <p className='text-sm text-white'>Disable outer border</p>
        </div>
        <div className="flex items-center gap-5 mb-5">
          <Switch active={cursorSize} onClick={handleCursorSizeClick} />
          <p className='text-sm text-white'>Larger size</p>
        </div>
        <div className="flex items-center gap-5 mb-5">
          <Switch active={disableLockPosition} onClick={handleDisableLockPositionClick} />
          <p className='text-sm text-white'>Disable locking previous position</p>
        </div>

        <div className='grid grid-cols-4 gap-8'>
          <div className='aspect-square bg-gray-800 rounded flex justify-center items-center'>
            <p className='text-sm text-white'>Auto</p>
          </div>
          <div className='aspect-square bg-gray-800 rounded flex justify-center items-center'>
            <p className='text-sm text-blue-400'>Blue</p>
          </div>
          <div className='aspect-square bg-gray-800 rounded flex justify-center items-center'>
            <p className='text-sm text-purple-400'>Purple</p>
          </div>
          <div className='aspect-square bg-gray-800 rounded flex justify-center items-center'>
            <p className='text-sm text-green-400'>Green</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Options