'use client';
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Pencil, Trash2, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { isReminderDueOnDate, isTimePassed, getTimeSlot, getCurrentDate } from '@/utils/dateUtils';
import FilterForm from '@/components/FilterForm';
import ReminderCard from './ReminderCard';

const RemindersList = ({ onEdit, onAddReminder }) => {
  const { state, deleteReminder, completeReminder, setFilter } = useAppContext();
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reminderIdToDelete, setReminderIdToDelete] = useState(null);


  const handleCompleteReminder = (id) => {
    completeReminder(id);
  };

  const handleDeleteReminder = (id) => {
    setReminderIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteReminder(reminderIdToDelete);
    setShowDeleteModal(false);
    setReminderIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReminderIdToDelete(null);
  };

  const isReminderCompletedToday = (reminder) => {
    return reminder.completedDates && reminder.completedDates.includes(state.selectedDate);
  };

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Evening';
    } else {
      return 'Night';
    }
  };

  const filteredReminders = state.reminders.filter(reminder => {

    if (state.filters.pet && reminder.petName !== state.filters.pet) {
      return false;
    }

    if (state.filters.category && reminder.category !== state.filters.category) {
      return false;
    }
    return true;
  });

  const pendingGoals = [];
  const completedGoals = [];
  const activeReminders = [];

  const todayDate = getCurrentDate();

  const groupedActiveReminders = {};
  const timeSlotOrder = ['Morning', 'Afternoon', 'Evening', 'Night'];
  timeSlotOrder.forEach(slot => {
    groupedActiveReminders[slot] = [];
  });

  filteredReminders.forEach(reminder => {
    const completedForSelectedDate = isReminderCompletedToday(reminder);
    const dueOnSelectedDate = isReminderDueOnDate(reminder, state.selectedDate);
    let timePassedForSelectedDate = false;

    if (state.selectedDate === todayDate) {
      timePassedForSelectedDate = isTimePassed(reminder.time, state.selectedDate);
    }

    // console.log("line 86", state.selectedDate);

    if (completedForSelectedDate) {
      completedGoals.push(reminder);
    } else if (dueOnSelectedDate) {
      activeReminders.push(reminder);
    } else {
      pendingGoals.push(reminder);
    }
  });

  activeReminders.forEach(reminder => {
    const slot = reminder.timeSlot || getTimeSlot(reminder.time) || 'Morning';
    if (groupedActiveReminders[slot]) {
      groupedActiveReminders[slot].push(reminder);
    }
  });

  const orderedTimeSlots = timeSlotOrder.filter(slot => groupedActiveReminders[slot].length > 0);

  return (
    <div className="relative">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-sm text-opacity-75 font-semibold text-[#171717]">{getCurrentTimeOfDay()} </h2>
        <span>
          <button
            onClick={() => setShowFilterForm(true)}
            className="text-black cursor-pointer"
            title="Open Filters"
            aria-label="Open Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </span>
      </div>

      {showFilterForm && <FilterForm onClose={() => setShowFilterForm(false)} />}

      {filteredReminders.length === 0 ? (
        <p className="text-gray-500"> Add one Goals to get started!</p>
      ) : (
        <>
          {Object.keys(groupedActiveReminders).length > 0 && (
            <div className="mb-6">
              {orderedTimeSlots.map(timeSlot => (
                <div key={timeSlot}>
                  <h3 className="text-xs font-medium text-[#171717] py-3 text-opacity-70">{timeSlot}</h3>
                  <ul className="space-y-4">
                    {groupedActiveReminders[timeSlot].map(reminder => (
                      <li key={reminder.id}>
                        <ReminderCard
                          reminder={reminder}
                          type="active"
                          onEdit={(e) => {
                            e.stopPropagation();
                            onEdit(reminder.id);
                          }}
                          onDelete={(e) => {
                            e.stopPropagation();
                            handleDeleteReminder(reminder.id);
                          }}
                          onComplete={(e) => {
                            e.stopPropagation();
                            handleCompleteReminder(reminder.id);
                          }}
                          showActions={true}
                        />
                        {showDeleteModal && reminderIdToDelete === reminder.id && (
                          <div className="fixed inset-0 bg-[#000000a6] opacity-95 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-xl shadow-lg w-64">
                              <h2 className="text-lg font-semibold text-gray-800 mb-3">Delete Reminder?</h2>
                              <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this reminder?</p>
                              <div className="flex justify-end gap-4">
                                <button
                                  onClick={cancelDelete}
                                  className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={confirmDelete}
                                  className="px-3 py-2 text-xs bg-black text-white rounded-md cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {pendingGoals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-[#171717] mb-2 text-opacity-70">Pending Goals</h3>
              <ul className="space-y-4">
                {pendingGoals.map((reminder) => (
                  <li key={reminder.id}>
                    <ReminderCard
                      reminder={reminder}
                      type="pending"
                      onEdit={(e) => {
                        e.stopPropagation();
                        onEdit(reminder.id);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDeleteReminder(reminder.id);
                      }}
                      onComplete={(e) => {
                        e.stopPropagation();
                        handleCompleteReminder(reminder.id);
                      }}
                      showActions={true}
                    />
                   
                    {showDeleteModal && reminderIdToDelete === reminder.id && (
                      <div className="fixed inset-0 bg-[#000000a6] opacity-95 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-xl shadow-lg w-64">
                          <h2 className="text-lg font-semibold text-gray-800 mb-3">Delete Reminder?</h2>
                          <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this reminder?</p>
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={cancelDelete}
                              className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={confirmDelete}
                              className="px-3 py-2 text-xs bg-black text-white rounded-md cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pendingGoals.length === 0 && (activeReminders.length > 0 || completedGoals.length > 0) && (
            <p className="text-gray-500 mb-4">No pending goals for selected filters.</p>
          )}

          {completedGoals.length > 0 && (
            <div className="mt-5 pb-4">
              <h3 className="text-xs font-medium text-[#171717] mb-3 text-opacity-70">Completed Goals</h3>
              <ul className="space-y-4">
                {completedGoals.map((reminder) => (
                  <li key={reminder.id}>
                    <ReminderCard
                      reminder={reminder}
                      type="completed"
                      showActions={false}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {completedGoals.length === 0 && (activeReminders.length > 0 || pendingGoals.length > 0) && (
            <p className="text-gray-500 mb-4">No completed goals </p>
          )}
        </>
      )}

      <button
        className="fixed bottom-24 right-7 z-10 cursor-pointer"
        onClick={onAddReminder}
        aria-label="Add Reminder"
      >
        <div className="w-12 h-12 rounded-xl bg-[#019D6B] flex items-center justify-center shadow-lg  transition">
          <span className="text-white text-3xl">+</span>
        </div>
      </button>
    </div>
  );
};

export default RemindersList;