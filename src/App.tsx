import React, { useEffect, useState } from 'react'

type Box = { name: string; gridArea: string }

type Item = { id: number, name: string; color: string }

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

const getContrast = (hexcolor: string) => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  // Convert the hex code to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)

  // Get YIQ ratio
  const yiqRatio = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast.
  // YIQ at or above 128 is bright, and contrasts with black
  // YIQ below 128 is dark, and contrasts with white
  return yiqRatio >= 128 ? 'black' : 'white'
}

const buttonColor = getRandomColor()

const useSelectedItems = (initialSelectedItems: Item[] = [{name: "white", color: "#FFFFFF", id: 0}], singleSelect?: boolean) => {
  //creates a constant variable for selected items
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    initialSelectedItems,
  )

  //creates a variable that stores the selected colors
  const selectedColors = selectedItems.map((i) => i.color)

  //adds the selected item to the rightmost box?
  const addSelectedItem = (item: Item) => {
    // Check if the item already exists in the selectedColors array.
    if (selectedColors.includes(item.color)) return
    setSelectedItems(singleSelect ? [item] : [...selectedItems, item])
  }

  //removes a selected item from the rightmost gridb square
  const removeSelectedItem = (item: Item) => {
    const newItems = selectedItems.filter((selectedItem) => {
      return selectedItem.color !== item.color
    })

    setSelectedItems(singleSelect ? [] : newItems)
  }

  //returns selected items to the app at large
  return { selectedItems, addSelectedItem, removeSelectedItem, setSelectedItems }
}

type Storage = {
  colorLists: {id: number, list: Item[]}[];
}

const useLocalStorage = () => {
  const rawLocalString = window.localStorage.getItem('griddemo')

  const [currentStorage, setCurrentStorage] = useState<Storage>(rawLocalString ? JSON.parse(rawLocalString): {colorLists: []})

  const updateStorage = (newValue: Storage) => {
    window.localStorage.setItem('griddemo', newValue ? JSON.stringify(newValue) : "");
  }
  
  const clearStorage = () => {
    window.localStorage.removeItem('griddemo');
  }
  
  useEffect(() => {
    if(!currentStorage) {
      const initialStorage = {colorLists: []}

      window.localStorage.setItem('griddemo', JSON.stringify(initialStorage))

      setCurrentStorage(initialStorage)
    }
  }, [])

  return {currentStorage, updateStorage, clearStorage}
}

const boxes: Box[] = [
  //constitutes the variable for the grid
  { name: 'Color List 1', gridArea: 'leftTop' },
  { name: 'Color List 2', gridArea: 'leftBottom' },
  { name: 'Selected Colors', gridArea: 'right' },
  { name: 'Saved Lists', gridArea: 'localStorage'},
]

const App = () => {
  //Creates the app from previous functions and variables
  const { currentStorage, updateStorage, clearStorage } = useLocalStorage();

  const {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems
  } = useSelectedItems([])
  
  const {
    selectedItems: selectedLists,
    removeSelectedItem: removeSelectedList,
    setSelectedItems: setSelectedLists
  } = useSelectedItems([], true)

  const {colorLists: savedLists} = currentStorage

  const saveColorList = (list: Item[]) => {
    console.log({list})
    updateStorage({colorLists: [...currentStorage.colorLists, {id: Date.now(), list}]})
  }

  const getColorList = (listId: number) => {
    return currentStorage.colorLists.find((list) => {
      return list.id === listId
    })
  }

  const removeColorList = (listId: number) => {
    updateStorage({colorLists: currentStorage.colorLists.filter((list) => {
      return list.id !== listId
    })})
  }

  const loadColorList = (listId: number) => {
    const list = getColorList(listId)
    if (list) {
      setSelectedLists([{...list, name: listId.toString(), color: list.list[0].color}])
      setSelectedItems(list.list)
    }
  }

  const savedListsItems: Item[] = savedLists.map((list) => {
    return {
      name: "list " + list.id.toString(), 
      color: list.list[0].color, 
      id: list.id}
  })

  const reset = () => {
    clearStorage()
    setSelectedItems([])
    setSelectedLists([])
  }
  

  console.log({colorArray1, colorArray2, selectedItems, savedLists, selectedLists})

  return (
    <Layout>
      <button onClick={reset}>Reset</button>
      <div
        style={{
          display: 'grid',
          gap: 10,
          gridTemplateColumns: '1fr 3fr 2fr',
          gridTemplateRows: '1fr 1fr 1fr',
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
          listItems={colorArray1.map((color) => {return({name: "name", color, id: Date.now()})})}
          onItemClick={addSelectedItem}
          buttonLabel="add"
        />
        <List
          box={boxes[1]}
          listItems={colorArray2.map((color) => {return({name: "name", color, id: Date.now()})})}
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
          onItemClick={(item)=> loadColorList(item.id)}
          buttonLabel="Load"
          additionalActions={[
            {
              buttonLabel: "remove", 
              onItemClick: (item) => {
                removeSelectedList(item)
                removeColorList(item.id)
              }
            }
          ]}
        />
      </div>
    </Layout>
  )
}

export default App

//do not edit, if I need to edit this I'm on the wrong track
const Layout: React.FC = ({ children }) => {
  //Sets the layout of the app
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
  additionalActions
}: {
  box?: Box
  listItems: Item[]
  buttonLabel: string
  onItemClick: (item: Item) => void
  additionalActions?: {buttonLabel: string, onItemClick: (item: Item) => void}[]
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

const NUMBER_OF_COLORS = 4
const BIG_NUMBER_OF_COLORS = 8

const emptyArray = new Array(NUMBER_OF_COLORS)

console.log({emptyArray})

const templateArray = emptyArray.fill(null)

console.log({templateArray, emptyArray})

// newArray.fill(null) // Very Object-Oriented (imperative expression)

const colorArray1 = templateArray.map((_item, _itemIndex, _origialArray) => {
  return( getRandomColor() )
})

const colorArray2 = templateArray.map(getRandomColor)

const testString = '#127001'
const testArray = emptyArray.fill(testString)

type Color = {
  colorCode: string
}

/* color codes
 Standard hex code: "#[red (00 - ff)][green][blue]" => '#[ff][ff][ff]' => "#ffffff"
 Hex alpha: "#[red (00 - ff)][green][blue][alpha]" => '#[ff][ff][ff][ff]' => "#ffffffff"
 RGB (decimal): "rgb([red (0-255)], [green], [blue])" => "rgb(255, 255, 255)"
 RGBa (decimal): "rgba([red (0-255)], [green], [blue], [alpha (0 - 1)])" => "rgba(255, 255, 255, 0)"
 HSL (decimal): "hsl([hue (0-360)], [saturation (0%-100%)], [luminance (0%-100%))])" => "hsl(0, 100%, 100%)"
 HSLa (decimal): "hsla([hue (0-360)], [saturation (0%-100%)], [luminance (0%-100%))], [alpha (0 - 1)])" => "hsla(0, 100%, 100%, 1)"
*/

const saveToLocalStorage = () => localStorage.setItem

const getFromLocalStorage = () => localStorage.getItem

//new thing to attempt:
//setup a feature where you can save lists of colors
//use localstorage, add a fourth grid box for a "saved colors lists" list
//creates an array of arrays, can be managed via useState call
//need to save & return lists to and from localStorage
//first 2 functions I need to write are saveToLocalStorage and getFromLocalStorage
