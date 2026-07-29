import { SORT_OPTIONS, useFilteredGamesByYear } from "@/stores/gameFeed"
import { useSettings, type SortOrder } from "@/stores/settings"
import { BottomSheet, FieldGroup, Picker, Switch } from "@expo/ui"
import { Dropdown } from "./Dropdown"

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
          <Dropdown
            title="Sort By"
            selectedValue={sortOrder}
            onValueChange={(v) => setSortOrder(v as SortOrder)}
            items={SORT_OPTIONS.map((order) => ({ label: order, value: order }))}
          />
        </FieldGroup.Section>
        <FieldGroup.Section title="Advanced">
          <Switch value={hideMature} onValueChange={setHideMature} label="Hide Mature Content" />
        </FieldGroup.Section>
      </FieldGroup>
    </BottomSheet>
  )
}
