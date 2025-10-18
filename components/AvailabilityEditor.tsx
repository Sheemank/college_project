import React from 'react';
import type { Tutor, DayOfWeek, TimeSlot } from '../types';

interface AvailabilityEditorProps {
  value: Tutor['availability'];
  onChange: (newValue: Tutor['availability']) => void;
}

const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({ value, onChange }) => {
  
  const handleDayToggle = (day: DayOfWeek, isChecked: boolean) => {
    const newAvailability = { ...value };
    if (isChecked) {
      if (!newAvailability[day]) {
        newAvailability[day] = ['']; // Add a default empty slot
      }
    } else {
      delete newAvailability[day];
    }
    onChange(newAvailability);
  };

  const handleTimeSlotChange = (day: DayOfWeek, index: number, slotValue: TimeSlot) => {
    const newAvailability = { ...value };
    if (newAvailability[day]) {
      const newSlots = [...newAvailability[day]!];
      newSlots[index] = slotValue;
      newAvailability[day] = newSlots;
      onChange(newAvailability);
    }
  };

  const handleAddTimeSlot = (day: DayOfWeek) => {
    const newAvailability = { ...value };
    if (newAvailability[day]) {
      newAvailability[day] = [...newAvailability[day]!, ''];
      onChange(newAvailability);
    }
  };

  const handleRemoveTimeSlot = (day: DayOfWeek, index: number) => {
    const newAvailability = { ...value };
    if (newAvailability[day]) {
      const newSlots = newAvailability[day]!.filter((_, i) => i !== index);
      if (newSlots.length === 0) {
        // If all slots are removed, uncheck the day
        delete newAvailability[day];
      } else {
        newAvailability[day] = newSlots;
      }
      onChange(newAvailability);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      {daysOfWeek.map(day => (
        <div key={day}>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`day-${day}`}
              checked={!!value[day]}
              onChange={(e) => handleDayToggle(day, e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`day-${day}`} className="ml-2 block text-sm font-medium text-slate-700">{day}</label>
          </div>
          {value[day] && (
            <div className="pl-6 mt-2 space-y-2">
              {value[day]!.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => handleTimeSlotChange(day, index, e.target.value)}
                    placeholder="e.g., 9:00 AM - 11:00 AM"
                    className="flex-grow px-3 py-1.5 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeSlot(day, index)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold"
                    aria-label={`Remove time slot for ${day}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddTimeSlot(day)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add time slot
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityEditor;