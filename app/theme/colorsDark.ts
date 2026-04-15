const palette = {
  // Gray
  gray50: "#F2F2F2",
  gray100: "#E6E6E6",
  gray200: "#CCCCCC",
  gray300: "#B3B3B3",
  gray400: "#999999",
  gray500: "#808080",
  gray600: "#666666",
  gray700: "#4D4D4D",
  gray800: "#333333",
  gray900: "#1A1A1A",

  // Lemon
  lemon50: "#F4F4F0",
  lemon100: "#EBEDDE",
  lemon200: "#E1EAAE",
  lemon300: "#DFF075",
  lemon400: "#DEFA38",
  lemon500: "#DBFF00",
  lemon600: "#ABC705",
  lemon700: "#798A0F",
  lemon800: "#485115",
  lemon900: "#1F2112",

  // Purple
  purple50: "#F4F0F4",
  purple100: "#EDDEEC",
  purple200: "#E7B1E6",
  purple300: "#EA7BE8",
  purple400: "#F042ED",
  purple500: "#F20DEE",
  purple600: "#BD0FBA",
  purple700: "#841582",
  purple800: "#4E184D",
  purple900: "#211220",

  // Purple Muted
  purpleMuted50: "#F3F2F3",
  purpleMuted100: "#E7E4E7",
  purpleMuted200: "#D3C5D3",
  purpleMuted300: "#C0A5C0",
  purpleMuted400: "#AE84AE",
  purpleMuted500: "#9B649B",
  purpleMuted600: "#7B517B",
  purpleMuted700: "#5A3F5A",
  purpleMuted800: "#3A2C3A",
  purpleMuted900: "#1B181B",

  // Red
  red50: "#F4F0F1",
  red100: "#ECDFDF",
  red200: "#E7B1B3",
  red300: "#E97C7F",
  red400: "#EF4348",
  red500: "#F10E16",
  red600: "#BC1015",
  red700: "#831619",
  red800: "#4E181A",
  red900: "#201313",

  overlay20: "rgba(27, 24, 27, 0.2)",
  overlay50: "rgba(27, 24, 27, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.lemon500,
  textDim: palette.purpleMuted400,
  background: palette.purpleMuted900,
  border: palette.purpleMuted700,
  tint: palette.lemon500,
  tintInactive: palette.purpleMuted700,
  separator: palette.purpleMuted800,
  error: palette.red500,
  errorBackground: palette.red900,
} as const
