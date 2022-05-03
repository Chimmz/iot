export const toTitleCase = (str, divider = ' ') => {
   return str
      .toLowerCase()
      .split(divider)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(divider);
};

export const toCamelCase = (str, divider = ' ') => {
   return str
      .toLowerCase()
      .split(divider)
      .map((word, i) => {
         if (i !== 0) return word[0].toUpperCase() + word.slice(1);
         return word;
      })
      .join('');
};
