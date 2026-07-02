import { DatePicker as SwiftUIDatePicker } from "@expo/ui/swift-ui"
import { datePickerStyle } from "@expo/ui/swift-ui/modifiers"
import { DatePickerProps } from "./DatePicker"

export function DatePicker({ title, value, onDateChange, maximumDate }: DatePickerProps) {
  return (
    <SwiftUIDatePicker
      title={title}
      selection={value}
      onDateChange={onDateChange}
      displayedComponents={["date"]}
      range={maximumDate ? { end: maximumDate } : undefined}
      modifiers={[datePickerStyle("compact")]}
    />
  )
}
