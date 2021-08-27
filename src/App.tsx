import { BOXES, NUMBER_OF_COLORS } from './constants'
import { useLocalStorage, useSelectedItems } from './hooks'
import { getColorArray, getRandomColor } from './utils'
import { Item, Storage } from './types'
import { Layout, List } from './components'

// This assigns the color of all the buttons to a single random color.
export const buttonColor = getRandomColor()

const colorArray1 = getColorArray(NUMBER_OF_COLORS)

const colorArray2 = getColorArray(NUMBER_OF_COLORS)

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
  const { itemLists: savedLists } = currentStorage ?? { itemLists: [] }

  // function for saving a new color list
  const saveColorList = (list: Item[]) => {
    if (currentStorage) {
      updateStorage({
        itemLists: [...currentStorage.itemLists, { id: Date.now(), list }],
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
