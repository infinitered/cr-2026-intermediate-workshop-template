import { useEffect, useState } from "react"
import {
  ExposedDropdownMenuBox,
  ExposedDropdownMenu,
  DropdownMenuItem,
  TextField,
  Text,
  useNativeState,
  Row,
  Icon,
  Spacer,
} from "@expo/ui/jetpack-compose"
import { fillMaxWidth, menuAnchor, background, padding } from "@expo/ui/jetpack-compose/modifiers"
import ArrowUpward from "@expo/material-symbols/arrow_drop_up.xml"
import ArrowDownward from "@expo/material-symbols/arrow_drop_down.xml"

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

  const selectedValueNativeState = useNativeState(
    items.find((item) => item.value === selectedValue)?.label ?? "",
  )

  const displayLabel = items.find((item) => item.value === selectedValue)?.label ?? "Select..."

  useEffect(() => {
    selectedValueNativeState.set(items.find((item) => item.value === selectedValue)?.label ?? "")
  }, [selectedValue, selectedValueNativeState, items])

  return (
    <Row verticalAlignment="center" horizontalArrangement="spaceBetween" modifiers={[]}>
      <Text modifiers={[]}>State</Text>
      <Spacer modifiers={[padding(0, 0, 16, 0)]} />
      <ExposedDropdownMenuBox expanded={expanded} onExpandedChange={setExpanded} modifiers={[]}>
        <TextField
          value={selectedValueNativeState}
          key={selectedValue}
          readOnly
          modifiers={[menuAnchor()]}
        >
          <TextField.Placeholder>
            <Text>{displayLabel}</Text>
          </TextField.Placeholder>
          <TextField.TrailingIcon>
            {expanded ? <Icon source={ArrowUpward} /> : <Icon source={ArrowDownward} />}
          </TextField.TrailingIcon>
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
    </Row>
  )
}
