const normalizePhone = (value) => {
  let digits = String(value ?? "").replace(
    /[^0-9]/g,
    ""
  );

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.length === 9) {
    digits = `420${digits}`;
  }

  return digits;
};

module.exports = normalizePhone;