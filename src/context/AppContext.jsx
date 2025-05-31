'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentDate, getTimeSlot } from '@/utils/dateUtils';

export const REMINDER_CATEGORIES = [
  "General",
  "Lifestyle",
  "Health"
];

const initialPets = [
  { id: '1', name: 'Browny' },
  { id: '2', name: 'Max' },
  { id: '3', name: 'Bella' }
];

const initialState = {
  pets: initialPets,
  reminders: [],
  selectedDate: getCurrentDate(),
  filters: {
    pet: null,
    category: null
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [
          ...state.reminders,
          {
            ...action.payload,
            timeSlot: getTimeSlot(action.payload.time),
            createdAt: Date.now(),
            completedDates: []
          }
        ]
      };

    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id
            ? { ...action.payload, timeSlot: getTimeSlot(action.payload.time) }
            : reminder
        )
      };

    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload)
      };

    case 'COMPLETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder => {
          if (reminder.id === action.payload.id) {
            const completedDates = [...(reminder.completedDates || [])];
            if (!completedDates.includes(action.payload.date)) {
              completedDates.push(action.payload.date);
            }
            return {
              ...reminder,
              status: 'completed',
              completedDates
            };
          }
          return reminder;
        })
      };

    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: action.payload.value
        }
      };

    default:
      return state;
  }
};

const AppContext = createContext({
  state: initialState,
  addReminder: () => {},
  updateReminder: () => {},
  deleteReminder: () => {},
  completeReminder: () => {},
  setSelectedDate: () => {},
  setFilter: () => {}
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const getSavedState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('petRemindersState');
      return saved ? JSON.parse(saved) : initialState;
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(
    appReducer,
    getSavedState()
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('petRemindersState', JSON.stringify(state));
    }
  }, [state]);

  const addReminder = (reminderData) => {
    const newReminder = {
      ...reminderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: Date.now(),
      timeSlot: getTimeSlot(reminderData.time),
      completedDates: []
    };

    dispatch({ type: 'ADD_REMINDER', payload: newReminder });
  };

  const updateReminder = (reminder) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: reminder });
  };

  const deleteReminder = (id) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  };

  const completeReminder = (id) => {
    dispatch({
      type: 'COMPLETE_REMINDER',
      payload: { id, date: state.selectedDate }
    });
  };

  const setSelectedDate = (date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  };

  const setFilter = (type, value) => {
    dispatch({ type: 'SET_FILTER', payload: { type, value } });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        setSelectedDate,
        setFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
