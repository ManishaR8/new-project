'use client';
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { getWeekDates, getDayName, getMonthYear, isToday, formatDate } from '@/utils/dateUtils';

const CalendarStrip = () => {
  const { state, setSelectedDate } = useAppContext();
  const today = new Date();
  const weekDates = getWeekDates(today);
  const monthYear = getMonthYear(today);

  const handleDateSelect = (date) => {
    setSelectedDate(formatDate(date));
  };

  return (
    <div className="bg-[#02C878] rounded-xl h-32  mb-4 flex flex-col justify-between py-3">
      <div className="text-center  text-black text-sm">
        {monthYear.toLowerCase()}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDates.map((date, index) => {
          const dayNum = date.getDate();
          const dayName = getDayName(date);
          const dateString = formatDate(date);
          const isSelected = dateString === state.selectedDate;
          const isTodayDate = isToday(dateString);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-black mb-3">{dayName}</div>
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                  ${isSelected ? 'bg-[#B9FF7D] text-black text-base font-medium' : 'text-white'}
                  ${isTodayDate && !isSelected ? 'ring-2 ring-white' : ''}
                `}
                onClick={() => handleDateSelect(date)}
              >
                {dayNum}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarStrip;
