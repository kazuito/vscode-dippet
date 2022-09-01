export function generateToken(length: number) {
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token: string = "";
  for (let i = 0; i < length; i++) {
    token += letters[getRandInt(letters.length - 1)];
  }
  return token;
}

export function getRandInt(max: number) {
  return Math.floor(Math.random() * max);
}
