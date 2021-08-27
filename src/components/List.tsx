import { buttonColor } from '../App'
import { Box, Item } from '../types'
import { getContrast } from '../utils'

type ListProps<CustomBoxProps, CustomItemProps> = {
  box?: Box<CustomBoxProps>
  listItems: Item<CustomItemProps>[]
  buttonLabel: string
  onItemClick: (item: Item<CustomItemProps>) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: Item<CustomItemProps>) => void
  }[]
  //voids an item from the selected items list upon activation
}

export function List<CustomBoxProps, ItemType extends Item<{}>>({
  //calls outside items so they can function within this variable
  box,
  listItems,
  buttonLabel,
  onItemClick,
  additionalActions,
}: ListProps<CustomBoxProps, ItemType>) {
  const itemConfigs = { buttonLabel, onItemClick, additionalActions }
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
        <ItemDisplay listItem={listItem} {...itemConfigs} />
      ))}
    </div>
  )
}

type ItemDisplayProps<ItemType extends Item<{}>> = {
  listItem: ItemType
  buttonLabel: string
  onItemClick: (item: ItemType) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: ItemType) => void
  }[]
}

function ItemDisplay<ItemType extends Item<{}>>({
  listItem,
  buttonLabel,
  onItemClick,
  additionalActions,
}: ItemDisplayProps<ItemType>): JSX.Element {
  return (
    <div
      style={{
        //generates the style of the list items
        color: getContrast(listItem.backgroundColor),
        textAlign: 'center',
        backgroundColor: listItem.backgroundColor,
        ...(listItem.backgroundImage
          ? { backgroundImage: listItem.backgroundImage }
          : undefined),
        borderRadius: 10,
        display: 'grid',
        gridTemplateColumns: '4fr 1fr',
        alignItems: 'center',
        padding: '5px 10px',
      }}
    >
      <div>{listItem.name}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {additionalActions?.map((action) => {
          return (
            <button
              style={{
                display: 'flex',
                justifyContent: 'center',
                flex: 1,
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
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
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
    </div>
  )
}
