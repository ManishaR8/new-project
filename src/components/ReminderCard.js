'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ReminderCard = ({
  reminder,
  type,
  onEdit,
  onDelete,
  onComplete,
  showActions = true,
}) => {
  return (
    <div
      className={`p-4 border shadow rounded-lg flex flex-col gap-2 transition-colors ${
        type === 'completed'
          ? 'bg-gray-200 border-gray-300 opacity-80'
          : 'bg-white border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`font-semibold text-lg ${
            type === 'completed'
              ? 'text-gray-500 line-through'
              : 'text-[#171717]'
          }`}
        >
          {reminder.title}
        </h3>
        {showActions && type !== 'completed' && (
          <div className="flex gap-3 -mr-2 items-center">
            <button
              onClick={onEdit}
              title="Edit"
              className="text-gray-500 cursor-pointer transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              className="text-gray-600 cursor-pointer transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onComplete}
              title="Mark as Completed"
              className="text-green-500 transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="#019D6B"
              >
                <circle cx="12" cy="12" r="10" fill="#019D6B" />
                <path
                  d="M9 12l2 2 4-4"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {type !== 'completed' && (
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-x-2">
            <img src="/images/feet.png" alt="" /> For {reminder.petName}
          </span>
          <span className="flex items-center gap-x-2">
            <img src="/images/alarm.png" alt="" /> at {reminder.time}
          </span>
          <span className="flex items-center gap-x-2">
            <img src="/images/loop.png" alt="" /> {reminder.frequency}
          </span>
        </div>
      )}
      {type === 'completed' && (
        <span className="text-xs text-gray-600 font-semibold">Completed!</span>
      )}
    </div>
  );
};

export default ReminderCard;