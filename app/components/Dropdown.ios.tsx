import { Picker, Text } from "@expo/ui/swift-ui"
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers"
import { DropdownProps } from "./Dropdown"

export function Dropdown({ title, selectedValue, onValueChange, items }: DropdownProps) {
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
