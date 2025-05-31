'use client';
import { useAppContext } from '@/context/AppContext';
import { calculateStreak } from '@/utils/dateUtils';

const Header = () => {
  const { state } = useAppContext();
  
  const totalStreak = state.reminders.reduce((total, reminder) => {
    const streak = calculateStreak(reminder.completedDates || []);
    return Math.max(total, streak);
  }, 0);

  return (
    <header className=" pb-2">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-lg font-bold text-[#171717]">daily reminders</h1>
        <button className="text-gray-500 text-sm">view all</button>
      </div>
      
      {totalStreak > 0 && (
        <div className="flex items-center mb-2 text-gray-600">
          <img src="/images/streak.png" className="mr-2 text-gray-400" />
          <span className="text-sm text-black">your streaks: {totalStreak}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
