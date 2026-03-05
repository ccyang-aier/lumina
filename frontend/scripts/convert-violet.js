
const hexToHSL = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta === 0)
    h = 0;
  else if (cmax === r)
    h = ((g - b) / delta) % 6;
  else if (cmax === g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

const colors = {
  "50": "#f5f3ff",
  "100": "#ede9fe",
  "200": "#ddd6fe",
  "300": "#c4b5fd",
  "400": "#a78bfa",
  "500": "#8b5cf6",
  "600": "#7c3aed",
  "700": "#6d28d9",
  "800": "#5b21b6",
  "900": "#4c1d95"
};

for (const [k, v] of Object.entries(colors)) {
  const hsl = hexToHSL(v);
  console.log(k+' '+v+' => '+hsl[0]+' '+hsl[1]+'% '+hsl[2]+'%');
}
