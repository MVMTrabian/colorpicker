import React from 'react'
import { buttonColor } from '../App'
import { Box, Item } from '../types'
import { getContrast } from '../utils'

type ListProps = {
  box?: Box
  listItems: Item[]
  buttonLabel: string
  onItemClick: (item: Item) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: Item) => void
  }[]
  //voids an item from the selected items list upon activation
}

export const List: React.FC<ListProps> = ({
  //calls outside items so they can function within this variable
  box,
  listItems,
  buttonLabel,
  onItemClick,
  additionalActions,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        gridArea: box?.gridArea,
        display: 'grid',
        gridTemplateRows: `35px repeat(${listItems.length}, 50px)`,
        gap: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        {box?.name}
      </div>
      {listItems.map((listItem) => (
        <div
          style={{
            //generates the style of the list items

            color: getContrast(listItem.color),
            textAlign: 'center',
            backgroundColor: listItem.color,
            borderRadius: 10,
            display: 'grid',
            gridTemplateColumns: '4fr 1fr',
            alignItems: 'center',
            padding: '5px 10px',
          }}
        >
          <div>{listItem.color}</div>
          {additionalActions?.map((action) => {
            return (
              <button
                style={{
                  height: '80%',
                  borderRadius: 10,
                  backgroundColor: buttonColor,
                  border: 'none',
                  color: getContrast(buttonColor),
                }}
                onClick={() => action.onItemClick(listItem)}
              >
                {action.buttonLabel}
              </button>
            )
          })}
          <button
            style={{
              height: '80%',
              borderRadius: 10,
              backgroundColor: buttonColor,
              border: 'none',
              color: getContrast(buttonColor),
            }}
            onClick={() => onItemClick(listItem)}
          >
            {buttonLabel}
          </button>
        </div>
      ))}
    </div>
  )
}
