'use client';
import React, { useState, useEffect } from 'react';
import { useAppContext, REMINDER_CATEGORIES } from '@/context/AppContext';
import { ArrowLeft, ChevronDown, Calendar, Clock } from 'lucide-react';

const ReminderForm = ({ editId, onClose }) => {
  const { state, addReminder, updateReminder, deleteReminder, setSelectedDate } = useAppContext();

  const defaultReminder = {
    petId: state.pets[0]?.id || '',
    title: '',
    petName: state.pets[0]?.name || '',
    notes: '',
    category: 'General',
    startDate: state.selectedDate,
    time: '12:00',
    frequency: 'Everyday',
  };

  const [formData, setFormData] = useState(defaultReminder);
  const [errors, setErrors] = useState({});
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    if (editId) {
      const reminderToEdit = state.reminders.find(r => r.id === editId);
      if (reminderToEdit) {
        setFormData({
          petId: reminderToEdit.petId,
          title: reminderToEdit.title,
          petName: reminderToEdit.petName,
          notes: reminderToEdit.notes || '',
          category: reminderToEdit.category,
          startDate: reminderToEdit.startDate,
          endDate: reminderToEdit.endDate,
          time: reminderToEdit.time,
          frequency: reminderToEdit.frequency,
        });
      } else {
        setFormData(defaultReminder);
      }
    }
  }, [editId, state.reminders, state.selectedDate]);

  // console.log("line 46", formData);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.petId) newErrors.petId = 'Please select a pet';
    if (!formData.title.trim()) newErrors.title = 'Please enter a title';
    if (!formData.startDate) newErrors.startDate = 'Please select a start date';
    if (!formData.time) newErrors.time = 'Please select a time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId) {
      const reminderToUpdate = state.reminders.find(r => r.id === editId);
      if (reminderToUpdate) {
        updateReminder({
          ...reminderToUpdate,
          ...formData,
        });
      }
    } else {
      addReminder(formData);
      setSelectedDate(formData.startDate);
    }

    onClose(true); 
  };

  const handleDelete = () => {
    if (editId) {
      deleteReminder(editId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-50 shadow-sm flex justify-between items-center">
        <button className="p-1 cursor-pointer" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-sm  text-[#171717] font-medium">{editId ? 'Edit Reminder' : 'Add Reminder'}</h2>
        <button
          className="text-[#019D6B] font-semibold cursor-pointer"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-1 mb-4">
          <div className='px-2'>
            <label className="block text-xs text-opacity-40 font-semibold text-[#1717179b]  mb-2">Select Pet</label>
            <div className="relative">
              <select
                className="w-full p-2 pr-8 text-sm font-semibold bg-white rounded-lg border border-[#d8d8d8] appearance-none"
                value={formData.petId}
                onChange={e => {
                  const selectedPetId = e.target.value;
                  const selectedPet = state.pets.find(p => p.id === selectedPetId);

                  setFormData({
                    ...formData,
                    petId: selectedPetId,
                    petName: selectedPet?.name || '',
                  });
                }}

              >
                {state.pets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {errors.petId && <p className="text-red-500 text-xs mt-1">{errors.petId}</p>}
          </div>

          <div className='px-2'>
            <label className="block text-xs text-opacity-40 font-semibold text-[#1717179b] mb-2">Select Category</label>
            <div className="relative">
              <select
                className="w-full p-2 pr-8 text-sm font-semibold rounded-lg border border-[#d8d8d8] bg-white appearance-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {REMINDER_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 mb-6">
          <h3 className="text-white mb-3 py-3 rounded-t-xl font-semibold  px-4 text-sm bg-black">Reminder Info</h3>

          <div className="mb-4 px-4 ">
            <label className="text-black font-semibold text-base mb-2 block">Set a reminder for...</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg relative border border-[#D0D5DD] text-base font-semibold bg-[#F6F6F6] text-[16px] bg-opacity-40 "
              placeholder="Type here..."
              maxLength={100}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <div className="text-right absolute right-2 bottom-2 text-xs text-gray-400 mt-1">
              {formData.title.length}/100
            </div>
            {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
          </div>

          <div className=' px-4 py-3 border-t border-gray-200'>
            <div className="flex justify-between items-center ">
              <label className="text-black font-semibold text-sm">Add Notes (Optional)</label>
              <button className="text-emerald-500 bg-green-50 rounded-xl text-xs px-2 py-1 cursor-pointer" onClick={() => setFormData({ ...formData, notes: '' })}>
                Add
              </button>
            </div>
            {formData.notes ? (
              <textarea
                className="w-full p-3 rounded-lg border-0 bg-white text-sm"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            ) : null}
          </div>
        </div>

        <div className=" rounded-xl border border-gray-200  mb-6">
          <div
            className="flex bg-black py-3 px-4 rounded-t-xl justify-between items-center cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          >
            <h3 className="text-white font-semibold">Reminder Settings</h3>
            <ChevronDown
              className={`text-white transition-transform ${showSettings ? 'rotate-180' : ''}`}
              size={18}
            />
          </div>

          {showSettings && (
            <div className="mt-3 space-y-4 ">
              <div className='px-4'>
                <label className="text-black px-2 text-sm font-semibold block mb-2">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-2 py-3 rounded-lg border  border-[#D0D5DD] text-black text-base font-semibold bg-[#F6F6F6] text-[16px] bg-opacity-40"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />

                </div>
                {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
              </div>

              <div className='px-4'>
                <button className="text-gray-500 px-2 cursor-pointer font-semibold text-xs" onClick={() => { }}>
                  + Add End Date
                </button>
              </div>

              <div className='border-t pt-4'>
                <label className="text-black px-5 font-semibold text-sm block mb-3">Reminder Time</label>
                <div className="relative px-4">
                  <input
                    type="time"
                    className="w-full px-2 py-3 border  rounded-lg  border-[#D0D5DD] text-black text-base font-semibold bg-[#F6F6F6] text-[16px] bg-opacity-40"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />

                </div>
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>

              <div className="border-t pt-4 pb-4">
                <label className="text-black  px-4 text-sm block mb-2">
                  Reminder Frequency
                  <span className="block text-gray-500 text-xs mt-1">How often should this reminder repeat?</span>
                </label>
                <div className="relative px-4">
                  <select
                    className="w-full p-3 pr-8 text-base rounded-lg border border-[#D0D5DD] text-black bg-[#F6F6F6] text-[16px] bg-opacity-40 appearance-none font-semibold"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="Once">Once</option>
                    <option value="Everyday">Everyday</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>
          )}
        </div>

        {editId && (
          <button
            className="w-full p-3 text-red-500 border cursor-pointer border-red-500 rounded-lg mt-4"
            onClick={handleDelete}
          >
            Delete Reminder
          </button>
        )}
      </div>
    </div>
  );
};

export default ReminderForm;
