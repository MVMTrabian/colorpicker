import React, { useEffect, useState } from 'react'

/**
 * Represents an area on the layout
 */
type Box = {
  /**
   * Label displayed in the area
   */
  name: string
  /**
   * for use with gridTemplateArea
   */
  gridArea: string
}

/**
 * Represents an Item displayed in a Box
 */
type Item = {
  /**
   * unique identifier for this item on the page.
   */
  id: number
  /**
   * Acts as a label
   */
  name: string
  /**
   * The color of the item as hexcode
   */
  color: string
}

const NUMBER_OF_COLORS = 4

// newArray.fill(null) // Very Object-Oriented (imperative expression)
const initialArray = new Array(NUMBER_OF_COLORS).fill(null)

// console.log({ emptyArray: initialArray })

console.log({ emptyArray: initialArray })

const colorArray1 = initialArray.map((_item, _itemIndex, _origialArray) => {
  return getRandomColor()
})

const colorArray2 = initialArray.map(() => {
  return getRandomColor()
})

// const testString = '#127001'
// const testArray = initialArray.fill(testString)

/**
 * Gets a random color code.
 * @returns a random hexdecimal color code
 * ------------------------------------------
 * Generates a number between 0 and 1, multiplies it by 16,
 * rounds it to the nearest whole number,
 * and picks a number or letter based on that until a hex code is formed.
 */
export const getRandomColor = () => {
  // list all hex characters in a string
  const letters = '0123456789ABCDEF'

  // Set up a string with the leading '#'
  let color: string = '#'

  // Assign the letters one-by-one until all 6 are assigned
  for (let i = 0; i < 6; i++) {
    // Get 6 randomly-selected character from the letters string
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color
}

/**
 * Gets a contratsing text color for a color code.
 * @param hexcolor The background color.
 * @returns contrasting text color "black" | "white"
 */
const getContrast = (hexcolor: string): 'black' | 'white' => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character (e.g. #000 => #000000)
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  /*
   * Convert the hex code to RGB values
   * Parses the r, g, and b parts of the
   * hexcode into integer values,
   * each between 0 - 255
   */
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)

  // The YIQ equation converts the RGB color (0 to 255)
  // into a YIQ color space. YIQ is the standard formula
  // for calculating the perceived brightness of a color,
  // and is recommended by the World Wide Web Consortium(W3C).
  const yiqRatio = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast.
  // YIQ at or above 128 is bright, and contrasts with black
  // YIQ below 128 is dark, and contrasts with white
  return yiqRatio >= 128 ? 'black' : 'white'
}

// This assigns the color of all the buttons to a single random color.
const buttonColor = getRandomColor()

/**
 * A Custom hook used to manage a set of selected Item objects.
 * @param initialSelectedItems Item[];
 * @param singleSelect boolean; When `true` only a single item may
 * be selected at a time
 * @returns selected Items array and functions for updating it.
 */
const useSelectedItems = (
  initialSelectedItems: Item[] = [{ name: 'white', color: '#FFFFFF', id: 0 }],
  singleSelect?: boolean,
) => {
  //creates a constant variable for selected items
  // useState(initialState) is a react hook that will keep track of state for us
  // It returns an array containing the state data in the first position,
  // and a function in the second position for updating that state data.
  // this is usually written in this form:
  // const [state, setState] = useState<StateType>(initialState);
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    initialSelectedItems,
  )

  //creates a variable that stores the selected colors
  // .map() is a powerful function, and is a method of all Arrays in JS/TS
  // like .filter(), .map() accepts a function (callback) to be called
  // on each element in the mapped array. The returned array is the result of calling
  // the callback function on every member of the array.
  const selectedColors = selectedItems.map((item) => item.color)

  /**
   * Adds an Item to the selectedItemsArray.
   * Will not add an Item with the same color as another selected Item.
   * @param item Item The Item to be added to the selectedItems
   * @returns void
   */
  const addSelectedItem = (item: Item) => {
    // Check if the item already exists in the selectedColors array.
    // if so, stop running this function and return undefined.
    if (selectedColors.includes(item.color)) return

    // Replaces (updates) the selected items.
    // if `singleSelect` is true, the new selectedItems array will
    // contain only the item to be added.  If false, the new selectedItems array
    // will contain all previously selectedItems, and the item to be added.
    setSelectedItems(singleSelect ? [item] : [...selectedItems, item])
  }

  /**
   * Removes an Item from the selectedItemsArray.
   * @param item Item The Item to be added to the selectedItems
   * @returns void
   */
  const removeSelectedItem = (item: Item) => {
    if (singleSelect) {
      // If singleSelect is true, set the selected items to an empty array.
      setSelectedItems([])
    } else {
      // otherwise, remove the item from the selectedItems array
      const newItems = selectedItems.filter((selectedItem) => {
        return selectedItem.color !== item.color
      })

      // Then, update (replace) the selectedItems.
      setSelectedItems(newItems)
    }
  }

  //returns selected items to the app at large
  return {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems,
  }
}

/**
 * Represents an identifiable list of Items
 */
type ItemList = {
  /**
   * Unique identifier on the page.
   */
  id: number
  /**
   * The Items in this tracked list.
   */
  list: Item[]
}

/**
 * Describes the local storage object
 */
type Storage = {
  itemLists: ItemList[]
}

/**
 * A custom hook for managing local storage
 * @returns The object currently stored in local storage and functions for updating it
 */
function useLocalStorage<StorageType extends {}>(
  storageKey: string,
  initialStorage?: StorageType,
) {
  // This is the string that represents the entry (if present) in local storage
  // with the key provided in the parameters. If it's not there, returns null.
  const rawLocalString = window.localStorage.getItem(storageKey)

  // See comment about useState() above in useSelectedItems()
  const [currentStorage, setCurrentStorage] = useState<StorageType>(
    // if the local storage string is not null or empty
    // Parse it into an object, if not use an empty object.
    rawLocalString ? JSON.parse(rawLocalString) : {},
  )

  /**
   * A function used to update local storage
   * @param newValue
   * @returns void
   */
  const updateStorage = (newValue: StorageType) => {
    window.localStorage.setItem(
      storageKey,
      newValue ? JSON.stringify(newValue) : '',
    )
  }

  /**
   * A function used to clear the page's data from local storage.
   */
  const clearStorage = () => {
    window.localStorage.removeItem(storageKey)
  }

  // This effect initializes local storage, if it does not already exist
  // to either the provided initialStorage or an empty object.
  useEffect(() => {
    if (!currentStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(initialStorage))

      setCurrentStorage(initialStorage ?? ({} as StorageType))
    }
  }, [])

  return {
    currentStorage, // The current state of local storage as a JSON object
    updateStorage, // Function for replacing (updating) the contents of local storage
    clearStorage, // Function fro removing the app's data from local storage.
  }
}

// The areas on the layout
const boxes: Box[] = [
  //constitutes the variable for the grid
  { name: 'Color List 1', gridArea: 'leftTop' },
  { name: 'Color List 2', gridArea: 'leftBottom' },
  { name: 'Selected Colors', gridArea: 'right' },
  { name: 'Saved Lists', gridArea: 'localStorage' },
]

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
    selectedItems: selectedLists,
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

  console.log({
    colorArray1,
    colorArray2,
    selectedItems,
    savedLists,
    selectedLists,
  })

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
          box={boxes[0]}
          listItems={colorArray1.map((color) => {
            return { name: 'name', color, id: Date.now() }
          })}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <List
          box={boxes[1]}
          listItems={colorArray2.map((color) => {
            return { name: 'name', color, id: Date.now() }
          })}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <List
          box={boxes[2]}
          listItems={selectedItems}
          onItemClick={removeSelectedItem}
          buttonLabel="remove"
        />
        <button onClick={() => saveColorList(selectedItems)}>Save</button>
        <List
          box={boxes[3]}
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
