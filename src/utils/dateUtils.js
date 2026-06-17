
//Ussed for ItineraryForm to set date formate in javascript date 
// export const parseDate = (dateString) => {

//   const [d, m, y] = dateString.split("/");
//   return new Date(y, m - 1, d);
// };
export const parseDate = (dateString) => {
  if (!dateString) return null;

  return new Date(dateString);
};


// calculate the number of days between two dates.
// export const calcDaysBetween = (start, end) => {
    

//   const startDate = parseDate(start);
//   const endDate = parseDate(end);

//   return (
//     Math.floor(
//       (endDate - startDate) /
//         (1000 * 60 * 60 * 24)
//     ) + 1
//   );
// };
export const calcDaysBetween = (start, end) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) return 0;

  return (
    Math.floor(
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1
  );
};