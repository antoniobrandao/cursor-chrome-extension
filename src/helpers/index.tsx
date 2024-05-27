import { ColorsEnum, CursorTypeEnum } from '../constants/enums'

export const getColorName = (color: ColorsEnum) => {
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
  export const getModeName = (color: CursorTypeEnum) => {
    switch (color) {
      case CursorTypeEnum.DOUBLE:
        return 'Double border'
      case CursorTypeEnum.SINGLE:
        return 'Single border'
      case CursorTypeEnum.FLAT:
        return 'Flat'
    }
  }