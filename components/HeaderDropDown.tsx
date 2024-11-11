import { Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as DropdownMenu from "zeego/dropdown-menu";
export type HeaderDropDownProps = {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: Array<{ key: string; title: string; icon: string }>;
};
export default function HeaderDropDown({
  title,
  selected,
  onSelect,
  items,
}: HeaderDropDownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>{title}</Text>
          <Text style={{ fontSize: 16, color: Colors.grey }}>&gt;</Text>
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        align="start"
        sideOffset={8}
        loop={false}
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={8}
      >
        {items?.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
