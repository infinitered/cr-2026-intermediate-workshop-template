import { useState } from "react"
import { Row, Text, Spacer } from "@expo/ui"
import { DatePickerDialog } from "@expo/ui/jetpack-compose"

type DatePickerProps = {
  title: string
  value: Date
  onDateChange: (date: Date) => void
  maximumDate?: Date
}

export function DatePicker({ title, value, onDateChange, maximumDate }: DatePickerProps) {
  const [showDialog, setShowDialog] = useState(false)

  const formatted = value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <>
      <Row alignment="center" onPress={() => setShowDialog(true)}>
        <Text>{title}</Text>
        <Spacer flexible />
        <Text style={{ color: "#007AFF" }}>{formatted}</Text>
      </Row>
      {showDialog && (
        <DatePickerDialog
          initialDate={value.toISOString()}
          onDateSelected={(date: Date) => {
            onDateChange(date)
            setShowDialog(false)
          }}
          onDismissRequest={() => setShowDialog(false)}
          selectableDates={maximumDate ? { end: maximumDate } : undefined}
        />
      )}
    </>
  )
}
