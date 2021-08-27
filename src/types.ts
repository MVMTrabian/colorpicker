/**
 * Represents an Item displayed in a Box
 */
export type Item = {
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

/**
 * Represents an area on the layout
 */
export type Box = {
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
 * Represents an identifiable list of Items
 */
export type ItemList = {
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
export type Storage = {
  itemLists: ItemList[]
}
