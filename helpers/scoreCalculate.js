function calcAvarage(rate, count, avarage) {
  count = count + 1;
  avarage = (rate + avarage * count) / count;
  return avarage;
}

module.exports = calcAvarage;
