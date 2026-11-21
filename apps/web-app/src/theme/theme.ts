import { createTheme } from '@mui/material/styles'
import type { ColorSystemOptions } from '@mui/material/styles'
import { darkColors, lightColors } from './colors.ts'
import type { ColorSet, Tone } from './colors.ts'

// Tonos propios de la app, como los VehicleColors de Android, para etiquetas y fondos suaves.
interface Tones {
  blue: Tone
  green: Tone
  orange: Tone
  red: Tone
  purple: Tone
}

declare module '@mui/material/styles' {
  interface Palette {
    tones: Tones
    inputBorder: string
  }
  interface PaletteOptions {
    tones?: Tones
    inputBorder?: string
  }
}

function paletteFrom(colors: ColorSet): ColorSystemOptions['palette'] {
  const { blue, green, orange, red, purple } = colors
  return {
    // Con 4,5 Material UI elige texto blanco u oscuro sobre cada relleno con contraste suficiente.
    contrastThreshold: 4.5,
    primary: { main: blue.fill, contrastText: colors.onBlue },
    secondary: { main: purple.fill },
    info: { main: blue.fill },
    success: { main: green.fill },
    warning: { main: orange.fill },
    error: { main: red.fill },
    background: { default: colors.background, paper: colors.surface },
    text: { primary: colors.text, secondary: colors.textSecondary },
    divider: colors.border,
    tones: { blue, green, orange, red, purple },
    inputBorder: colors.inputBorder,
    // Los mensajes usan los fondos suaves de Android. El texto y el icono llevan el tono de texto,
    // porque el naranja de relleno sobre su fondo suave no llega ni a 3:1.
    Alert: {
      infoColor: blue.text,
      infoStandardBg: blue.soft,
      infoIconColor: blue.text,
      successColor: green.text,
      successStandardBg: green.soft,
      successIconColor: green.text,
      warningColor: orange.text,
      warningStandardBg: orange.soft,
      warningIconColor: orange.text,
      errorColor: red.text,
      errorStandardBg: red.soft,
      errorIconColor: red.text,
    },
  }
}

// Escala de Type.kt de Android: headline → h1 a h3, title → h4 a h6 y subtitle, body y label → button y overline.
const typography = {
  fontFamily: '"Roboto Variable", Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
  h1: { fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 700, letterSpacing: 0 },
  h2: { fontSize: '1.625rem', lineHeight: '2rem', fontWeight: 700, letterSpacing: 0 },
  h3: { fontSize: '1.375rem', lineHeight: '1.75rem', fontWeight: 700, letterSpacing: 0 },
  h4: { fontSize: '1.25rem', lineHeight: '1.625rem', fontWeight: 700, letterSpacing: 0 },
  h5: { fontSize: '1.0625rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: 0 },
  h6: { fontSize: '0.9375rem', lineHeight: '1.25rem', fontWeight: 600, letterSpacing: 0 },
  subtitle1: { fontSize: '1.0625rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: 0 },
  subtitle2: { fontSize: '0.9375rem', lineHeight: '1.25rem', fontWeight: 600, letterSpacing: 0 },
  body1: { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: 0 },
  body2: { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: 0 },
  caption: { fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: 0 },
  button: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
    letterSpacing: 0,
    textTransform: 'none' as const,
  },
  overline: { fontSize: '0.6875rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: 0 },
}

// Colores de Material UI cuyo relleno no sirve como texto en modo claro, y su tono de texto.
const textTones = { success: 'green', warning: 'orange', error: 'red' } as const

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: { palette: paletteFrom(lightColors) },
    dark: { palette: paletteFrom(darkColors) },
  },
  typography,
  shape: { borderRadius: 14 },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        // Foco de teclado bien visible, en lugar del brillo discreto del tema por defecto.
        root: ({ theme }) => ({
          '&.Mui-focusVisible': {
            outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
            outlineOffset: 2,
          },
        }),
      },
    },
    MuiButton: {
      // Sin el destello de foco: aclaraba el botón y bajaba el contraste; el contorno ya marca el foco.
      defaultProps: { disableElevation: true, disableFocusRipple: true },
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 48,
          paddingInline: 20,
          // Los botones de texto y de contorno muestran el color como texto: usan su tono de texto.
          variants: Object.entries(textTones).flatMap(([color, tone]) =>
            (['text', 'outlined'] as const).map((variant) => ({
              props: { color: color as keyof typeof textTones, variant },
              style: { color: (theme.vars || theme).palette.tones[tone].text },
            })),
          ),
        }),
        sizeSmall: { minHeight: 36, paddingInline: 12 },
      },
    },
    MuiIconButton: {
      defaultProps: { disableFocusRipple: true },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
          ...theme.applyStyles('dark', { boxShadow: 'none' }),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999 },
      },
    },
    // En modo claro, el rojo de relleno sobre el fondo gris da 4,38:1: el texto de error de los
    // campos (etiqueta, asterisco y ayuda) usa el tono de texto. El borde con error no cambia.
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-error': { color: (theme.vars || theme).palette.tones.red.text },
        }),
        asterisk: ({ theme }) => ({
          '&.Mui-error': { color: (theme.vars || theme).palette.tones.red.text },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-error': { color: (theme.vars || theme).palette.tones.red.text },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
        // Solo el borde en reposo: al pasar el mouse, con foco o con error manda Material UI.
        notchedOutline: ({ theme }) => ({
          borderColor: (theme.vars || theme).palette.inputBorder,
        }),
      },
    },
  },
})
