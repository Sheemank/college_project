import React from 'react';
import type { Tutor, DayOfWeek } from '../types';

interface AvailabilityDisplayProps {
  availability: Tutor['availability'];
}

const orderedDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// For demonstration purposes, we'll simulate some slots being booked.
// In a real application, this would come from a bookings API.
const mockBookedSlots = new Set([
    'Tuesday|4:00 PM - 8:00 PM', // Dr. Eleanor Vance
    'Saturday|10:00 AM - 4:00 PM', // Samuel Jones
    'Monday|6:00 PM - 10:00 PM', // David Chen
]);


const AvailabilityDisplay: React.FC<AvailabilityDisplayProps> = ({ availability }) => {
  const availableDays = orderedDays.filter(day => availability[day] && availability[day]!.length > 0);

  if (availableDays.length === 0) {
    return <p className="text-slate-500">Not specified, please contact for details.</p>;
  }

  return (
    <div>
        <div className="flex items-center space-x-4 mb-3 text-sm text-slate-600">
            <div className="flex items-center"><span className="w-3 h-3 bg-green-100 rounded-full mr-2 border border-green-200"></span>Available</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-slate-100 rounded-full mr-2 border border-slate-200"></span>Booked</div>
        </div>
        <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
            <tbody className="bg-white divide-y divide-slate-200">
            {availableDays.map(day => {
                const slots = availability[day]!;
                return (
                    <tr key={day}>
                        <td className="px-4 py-3 w-1/3 font-medium text-slate-800 text-sm align-top">{day}</td>
                        <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                            {slots.map((slot, index) => {
                                const isBooked = mockBookedSlots.has(`${day}|${slot}`);
                                return (
                                    <span 
                                        key={index} 
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                                            isBooked 
                                            ? 'bg-slate-100 text-slate-500 line-through' 
                                            : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {slot}
                                    </span>
                                );
                            })}
                            </div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default AvailabilityDisplay;