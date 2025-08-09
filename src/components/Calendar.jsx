import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMonthData, getMonthName, isSameDay, formatDate } from '../utils/dateUtils';
import { getEvents } from '../utils/storage';

const Calendar = ({ onDateClick, onCreateEvent, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthData(year, month);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventsForDay = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const isToday = (date) => isSameDay(date, today);
  const isCurrentMonth = (date) => date.getMonth() === month;
  const isSelected = (date) => selectedDate && isSameDay(date, selectedDate);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="month-year">
          {getMonthName(month)} {year}
        </h2>
        
        <button onClick={() => navigateMonth(1)} className="nav-button">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {monthDays.map((date, index) => {
          const dayEvents = getEventsForDay(date);
          return (
            <div
              key={index}
              className={`calendar-day ${
                isCurrentMonth(date) ? 'current-month' : 'other-month'
              } ${isToday(date) ? 'today' : ''} ${
                isSelected(date) ? 'selected' : ''
              }`}
              onClick={() => onDateClick(date)}
            >
              <div className="day-number">{date.getDate()}</div>
              <div className="day-events">
                {dayEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="event-dot" title={event.title}>
                    {event.title.slice(0, 15)}...
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="more-events">+{dayEvents.length - 3} more</div>
                )}
              </div>
              {isCurrentMonth(date) && (
                <button
                  className="add-event-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateEvent(date);
                  }}
                  title="Add event"
                >
                  <Plus size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;