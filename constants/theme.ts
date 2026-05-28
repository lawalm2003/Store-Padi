import { fonts } from './fonts';

// ─── Color palette from Smart Inventory Figma design ─────────────────────────
// Figma dark surfaces: #0C0C0E · #1A1A1E · #232328 · border #383840
// Figma brand:  Blue #1899FA · Green #1EB27C · Amber #FAB41E · Red #E84A4A · Purple #B866FA
// Figma text:   White #FFFFFF · Muted #8C8C9E

export const LightTheme = {
  dark: false,
  theme: 'light',
  colors: {
    // ── Core backgrounds ──────────────────────────────────────────────────────
    background: '#F2F4F7', // page background — cool off-white
    surface: '#FFFFFF', // cards, modals, bottom sheets
    surface2: '#E8EBF0', // elevated surface / input fills
    card: '#FFFFFF',
    grey: '#E8EBF0',
    burnt_orange: '#94590D',

    // ── Brand / Accent ────────────────────────────────────────────────────────
    primary: '#1899FA', // Figma ACCENT — unchanged across modes
    primary_dark: '#0B76D4', // pressed state
    primary_soft: '#E4F2FE', // very light blue tint for icon bg, info chips
    primary_glow: '#C3E4FD', // subtle blue glow cards
    secondary: '#B866FA', // Figma PURPLE

    // ── Text ──────────────────────────────────────────────────────────────────
    text: '#0D0E14', // near-black, readable on white
    text3: '#74748A', // secondary / captions — warm-cool grey
    text4: '#1EB27C', // green text (profit, positive values)
    text_yellow: '#FAB41E', // Figma AMBER — warnings inline
    text_inversed: '#FFFFFF',
    text_background: '#E8EBF0',

    // ── Semantic status ───────────────────────────────────────────────────────
    success: '#1EB27C', // Figma GREEN
    warning: '#FAB41E', // Figma AMBER
    error: '#E84A4A', // Figma RED
    error_soft: '#FDEAEA', // red tint bg for error chips/banners
    info: '#1899FA',
    info_soft: '#E4F2FE',

    // ── Named palette (Figma brand colors, unchanged) ─────────────────────────
    main_green: '#1EB27C',
    golden_yellow: '#FAB41E',
    purple: '#B866FA',
    accent_blue: '#1899FA',

    // ── Soft badge fills (light tints, not washed out) ────────────────────────
    green_soft: '#E1F7EF', // "In Stock" badge bg
    amber_soft: '#FEF4E0', // "Low Stock" badge bg
    red_soft: '#FDEAEA', // "Out of Stock" badge bg
    blue_soft: '#E4F2FE', // info / AI banner bg
    purple_soft: '#F5E9FE', // secondary badge bg

    // ── Alert card backgrounds ────────────────────────────────────────────────
    alert_critical_bg: '#FDEAEA', // critical alert card tint
    alert_warning_bg: '#FEF6E6', // warning alert card tint
    alert_info_bg: '#E4F2FE', // info alert card tint
    alert_success_bg: '#E1F7EF', // success alert card tint

    // ── UI chrome ─────────────────────────────────────────────────────────────
    border: '#D8DCE6', // dividers, card borders
    input_Border: '#D0D4DE', // input field border
    input_placeholder: '#A0A3B1', // placeholder text
    fixed_input_bg: '#E8EBF0', // input fill
    dropdown_bg: '#FFFFFF',
    disabled: '#C4C8D4',
    inversed: '#0D0E14',
    white: '#FFFFFF',

    // ── Tab bar ───────────────────────────────────────────────────────────────
    tabs_inactive: '#A0A3B1', // unselected nav icon
    tabs_active: '#1899FA', // selected nav icon — Figma ACCENT
    icon_bg: '#E4F2FE', // icon container background

    // ── Bottom nav ────────────────────────────────────────────────────────────
    nav_background: '#FFFFFF',
  },
  fonts,
};

export const DarkThemeCustom = {
  dark: true,
  theme: 'dark',
  colors: {
    // ── Core backgrounds (directly from Figma) ────────────────────────────────
    background: '#0C0C0E', // Figma BG
    surface: '#1A1A1E', // Figma CARD
    surface2: '#232328', // Figma CARD2 (elevated)
    card: '#1A1A1E',
    grey: '#232328',
    burnt_orange: '#94590D',

    // ── Brand / Accent ────────────────────────────────────────────────────────
    primary: '#1899FA', // Figma ACCENT blue
    primary_dark: '#0B76D4',
    primary_soft: '#0D2133', // blue tint on dark BG
    primary_glow: '#0D2B42',
    secondary: '#B866FA', // Figma PURPLE

    // ── Text ──────────────────────────────────────────────────────────────────
    text: '#FFFFFF', // Figma TEXT
    text3: '#8C8C9E', // Figma MUTED
    text4: '#1EB27C',
    text_yellow: '#FAB41E', // Figma AMBER
    text_inversed: '#0D0E14',
    text_background: '#232328',

    // ── Semantic status ───────────────────────────────────────────────────────
    success: '#1EB27C', // Figma GREEN
    warning: '#FAB41E', // Figma AMBER
    error: '#E84A4A', // Figma RED
    error_soft: '#2A1111', // red tint on dark surface
    info: '#1899FA',
    info_soft: '#0D2133',

    // ── Named palette ─────────────────────────────────────────────────────────
    main_green: '#1EB27C',
    golden_yellow: '#FAB41E',
    purple: '#B866FA',
    accent_blue: '#1899FA',

    // ── Soft badge fills (Figma: 0.15 opacity on #1A1A1E) ────────────────────
    green_soft: '#0E2A1E', // "In Stock" badge bg
    amber_soft: '#2B2210', // "Low Stock" badge bg
    red_soft: '#2A1111', // "Out of Stock" badge bg
    blue_soft: '#0D2133', // info / AI banner bg
    purple_soft: '#22103A', // secondary badge bg

    // ── Alert card backgrounds ────────────────────────────────────────────────
    alert_critical_bg: '#271010', // critical alert card
    alert_warning_bg: '#28200D', // warning alert card
    alert_info_bg: '#0C1E2F', // info alert card
    alert_success_bg: '#0A2018', // success alert card

    // ── UI chrome ─────────────────────────────────────────────────────────────
    border: '#383840', // Figma BORDER
    input_Border: '#383840',
    input_placeholder: '#8C8C9E',
    fixed_input_bg: '#232328',
    dropdown_bg: '#1A1A1E',
    disabled: '#2E2E36',
    inversed: '#FFFFFF',
    white: '#FFFFFF',

    // ── Tab bar ───────────────────────────────────────────────────────────────
    tabs_inactive: '#8C8C9E', // Figma MUTED
    tabs_active: '#1899FA', // Figma ACCENT
    icon_bg: '#0D2133',

    // ── Bottom nav ────────────────────────────────────────────────────────────
    nav_background: '#141418', // Figma nav bar bg
  },
  fonts,
};
