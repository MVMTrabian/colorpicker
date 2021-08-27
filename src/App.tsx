import React from 'react'

import { BOXES, NUMBER_OF_COLORS } from './constants'
import { useLocalStorage, useSelectedItems } from './hooks'
import { getContrast, getRandomColor } from './utils'
import { Box, Item, Storage } from './types'

// newArray.fill(null) // Very Object-Oriented (imperative expression)
const initialArray = new Array(NUMBER_OF_COLORS).fill(null)

// generateing initial color arrays.
const colorArray1 = initialArray.map((_item, _itemIndex, _origialArray) => {
  return getRandomColor()
})

const colorArray2 = initialArray.map(() => {
  return getRandomColor()
})

// This assigns the color of all the buttons to a single random color.
const buttonColor = getRandomColor()

const App = () => {
  //Creates the app from previous functions and variables

  // initializes local storage for saved lists
  // Local storage is under the key 'griddemo'.
  // If local storage in 'griddemo' doesn't yet exist, create
  // it with { itemLists: []}
  const { currentStorage, updateStorage, clearStorage } = useLocalStorage<
    Storage // this is the type of the object we are keeping in storage
  >('griddemo', { itemLists: [] })

  // sets up selected items for the main color list
  const {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems,
  } = useSelectedItems([])

  // sets up selectedItems for the saved color lists
  // these are renamed so they don't conflict with the ones above
  // Will probably refactor to pull these into separate components.
  const {
    removeSelectedItem: removeSelectedList,
    setSelectedItems: setSelectedLists,
  } = useSelectedItems([], true)

  // destructures the current local storage object.
  const { itemLists: savedLists } = currentStorage

  // function for saving a new color list
  const saveColorList = (list: Item[]) => {
    updateStorage({
      itemLists: [...currentStorage.itemLists, { id: Date.now(), list }],
    })
  }

  // function for retrieving a color list from currentStorage
  const getColorList = (listId: number) => {
    return currentStorage.itemLists.find((list) => {
      return list.id === listId
    })
  }

  // function for removing a color list from local storage.
  const removeColorList = (listId: number) => {
    updateStorage({
      itemLists: currentStorage.itemLists.filter((list) => {
        return list.id !== listId
      }),
    })
  }

  // function for getting a list from local storage and setting it to the main list.
  const loadColorList = (listId: number) => {
    const list = getColorList(listId)
    if (list) {
      setSelectedLists([
        { ...list, name: listId.toString(), color: list.list[0].color },
      ])
      setSelectedItems(list.list)
    }
  }

  // sets up Item objects for each color list in local storage (for display)
  const savedListsItems: Item[] = savedLists.map((list) => {
    return {
      name: 'list ' + list.id.toString(),
      color: list.list[0].color,
      id: list.id,
    }
  })

  // function for resetting the state of the app and localstorage back to empty
  const reset = () => {
    clearStorage()
    setSelectedItems([])
    setSelectedLists([])
  }

  return (
    <Layout>
      <button onClick={reset}>Reset</button>
      <div
        style={{
          display: 'grid',
          gap: 10,
          gridTemplateColumns: '1fr 3fr 2fr',
          gridTemplateRows: '1fr 1fr 1fr',
          // gridTemplateAreas names must coincide with the
          // `gridArea` properties in the boxes array
          gridTemplateAreas: `'leftTop    right localStorage' 
                              'leftBottom right localStorage'`,
          height: '73vh',
          width: '120vh',
          backgroundColor: '#acacac',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <List
          box={BOXES[0]}
          listItems={colorArray1.map((color) => {
            return { name: 'name', color, id: Date.now() }
          })}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <List
          box={BOXES[1]}
          listItems={colorArray2.map((color) => {
            return { name: 'name', color, id: Date.now() }
          })}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <List
          box={BOXES[2]}
          listItems={selectedItems}
          onItemClick={removeSelectedItem}
          buttonLabel="remove"
        />
        <button onClick={() => saveColorList(selectedItems)}>Save</button>
        <List
          box={BOXES[3]}
          listItems={savedListsItems}
          onItemClick={(item) => loadColorList(item.id)}
          buttonLabel="Load"
          additionalActions={[
            {
              buttonLabel: 'remove',
              onItemClick: (item) => {
                removeSelectedList(item)
                removeColorList(item.id)
              },
            },
          ]}
        />
      </div>
    </Layout>
  )
}

export default App

//do not edit, if I need to edit this I'm on the wrong track
const Layout: React.FC = ({ children }) => {
  //Sets the layout container of the app
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#fff',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}

const List = ({
  //calls outside items so they can function within this variable
  box,
  listItems,
  buttonLabel,
  onItemClick,
  additionalActions,
}: {
  box?: Box
  listItems: Item[]
  buttonLabel: string
  onItemClick: (item: Item) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: Item) => void
  }[]
  //voids an item from the selected items list upon activation
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

// type Color = {
//   colorCode: string
// }

/* color codes
 Standard hex code: "#[red (00 - ff)][green][blue]" => '#[ff][ff][ff]' => "#ffffff"
 Hex alpha: "#[red (00 - ff)][green][blue][alpha]" => '#[ff][ff][ff][ff]' => "#ffffffff"
 RGB (decimal): "rgb([red (0-255)], [green], [blue])" => "rgb(255, 255, 255)"
 RGBa (decimal): "rgba([red (0-255)], [green], [blue], [alpha (0 - 1)])" => "rgba(255, 255, 255, 0)"
 HSL (decimal): "hsl([hue (0-360)], [saturation (0%-100%)], [luminance (0%-100%))])" => "hsl(0, 100%, 100%)"
 HSLa (decimal): "hsla([hue (0-360)], [saturation (0%-100%)], [luminance (0%-100%))], [alpha (0 - 1)])" => "hsla(0, 100%, 100%, 1)"
*/

// const saveToLocalStorage = () => localStorage.setItem

// const getFromLocalStorage = () => localStorage.getItem

//new thing to attempt:
//setup a feature where you can save lists of colors
//use localstorage, add a fourth grid box for a "saved colors lists" list
//creates an array of arrays, can be managed via useState call
//need to save & return lists to and from localStorage
//first 2 functions I need to write are saveToLocalStorage and getFromLocalStorage
