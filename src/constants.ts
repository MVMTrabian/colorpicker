import { Box } from './types'

export const NUMBER_OF_COLORS = 4

// The areas on the layout
export const BOXES: Box<{}>[] = [
  //constitutes the variable for the grid
  { name: '', gridArea: 'leftTop' },
  { name: 'Random Colors', gridArea: 'leftBottom' },
  { name: 'Selected Colors', gridArea: 'right' },
  { name: 'Saved Lists', gridArea: 'localStorage' },
]
