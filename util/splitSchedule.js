export const processFrequencies = (medicines) => {
    // Flatten medicines with each frequency as a separate entry
    const flattenedMedicines = medicines.flatMap(medicine =>
        medicine.frequency.map(({ time, number_of_tablets }) => ({
            ...medicine,
            time,
            number_of_tablets,
        }))
    );

    // Sort the flattened medicines by time
    const sortedMedicines = flattenedMedicines.sort((a, b) => {
        // Convert time to comparable values
        const timeA = new Date(`1970-01-01T${a.time}:00`);
        const timeB = new Date(`1970-01-01T${b.time}:00`);
        return timeA - timeB;
    });

    return sortedMedicines;
};

export const frequencyArray = [
    { time: "07:00", number_of_tablets: 0 },
    { time: "08:00", number_of_tablets: 0 },
    { time: "09:00", number_of_tablets: 0 },
    { time: "10:00", number_of_tablets: 0 },
    { time: "11:00", number_of_tablets: 0 },
    { time: "12:00", number_of_tablets: 0 },
    { time: "13:00", number_of_tablets: 0 },
    { time: "14:00", number_of_tablets: 0 },
    { time: "15:00", number_of_tablets: 0 },
    { time: "16:00", number_of_tablets: 0 },
    { time: "17:00", number_of_tablets: 0 },
    { time: "18:00", number_of_tablets: 0 },
    { time: "19:00", number_of_tablets: 0 },
    { time: "20:00", number_of_tablets: 0 },
    { time: "21:00", number_of_tablets: 0 },
    { time: "22:00", number_of_tablets: 0 },
    { time: "23:00", number_of_tablets: 0 },
    { time: "00:00", number_of_tablets: 0 },
    { time: "01:00", number_of_tablets: 0 },
    { time: "02:00", number_of_tablets: 0 },
    { time: "03:00", number_of_tablets: 0 },
    { time: "04:00", number_of_tablets: 0 },
    { time: "05:00", number_of_tablets: 0 },
    { time: "06:00", number_of_tablets: 0 },
];

export const medicineForm = [
    { title: 'Injection' },
    { title: 'Capsule' },
    { title: 'Tablet' },
    { title: 'Syrup' },
    { title: 'Solution' },
    { title: 'Liquid', },
    { title: 'Powder', },
    { title: 'Lotion', },
]