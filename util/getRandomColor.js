module.exports = () => {
  const letters = "0123456789ABCDEF";
  const color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.random() * 16];
  }

  return color;
};
