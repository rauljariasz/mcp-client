export const validateEmail = (value: string): boolean => {
  if (value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
    return true;
  } else {
    return false;
  }
};

export const onlyLettersAndNumbers = /^[a-zA-Z0-9]*$/;
