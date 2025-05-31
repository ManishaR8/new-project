'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import CalendarStrip from '@/components/CalendarStrip';
import RemindersList from '@/components/RemindersList';
import ReminderForm from '@/components/ReminderForm';
import Footer from '@/components/Footer';

export default function Home() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState();
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddReminder = () => {
    setEditingReminderId(undefined);
    setShowAddForm(true);
  };

  const handleEditReminder = (id) => {
    setEditingReminderId(id);
    setShowAddForm(true);
  };

  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleCloseForm = (wasSaved = false) => {
    setShowAddForm(false);
    setEditingReminderId(undefined);
    if (wasSaved) {
      handleShowSuccess('Your reminder is added!');
    }
  };

  return (
    <div className="min-h-screen p-5 relative bg-gray-50 pb-16">
      <Header />
      <CalendarStrip />
      <RemindersList onAddReminder={handleAddReminder} onEdit={handleEditReminder} />
      <Footer />

      {showAddForm && (
        <ReminderForm
          editId={editingReminderId}
          onClose={handleCloseForm}
        />
      )}

      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none -bottom-72">
          <div className=" bg-white border border-gray-100 text-black px-3 py-2 rounded-xl shadow-lg text-sm font-semibold animate-fade-in">
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
}
