export  function formatDate(input: string, locale: string = 'ru') {
    const [datePart, hourStr, minuteStr] = input.split(/[:]/);
    const [year, month, day] = datePart.split('-').map(Number);
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const date = new Date(year, month - 1, day, hour, minute);

    // Розбираємо на частини, щоб прибрати "г."
    const parts = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).formatToParts(date);

    // Збираємо вручну
    const formattedDate = parts
        .filter(p => p.type !== 'literal' || p.value.trim() !== 'г.')
        .map(p => p.value)
        .join('');

    // Форматуємо час HH:MM
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return `${formattedDate} / ${formattedTime}`;
}