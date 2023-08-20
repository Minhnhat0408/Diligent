export function calculateDateStreaks(dates) {
    let dateArray = dates.map((d) =>  {
        return new Date(d)
    })
    let currentStreak = 0;
    let longestStreak = 0;

    for (let i = 1; i < dateArray.length; i++) {
        const previousDate = dateArray[i - 1];
        const currentDate = dateArray[i];

        // Calculate the difference in days between consecutive dates
        const timeDifference = Math.abs(currentDate - previousDate);
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 1) {
            // If dates are consecutive, increment the current streak
            currentStreak++;
            // Update the longest streak if the current streak surpasses it
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            // If dates are not consecutive, reset the current streak
            currentStreak = 0;
        }
    }

    return { longestStreak: longestStreak + 1, currentStreak: currentStreak + 1 };
}

export function formattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formatDate = `${year}-${month}-${day}`;
    return formatDate;
}
