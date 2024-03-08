const today = new Date();
const date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDay())
const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
const dateTime = date+' '+time
console.log(dateTime);
// var today = new Date();
// var options = { timeZone: 'Asia/Bangkok' };

// var year = today.toLocaleDateString('en-US', { year: 'numeric', ...options });
// var month = today.toLocaleDateString('en-US', { month: '2-digit', ...options });
// var day = today.toLocaleDateString('en-US', { day: '2-digit', ...options });

// var formattedDate = `${year}-${month}-${day}`;

// console.log(formattedDate);

