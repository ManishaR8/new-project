export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getCurrentDate = () => {
  return formatDate(new Date());
};

export const getWeekDates = (currentDate) => {
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); 

  const monday = new Date(currentDate);
  monday.setDate(diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

export const getDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2);
};

export const getMonthYear = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
};

export const getTimeSlot = (timeString) => {
  const hour = parseInt(timeString.split(':')[0], 10);

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
};

export const isToday = (dateString) => {
  const today = getCurrentDate();
  return dateString === today;
};

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sortedDates = [...completedDates].sort();
  const today = getCurrentDate();
  const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));

  const hasRecentCompletion = sortedDates.includes(today) || sortedDates.includes(yesterday);

  if (!hasRecentCompletion) return 0;

  let streak = 1;
  let currentDate = new Date(sortedDates[sortedDates.length - 1]);

  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const prevDate = new Date(sortedDates[i]);
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};

export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  return date.getDay(); 
};

export const getDayOfMonth = (dateString) => {
  const date = new Date(dateString);
  return date.getDate();
};

export const isReminderDueOnDate = (reminder, dateString) => {
  const selectedDateObj = new Date(dateString);
  const selectedDay = selectedDateObj.getDay(); 
  const selectedDate = selectedDateObj.getDate(); 
  switch (reminder.frequency) {
    case 'Daily':
    case 'Everyday':
      return true; 
    case 'Weekly':
      return reminder.dayOfWeek !== undefined && reminder.dayOfWeek === selectedDay;
    case 'Monthly':
      return reminder.dayOfMonth !== undefined && reminder.dayOfMonth === selectedDate;
    case 'Once':
      return reminder.dueDate === dateString;
    default:
      return false;
  }
};

export const isTimePassed = (timeString, dateString) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const [hours, minutes] = timeString.split(':').map(Number);

  targetDate.setHours(hours);
  targetDate.setMinutes(minutes);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  return now > targetDate;
};
