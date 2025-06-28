import React from 'react'
import { ColorsEnum, CursorTypeEnum } from '../../constants/enums'

type Props = {
  handleSetCursorType: any
  cursorColor: ColorsEnum
  cursorType: CursorTypeEnum
}

const CursorTypes = (props: Props) => {
  const { handleSetCursorType, cursorColor, cursorType } = props
  return (
    <div
      className='!border-2 !border-red-500'
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        gap: '8px',
        justifyContent: 'space-between',
      }}
    >
      <div
        className={
          cursorColor === ColorsEnum.AUTO ? 'ab-cursor-bw-element-border' : ''
        }
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
          className={
            cursorColor === ColorsEnum.AUTO ? 'ab-cursor-bw-element-border' : ''
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
          cursorColor === ColorsEnum.AUTO ? 'ab-cursor-bw-element-border' : ''
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
  )
}

export default CursorTypes