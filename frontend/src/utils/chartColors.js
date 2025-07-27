// Consistent color palette for all charts in Pecunia
// Based on monthly expenses chart colors for brand consistency

export const PECUNIA_CHART_COLORS = {
  // Primary brand colors (from monthly expenses)
  primary: [
    '#5945A3',  // Primary purple
    '#B37E91',  // Secondary rose
    '#39D98A',  // Success green  
    '#FF4D67',  // Error red
    '#FFB800'   // Warning yellow
  ],
  
  // Extended palette for larger datasets
  extended: [
    '#5945A3',  // Primary purple
    '#B37E91',  // Secondary rose
    '#39D98A',  // Success green
    '#FF4D67',  // Error red
    '#FFB800',  // Warning yellow
    '#00D4FF',  // Info blue
    '#8B5CF6',  // Violet
    '#F59E0B',  // Amber
    '#10B981',  // Emerald
    '#EF4444'   // Red
  ],
  
  // Muted versions for backgrounds
  muted: [
    '#5945A320',  // Primary purple (12.5% opacity)
    '#B37E9120',  // Secondary rose (12.5% opacity)
    '#39D98A20',  // Success green (12.5% opacity)
    '#FF4D6720',  // Error red (12.5% opacity)
    '#FFB80020'   // Warning yellow (12.5% opacity)
  ],
  
  // Gradient variations
  gradients: {
    primary: 'linear-gradient(135deg, #5945A3, #B37E91)',
    success: 'linear-gradient(135deg, #39D98A, #10B981)',
    warning: 'linear-gradient(135deg, #FFB800, #F59E0B)',
    error: 'linear-gradient(135deg, #FF4D67, #EF4444)'
  }
};

// Helper function to get colors based on data length
export const getChartColors = (dataLength) => {
  if (dataLength <= 5) {
    return PECUNIA_CHART_COLORS.primary;
  }
  return PECUNIA_CHART_COLORS.extended.slice(0, dataLength);
};

// Helper function for consistent color mapping
export const getColorByIndex = (index) => {
  const colors = PECUNIA_CHART_COLORS.extended;
  return colors[index % colors.length];
};

export default PECUNIA_CHART_COLORS;