// export default function formatDate(date) {
//     const now = new Date();
//     const diffInMilliseconds = now - date;

//     const minute = 60 * 1000;
//     const hour = 60 * minute;
//     const day = 24 * hour;

//     if (diffInMilliseconds < minute) {
//       return "Just now";
//     } else if (diffInMilliseconds < hour) {
//       return `${Math.floor(diffInMilliseconds / minute)} minutes`;
//     } else if (diffInMilliseconds < day && date.getDate() === now.getDate()) {
//       return "Today";
//     } else if (
//       diffInMilliseconds < 2 * day &&
//       date.getDate() === now.getDate() - 1
//     ) {
//       return "Yesterday";
//     } else {
//       // Format the date using your preferred format
//       return date.toLocaleDateString();
//     }
//   }


// functions/formatDate.js

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export default formatDate;