import {useState} from "react"
import {Alert, Image, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {images} from "../../constants";
import {Link, router} from "expo-router";
import {CustomButton, FormField} from "../../components";
import {getCurrentUser, signIn} from "../../lib/appwrite";
import {useGlobalContext} from "../../context/GlobalProvider";


const SignIn = () => {
    const {setUser, setIsLogged} = useGlobalContext()
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }
        setSubmitting(true);
        try {
            await signIn(form.email, form.password)
            const user = await getCurrentUser()
            setUser(user)
            setIsLogged(true)
            router.push("/home")
        } catch (e) {

        } finally {
            setSubmitting(false)
        }
    }


    return (
        <SafeAreaView className="h-full bg-primary">
            <ScrollView>
                <View className="w-full min-h-[100vh] justify-center items-center px-4 py-6">
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-28 h-7"
                    />

                    <Text className="text-2xl font-semibold text-white mt-8 font-psemibold">
                        Log in to Aora
                    </Text>


                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({...form, email: e})}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7 w-full"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;