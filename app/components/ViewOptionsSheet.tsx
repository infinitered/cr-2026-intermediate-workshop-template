import { SORT_OPTIONS, useFilteredGamesByYear } from "@/stores/gameFeed"
import { useSettings, type SortOrder } from "@/stores/settings"
import { BottomSheet, FieldGroup, Picker, Switch } from "@expo/ui"

interface ViewOptionsSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function ViewOptionsSheet({ isOpen, onClose }: ViewOptionsSheetProps) {
  const { sortOrder, setSortOrder, hideMature, setHideMature } = useSettings()

  return (
    <BottomSheet isPresented={isOpen} onDismiss={onClose} snapPoints={["half", "full"]}>
      <FieldGroup>
        <FieldGroup.Section title="Sort By">
          <Picker
            selectedValue={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
            appearance="menu"
          >
            {SORT_OPTIONS.map((order) => (
              <Picker.Item key={order} label={order} value={order} />
            ))}
          </Picker>
        </FieldGroup.Section>
        <FieldGroup.Section title="Advanced">
          <Switch value={hideMature} onValueChange={setHideMature} label="Hide Mature Content" />
        </FieldGroup.Section>
      </FieldGroup>
    </BottomSheet>
  )
}
