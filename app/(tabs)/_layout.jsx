import React from 'react';
import {Image, Text, View} from "react-native";
import {Tabs} from "expo-router";
import {icons} from "../../constants";


const TabIcon = ({icon, name, color, focused}) => {
    return (
        <View className="justify-center items-center gap-1.5">
            <Image source={icon} className="w-5 h-5" resizeMode="contain" tintColor={color}/>
            <Text
                className={`text-xs capitalize ${focused ? "font-psemibold" : "font-pregular"}`}
                style={{color}}
            >
                {name}
            </Text>
        </View>
    )
}
const TabsLayout = () => {

    return (
        <>
            <Tabs
                screenOptions={({route}) => ({

                    headerShown: false,
                    tabBarActiveTintColor: "#FFA001",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 55,
                    },
                    tabBarIcon: ({color, focused}) => {
                        return (
                            <TabIcon
                                name={route.name}
                                icon={icons[route.name]}
                                color={color}
                                focused={focused}
                            />
                        )
                    }
                })}
            >
                <Tabs.Screen name="home" options={{
                    title: "Home",
                }}/>
            </Tabs>
        </>
    );
};

export default TabsLayout;