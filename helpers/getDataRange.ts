const getDateRange = (filterKey: string) => {
  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  if (filterKey === "today") {
    startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
  } else if (filterKey === "this-week") {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  } else if (filterKey === "this-month") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  } else {
    // Default to today's date if no valid filterKey
    startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
  }

  return { startDate, endDate };
};

export default getDateRange;
