import { Row, Text, Spacer } from "@expo/ui"
import { DatePickerDialog } from "@expo/ui/jetpack-compose"
import { useState } from "react"
import { DatePickerProps } from "./DatePicker"

export function DatePicker({ title, value, onDateChange, maximumDate }: DatePickerProps) {
  const [showDialog, setShowDialog] = useState(false)

  const formatted = value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  return (
    <>
      {showDialog && (
        <DatePickerDialog
          initialDate={value.toISOString()}
          onDateSelected={(date: Date) => {
            onDateChange(date)
            setShowDialog(false)
          }}
          selectableDates={maximumDate ? { end: maximumDate } : undefined}
          onDismissRequest={() => setShowDialog(false)}
        />
      )}
      <Row alignment="center" onPress={() => setShowDialog(true)}>
        <Text>{title}</Text>
        <Spacer flexible />
        <Text>{formatted}</Text>
      </Row>
    </>
  )
}
