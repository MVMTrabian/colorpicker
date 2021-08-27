export type BaseItemProps = {
  /**
   * unique identifier for this item on the page.
   */
  id: number
  /**
   * Acts as a label
   */
  name: string
  /**
   * Background Color of the item
   */
  backgroundColor: string
  /**
   * BackgroundImage of the item (gradient)
   */
  backgroundImage?: string
}
/**
 * Represents an Item displayed in a Box
 */
export type Item<CustomItemProps extends {}> = CustomItemProps & BaseItemProps

export type ColorItemProps = {
  /**
   * The color of the item as hexcode
   */
  color: string
  /**
   * The gradient position of the color item
   */
  position: number
}

export type ColorItem = Item<ColorItemProps>

/**
 * Represents an area on the layout
 */
export type Box<CustomBoxProps> = CustomBoxProps & {
  /**
   * Label displayed in the area
   */
  name: string
  /**
   * for use with gridTemplateArea
   */
  gridArea: string
}

export type Boxes<BoxType extends Box<{}>> = { [index: string]: Box<BoxType> }

/**
 * Represents an identifiable list of Items
 */
export type ItemList<
  CustomListProps,
  ListItemType extends Item<{}>
> = CustomListProps & {
  /**
   * Unique identifier on the page.
   */
  id: number
  /**
   * The Items in this tracked list.
   */
  list: ListItemType[]
  name: string
  backgroundColor: string
  backgroundImage?: string
}

export type ColorItemList = ItemList<{}, ColorItem>

/**
 * Describes the local storage object
 */
export type Storage<CustomListProps, ItemType extends Item<{}>> = {
  [index: string]: ItemList<CustomListProps, ItemType>[]
}

export type ColorListStorage = Storage<{}, ColorItem>
