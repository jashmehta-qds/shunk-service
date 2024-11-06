export function splitNumberIntoRatios(total: number, ratios: number[]): number[] {
    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
  
    // Initial split based on ratios, without rounding
    let parts = ratios.map((ratio) => (total * ratio) / totalRatio);
  
    // Round parts down to nearest integer and calculate rounding difference
    let flooredParts = parts.map(Math.floor);
    let difference = total - flooredParts.reduce((sum, part) => sum + part, 0);
  
    // Distribute the rounding difference across parts to reach the total
    for (let i = 0; i < difference; i++) {
      flooredParts[i % flooredParts.length] += 1;
    }
  
    return flooredParts;
  }
  