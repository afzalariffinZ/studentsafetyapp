/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Brand Colors
export const BrandColors = {
  blue: '#327da8',
  yellow: '#fef3c7',
  lightBlue: '#bad1de',
  green: '#05df72',
  red: '#ffe2e2',
  lightGreen: '#dcfce7',
  lightYellow: '#fef9c2',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
};

const tintColorLight = BrandColors.blue;
const tintColorDark = BrandColors.white;

export const Colors = {
  light: {
    text: '#11181C',
    background: BrandColors.white,
    tint: tintColorLight,
    icon: BrandColors.gray,
    tabIconDefault: BrandColors.gray,
    tabIconSelected: tintColorLight,
    primary: BrandColors.blue,
    secondary: BrandColors.lightBlue,
    accent: BrandColors.green,
    warning: BrandColors.yellow,
    danger: BrandColors.red,
    surface: BrandColors.lightGray,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: BrandColors.lightBlue,
    secondary: BrandColors.blue,
    accent: BrandColors.lightGreen,
    warning: BrandColors.lightYellow,
    danger: BrandColors.red,
    surface: '#1f2937',
  },
};
