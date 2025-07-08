type StingNull = string | null;

export const isInvalidAuthData = (
  token: StingNull,
  userData: StingNull,
): boolean => {
  return (
    !token ||
    !userData ||
    token === "undefined" ||
    token === "null" ||
    userData === "undefined" ||
    userData === "null"
  );
};
