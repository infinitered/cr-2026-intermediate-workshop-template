import { Picker, Text } from "@expo/ui/swift-ui"
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers"

type DropdownItem = {
  label: string
  value: string
}

type DropdownProps = {
  title: string
  items: DropdownItem[]
  selectedValue: string
  onValueChange: (value: string) => void
}

export function Dropdown({ title, items, selectedValue, onValueChange }: DropdownProps) {
  return (
    <Picker
      label={title}
      selection={selectedValue}
      onSelectionChange={(v) => onValueChange(v as string)}
      modifiers={[pickerStyle("menu")]}
    >
      <Text modifiers={[tag("")]}>Select...</Text>
      {items.map((item) => (
        <Text key={item.value} modifiers={[tag(item.value)]}>
          {item.label}
        </Text>
      ))}
    </Picker>
  )
}
