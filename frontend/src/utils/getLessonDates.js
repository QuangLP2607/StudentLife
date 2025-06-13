export function getLessonDates({
  start_date,
  weeks,
  weekday,
  weekType,
  customWeeks,
}) {
  const result = [];
  const start = new Date(start_date);
  const dayOffset = weekday - start.getDay();
  const firstLessonDate = new Date(start);
  firstLessonDate.setDate(
    start.getDate() + (dayOffset >= 0 ? dayOffset : 7 + dayOffset)
  );

  for (let i = 0; i < weeks; i++) {
    const weekNum = i + 1;

    if (
      (weekType === "even" && weekNum % 2 === 0) ||
      (weekType === "odd" && weekNum % 2 === 1) ||
      (weekType === "custom" && customWeeks.includes(weekNum)) ||
      weekType === "all"
    ) {
      const lessonDate = new Date(firstLessonDate);
      lessonDate.setDate(firstLessonDate.getDate() + i * 7);
      result.push({
        week: weekNum,
        date: lessonDate.toLocaleDateString("vi-VN"),
      });
    }
  }

  return result;
}
