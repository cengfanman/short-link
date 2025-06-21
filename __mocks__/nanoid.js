// Mock implementation of nanoid for testing
const customAlphabet = (alphabet, size) => {
  return () => {
    let result = '';
    for (let i = 0; i < size; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
  };
};

const nanoid = () => {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 21; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
};

module.exports = {
  customAlphabet,
  nanoid,
}; 