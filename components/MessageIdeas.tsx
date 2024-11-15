import Colors from "@/constants/Colors";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

const PredefinedMessages = [
  { title: "解释 React Native", text: "用最简单的方式" },
  { title: "推荐一道菜", text: "适合挑食的约会对象" },
  { title: "写一个故事", text: "关于一只会编程的猫" },
  { title: "创建训练计划", text: "适合在家健身的初学者" },
  { title: "设计食谱", text: "适合繁忙工作的健康便当" },
  { title: "学习建议", text: "如何高效掌握编程技能" },
  { title: "职业规划", text: "给刚入行的程序员" },
];

type Props = {
  onSelectCard: (message: string) => void;
};

const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {PredefinedMessages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSelectCard(`${item.title} ${item.text}`)}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {item.title}
            </Text>
            <Text style={{ color: Colors.grey, fontSize: 14 }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
export default MessageIdeas;
