import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";

const TabItem = ({ isFocused, onPress, iconName, label, family }: any) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 100,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 64,
          backgroundColor: isFocused ? "#cbf4f9" : "transparent",
        }}
      >
        {family === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons
            name={isFocused ? iconName : `${iconName}-outline`}
            size={22}
            color={isFocused ? "#00535b" : "#6f797a"}
            style={{
              fontSize: 22,
              width: 22,
              height: 22,
              textAlign: "center",
              marginBottom: 2,
            }}
          />
        ) : (
          <Ionicons
            name={isFocused ? iconName : `${iconName}-outline`}
            size={22}
            color={isFocused ? "#00535b" : "#6f797a"}
            style={{
              fontSize: 22,
              width: 22,
              height: 22,
              textAlign: "center",
              marginBottom: 2,
            }}
          />
        )}
        <Text
          style={{
            fontSize: 11,
            fontWeight: isFocused ? "bold" : "500",
            color: isFocused ? "#00535b" : "#6f797a",
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: insets.bottom > 0 ? insets.bottom : 24,
        left: 24,
        right: 24,
        backgroundColor: "#ffffff",
        borderRadius: 50,
        height: 72,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        zIndex: 10,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.07)",
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: any = "home";
        let label = "Home";
        let family = "Ionicons";
        if (route.name === "pools") {
          iconName = "piggy-bank";
          label = "Pools";
          family = "MaterialCommunityIcons";
        }
        if (route.name === "history") {
          iconName = "receipt";
          label = "History";
        }
        if (route.name === "wallet") {
          iconName = "wallet";
          label = "Wallet";
        }

        return (
          <TabItem
            key={route.name}
            isFocused={isFocused}
            onPress={onPress}
            iconName={iconName}
            label={label}
            family={family}
          />
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="pools" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="wallet" />
    </Tabs>
  );
}
