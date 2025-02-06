const getRdays = (date) => {
    // Set the start and end dates
    const startDate = new Date();
    const endDate = new Date(date);
  
    // Calculate the time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();
  
    // Convert the time difference to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // Output the result
    return daysDiff;
  };

module.exports= {getRdays}