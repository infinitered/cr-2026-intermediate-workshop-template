import { Platform } from "react-native"
import {
  Oxanium_400Regular as oxaniumRegular,
  Oxanium_500Medium as oxaniumMedium,
  Oxanium_600SemiBold as oxaniumSemiBold,
  Oxanium_700Bold as oxaniumBold,
} from "@expo-google-fonts/oxanium"

export const customFontsToLoad = {
  oxaniumRegular,
  oxaniumMedium,
  oxaniumSemiBold,
  oxaniumBold,
}

const fonts = {
  oxanium: {
    normal: "oxaniumRegular",
    medium: "oxaniumMedium",
    semiBold: "oxaniumSemiBold",
    bold: "oxaniumBold",
  },
  courier: {
    normal: "Courier",
  },
  monospace: {
    normal: "monospace",
  },
}

/** Type scale from Figma design tokens */
export const typeScale = {
  display: { fontSize: 36, lineHeight: 44, fontFamily: fonts.oxanium.normal },
  headline1: { fontSize: 28, lineHeight: 36, fontFamily: fonts.oxanium.semiBold },
  headline2: { fontSize: 24, lineHeight: 32, fontFamily: fonts.oxanium.semiBold },
  title1: { fontSize: 16, lineHeight: 24, fontFamily: fonts.oxanium.medium },
  title2: { fontSize: 14, lineHeight: 20, fontFamily: fonts.oxanium.medium },
  label1: { fontSize: 14, lineHeight: 20, fontFamily: fonts.oxanium.bold },
  label2: { fontSize: 12, lineHeight: 16, fontFamily: fonts.oxanium.bold },
  body: { fontSize: 14, lineHeight: 20, fontFamily: fonts.oxanium.normal },
} as const

export const typography = {
  fonts,
  primary: fonts.oxanium,
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
