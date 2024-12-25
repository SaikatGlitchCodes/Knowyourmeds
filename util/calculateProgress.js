function calculateProgressPercentage(startDate, duration) {
    const start = new Date(startDate);
    const totalDays = parseFloat(duration); // Extract the number of days
    const today = new Date();

    // Calculate the difference in days
    const elapsedDays = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));

    // Calculate progress percentage
    const progress = Math.min((elapsedDays / totalDays) * 100, 100);

    return Math.round(progress);
}

export default calculateProgressPercentage;