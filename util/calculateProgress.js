const calculateCompletion = (treatment_start_date, treatment_end_date) => {
    // Parse dates
    
    const [startMonth, startDay, startYear] = treatment_start_date?.split('/').map(Number);
    const [endMonth, endDay, endYear] = treatment_end_date?.split('/').map(Number);

    const currentDate = new Date(); // Current date
    const startDate = new Date(startYear, startMonth - 1, startDay); // Create start date
    const endDate = new Date(endYear, endMonth - 1, endDay); // Create end date

    if (currentDate < startDate) {
        return 0; // Treatment hasn't started
    } else if (currentDate > endDate) {
        return 100; // Treatment is completed
    } else {
        const totalDuration = endDate - startDate; // Total treatment duration in milliseconds
        const elapsedDuration = currentDate - startDate; // Elapsed duration in milliseconds
        const completion = (elapsedDuration / totalDuration) * 100; // Completion percentage
        return completion.toFixed(2); // Return completion percentage with 2 decimal places
    }
};

// Example usage
// const treatment_start_date = "20/12/2024";
// const treatment_end_date = "30/12/2024";
// const percentage = calculateCompletion(treatment_start_date, treatment_end_date);

// console.log(`Completion Percentage: ${percentage}%`);

export default calculateCompletion;