import React from 'react'
import { ColorsEnum } from '../../constants/enums'

const swatchBaseStyle = {
  display: 'block',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  cusror: 'pointer',
}
type Props = {
  handleSetColor: any
  cursorColor: ColorsEnum
}

const Swatches = (props: Props) => {
  const { handleSetColor, cursorColor } = props

  return (
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
          onPointerDown={() => handleSetColor(ColorsEnum.GREEN)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            background: ColorsEnum.GREEN,
            opacity: cursorColor !== ColorsEnum.GREEN ? '0.3' : '1',
          }}
        />
        <div
          onPointerDown={() => handleSetColor(ColorsEnum.YELLOW)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            background: ColorsEnum.YELLOW,
            opacity: cursorColor !== ColorsEnum.YELLOW ? '0.3' : '1',
          }}
        />
        <div
          onPointerDown={() => handleSetColor(ColorsEnum.ORANGE)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            background: ColorsEnum.ORANGE,
            opacity: cursorColor !== ColorsEnum.ORANGE ? '0.3' : '1',
          }}
        />
        <div
          onPointerDown={() => handleSetColor(ColorsEnum.RED)}
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
          onPointerDown={() => handleSetColor(ColorsEnum.PURPLE)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            background: ColorsEnum.PURPLE,
            opacity: cursorColor !== ColorsEnum.PURPLE ? '0.3' : '1',
          }}
        />
        <div
          onPointerDown={() => handleSetColor(ColorsEnum.BLUE)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            background: ColorsEnum.BLUE,
            opacity: cursorColor !== ColorsEnum.BLUE ? '0.3' : '1',
          }}
        />
        <div
          onPointerDown={() => handleSetColor(ColorsEnum.CYAN)}
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
          onPointerDown={() => handleSetColor(ColorsEnum.AUTO)}
          style={{
            ...swatchBaseStyle,
            boxSizing: 'border-box',
            cursor: 'pointer',
            opacity: cursorColor !== ColorsEnum.AUTO ? '0.3' : '1',
          }}
        />
      </div>
    </div>
  )
}

export default Swatches
