import { View } from "react-native";

const CircleBorder = ({ size, borderWidth, borderColor, children }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 0.5 * size,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderColor,
      borderWidth,
    }}
  >
    {children}
  </View>
);

export default CircleBorder;
