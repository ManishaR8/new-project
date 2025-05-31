'use client';
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react'; 

const FilterForm = ({ onClose }) => {
  const { state, setFilter } = useAppContext();

  const handlePetChange = (e) => {
    setFilter('pet', e.target.value === '' ? null : e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilter('category', e.target.value === '' ? null : e.target.value);
  };

  const categories = ["Feeding", "Walk", "Medication", "Playtime", "Grooming", "Training"];

  return (
    <div className="fixed inset-0 bg-[#000000db] opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black"
          aria-label="Close filters"
        >
          <X className="w-5 h-5 cursor-pointer" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Filter Reminders</h2>

        <div className="mb-4">
          <label htmlFor="pet-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Pet:
          </label>
          <select
            id="pet-filter"
            className="w-full p-2 border rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
            value={state.filters.pet || ''}
            onChange={handlePetChange}
          >
            <option value="">All Pets</option>
            {state.pets.map(pet => (
              <option key={pet.id} value={pet.name}>{pet.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            className="w-full p-2 border rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
            value={state.filters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-black cursor-pointer text-white py-2 px-4 rounded-md  transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterForm;