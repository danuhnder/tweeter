
// Implemented if tweet is more than six days old at time of render
const dateAsFullString = (date) => {
  const newDate = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = days[newDate.getDay()];
  const day = newDate.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[newDate.getMonth()];
  const year = newDate.getFullYear();
  const hour = newDate.getHours();
  const minute = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
  return `${hour}:${minute} | ${weekday} ${day}-${month}-${year}`;
};

// Implemented if tweet is between six hours and six days old at time of render
const dateAsShortString = (date) => {
  const newDate = new Date(date);
  const now = new Date(Date.now());
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = days[newDate.getDay()];
  const hour = newDate.getHours();
  const minute = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
  
  if (newDate.getDay() === now.getDay()) {
    return `Today, ${hour}:${minute}`;
  } 
  if (newDate.getDay() + 1 === now.getDay() || (newDate.getDay() === 6 && now.getDay() === 0)) {
    return `Yesterday, ${hour}:${minute}`;
  }
  return `${weekday}, ${hour}:${minute}`
};

// returns time created in appropriate format to tweet render function 
const determineDateDisplay = (date) => {
  const howRecent = Date.now() - new Date(date);
  if (howRecent < 1000 * 60) {
    return "Less than a minute ago"
  } 
  // within last hour displays minutes ago
  if (howRecent < 1000 * 60 * 60) {
    const minutesAgo = Math.floor(howRecent / (1000 * 60))
    return `${minutesAgo} minute${minutesAgo > 1? "s" : ""} ago`
  }
  // within last six hour displays hours and minutes ago
  if (howRecent < 1000 * 60 * 60 * 6) {
    const hoursAgo = Math.floor(howRecent / (1000 * 60 * 60))
    const minutesAgo = Math.floor((howRecent % (1000 * 60 * 60)) / (1000 * 60))
    return `${hoursAgo} hour${hoursAgo > 1? "s" : ""} ${minutesAgo} minute${minutesAgo > 1? "s" : ""} ago`
  }
  // within last six days displays today or weekday as appropriate and the time posted
  if (howRecent < 1000 * 60 * 60 * 24 * 6) {
    return dateAsShortString(date);
  }
  // returns a full date string for tweets more than 6 days old
    return dateAsFullString(date);
}


