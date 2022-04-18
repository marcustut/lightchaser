export const getCoords = async (address: string): Promise<Response> => {
  const splittedAddress = address.includes(' ') ? address.replaceAll(' ', '+') : address;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${splittedAddress}&key=${
      import.meta.env.VITE_MAP_API_KEY
    }`
  );
  return res.json();
};
