import calculateProgressPercentage from "./calculateProgress";

export const splitSchedule = (medicines) => {
    const result = [];

    medicines.forEach((medicine) => {
        medicine.schedule.forEach((timeRange) => {
            // Create a new object for each schedule
            const scheduleObject = {
                name: medicine.name,
                dose: medicine.dose,
                description: medicine.description,
                timeRange: timeRange,
                type: medicine.type,
                duration: medicine.duration,
                frequency: medicine.frequency,
                dosePerDay: medicine.dosePerDay,
                startDate: medicine.startDate,
                sideEffect: medicine.sideEffect,
                progressPercentage: calculateProgressPercentage(medicine.startDate, medicine.duration),
                ...medicine,
            };

            result.push(scheduleObject);
        });
    });

    // Sort the result array by timeRange (considering timeRange is a string like "07:00")
    result.sort((a, b) => {
        const [hourA, minuteA] = a.timeRange.split(":").map(Number);
        const [hourB, minuteB] = b.timeRange.split(":").map(Number);
        if (hourA === hourB) {
            return minuteA - minuteB;
        }
        return hourA - hourB;
    });

    return result;
}
