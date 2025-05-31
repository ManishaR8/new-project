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

  const handleAddReminder = () => {
    setEditingReminderId(undefined);
    setShowAddForm(true);
  };

  const handleEditReminder = (id) => {
    setEditingReminderId(id);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingReminderId(undefined);
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
    </div>
  );
}
