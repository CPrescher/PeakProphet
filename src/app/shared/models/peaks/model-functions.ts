export function gaussian(x: number[], position: number, fwhm: number, amplitude: number): number[] {
  const hwhm: number = fwhm * 0.5;
  return  x.map(v => amplitude * 0.8326 / (hwhm * 1.7725) * Math.exp(-Math.pow(v - position, 2) /
    Math.pow(hwhm / 0.8326, 2)));
}

export function lorentzian(x: number[], position: number, fwhm: number, amplitude: number): number[] {
  const hwhm: number = fwhm * 0.5;
  return x.map(v => amplitude / (Math.PI*hwhm*(1+Math.pow((v-position)/hwhm,2))));

}
