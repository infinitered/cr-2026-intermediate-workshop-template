import { useState } from "react"
import {
  ExposedDropdownMenuBox,
  ExposedDropdownMenu,
  DropdownMenuItem,
  TextField,
  Text,
} from "@expo/ui/jetpack-compose"
import { fillMaxWidth, menuAnchor } from "@expo/ui/jetpack-compose/modifiers"

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
  const [expanded, setExpanded] = useState(false)

  const displayLabel = items.find((item) => item.value === selectedValue)?.label ?? "Select..."

  return (
    <ExposedDropdownMenuBox
      expanded={expanded}
      onExpandedChange={setExpanded}
      modifiers={[fillMaxWidth()]}
    >
      <TextField key={selectedValue} readOnly modifiers={[menuAnchor(), fillMaxWidth()]}>
        <TextField.Label>
          <Text>{title}</Text>
        </TextField.Label>
        <TextField.Placeholder>
          <Text>{displayLabel}</Text>
        </TextField.Placeholder>
      </TextField>
      <ExposedDropdownMenu expanded={expanded} onDismissRequest={() => setExpanded(false)}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => {
              onValueChange(item.value)
              setExpanded(false)
            }}
          >
            <DropdownMenuItem.Text>
              <Text>{item.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  )
}
