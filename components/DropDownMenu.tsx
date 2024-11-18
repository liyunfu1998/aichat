import { Ionicons } from "@expo/vector-icons";
import * as DropdownMenu from "zeego/dropdown-menu";

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
};

const DropDownMenuComp = ({ items, onSelect }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-horizontal" size={24} color={"#fff"} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop
        side="bottom"
        align="end"
        alignOffset={10}
        avoidCollisions
        collisionPadding={10}
        sideOffset={10}
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
};

export default DropDownMenuComp;
