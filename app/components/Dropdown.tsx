export type DropdownProps = {
  title: string
  selectedValue: string
  onValueChange: (value: string) => void
  items: { label: string; value: string }[]
}

/**
 * This could be your web implementation.
 */
export function Dropdown({ title, selectedValue, onValueChange, items }: DropdownProps) {
  return null
}
