export const fontSize = { xs: "1.3rem", sm: '1.5rem' }
export const buttonPadding = {
    paddingY: "0.5rem",
    paddingX: "1.5rem",
}
export const color = "#1976d2";
export const buttonBackgroundColor = "#4f9ae3"

export const heightAdaptive = { xs: "60px", sm: '60px', md: "60px", xl: '60px', lg: '60px' };
export const contentHeightAdaptive = {
    xs: `calc(100vh - ${heightAdaptive.xs})`,
    sm: `calc(100vh - ${heightAdaptive.sm})`,
    md: `calc(100vh - ${heightAdaptive.md})`,
    xl: `calc(100vh - ${heightAdaptive.xl})`,
    lg: `calc(100vh - ${heightAdaptive.lg})`,
}

export const lineHeight = { xs: `calc(${fontSize.xs} * 1.2)`, sm: `calc(${fontSize.sm} * 1.2)` }