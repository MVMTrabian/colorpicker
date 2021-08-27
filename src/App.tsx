import { BOXES, NUMBER_OF_COLORS } from './constants'
import { useLocalStorage, useSelectedItems } from './hooks'
import { getColorArray, getRandomColor } from './utils'
import { ColorItem, ColorItemList, ColorListStorage } from './types'
import { Layout, List } from './components'

import { SketchPicker } from 'react-color'
import { useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

// This assigns the color of all the buttons to a single random color.
export const buttonColor = getRandomColor()

const App = () => {
  //Creates the app from previous functions and variables

  // initializes local storage for saved lists
  // Local storage is under the key 'griddemo'.
  // If local storage in 'griddemo' doesn't yet exist, create
  // it with { itemLists: []}
  const { currentStorage, updateStorage, clearStorage } = useLocalStorage<
    ColorListStorage // this is the type of the object we are keeping in storage
  >('griddemo', { itemLists: [] })

  // sets up selected items for the main color list
  const {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems,
  } = useSelectedItems<ColorItem>([])

  // sets up selectedItems for the saved color lists
  // these are renamed so they don't conflict with the ones above
  // Will probably refactor to pull these into separate components.
  const {
    removeSelectedItem: removeSelectedList,
    setSelectedItems: setSelectedLists,
  } = useSelectedItems<ColorItemList>([], true)

  // destructures the current local storage object.
  const { itemLists: savedLists } = currentStorage ?? { itemLists: [] }

  // creates a piece of state for the color picker to update.
  const [colorPickerColor, setColorPickerColor] = useState('#acacac')

  // create a piece of state to track the generated colors
  const [generatedColors, setGeneratedColors] = useState(
    getColorArray(NUMBER_OF_COLORS),
  )

  // create a piece of state to track the generated colors
  const [rotation, setRotation] = useState(0)

  const gradientString = `linear-gradient(${rotation}deg, ${selectedItems
    .map((item) => item.color)
    .join(', ')})`

  // function for saving a new color list
  const saveColorList = (list: ColorItem[]) => {
    if (currentStorage) {
      updateStorage({
        itemLists: [
          ...currentStorage.itemLists,
          {
            id: Date.now(),
            list,
            backgroundColor: list[0].backgroundColor,
            backgroundImage: gradientString,
            name: '',
          },
        ],
      })
    }
  }

  // function for retrieving a color list from currentStorage
  const getColorList = (listId: number) => {
    if (currentStorage) {
      return currentStorage.itemLists.find((list) => {
        return list.id === listId
      })
    }
  }

  // function for removing a color list from local storage.
  const removeColorList = (listId: number) => {
    if (currentStorage) {
      updateStorage({
        itemLists: currentStorage.itemLists.filter((list) => {
          return list.id !== listId
        }),
      })
    }
  }

  // function for getting a list from local storage and setting it to the main list.
  const loadColorList = (listId: number) => {
    const list = getColorList(listId)
    if (list) {
      setSelectedLists([list])
      setSelectedItems(list.list)
    }
  }

  // sets up Item objects for each color list in local storage (for display)
  const savedListsItems: ColorItemList[] = savedLists.map((list, listIndex) => {
    return {
      name: 'list ' + (listIndex + 1).toString(),
      color: list.list[0].color,
      id: list.id,
      position: 0,
      backgroundColor: list.list[0].backgroundColor ?? '#ffffff',
      backgroundImage: list.backgroundImage,
      list: list.list,
    }
  })

  // function for resetting the state of the app and localstorage back to empty
  const reset = () => {
    clearStorage()
    setSelectedItems([])
    setSelectedLists([])
  }

  const refreshColors = () => {
    setGeneratedColors(getColorArray(NUMBER_OF_COLORS))
  }

  return (
    <Layout gradient={gradientString}>
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
        <div>
          <div>
            <SketchPicker
              color={colorPickerColor}
              onChangeComplete={(color) => {
                setColorPickerColor(color.hex)
              }}
            />
            <Slider
              value={rotation}
              onChange={(value) => setRotation(value)}
              min={0}
              max={360}
            />
          </div>
          <button
            onClick={() =>
              addSelectedItem({
                name: colorPickerColor,
                id: Date.now(),
                color: colorPickerColor,
                backgroundColor: colorPickerColor,
                position: 0,
              })
            }
          >
            Add Color
          </button>
        </div>
        <List<{}, ColorItem>
          box={BOXES[1]}
          listItems={generatedColors.map((color) => {
            return {
              name: color,
              color,
              id: Date.now(),
              backgroundColor: color,
              position: 0,
            } as ColorItem
          })}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <button onClick={refreshColors}>refresh colors</button>
        <List<{}, ColorItem>
          box={BOXES[2]}
          listItems={selectedItems}
          onItemClick={removeSelectedItem}
          buttonLabel="remove"
        />

        <button onClick={() => saveColorList(selectedItems)}>Save</button>
        <div>background-color: {gradientString};</div>
        <List<{}, ColorItemList>
          box={BOXES[3]}
          listItems={savedListsItems}
          onItemClick={(item) => loadColorList(item.id)}
          buttonLabel="Load"
          additionalActions={[
            {
              buttonLabel: 'Delete',
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
