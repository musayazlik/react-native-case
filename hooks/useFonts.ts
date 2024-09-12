import * as Font from "expo-font";

let useFonts = async () =>
  await Font.loadAsync({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });

export default useFonts;
