import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { getEvents } from '../utils/storage';
import { formatDate } from '../utils/dateUtils';

const ListView = ({ onEventClick, onCreateEvent, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const allEvents = getEvents();
    const sortedEvents = [...allEvents].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateA - dateB;
      }
      return a.title.localeCompare(b.title);
    });
    setEvents(sortedEvents);
  }, [sortBy, refreshTrigger]);

  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const date = event.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const today = formatDate(new Date());

  return (
    <div className="list-view">
      <div className="list-view-header">
        <h2>Upcoming Events</h2>
        <div className="list-view-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={() => onCreateEvent(new Date())}
            className="btn-primary add-event-list"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      <div className="events-list">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="no-events">
            <Calendar size={48} />
            <h3>No events scheduled</h3>
            <p>Create your first event to get started</p>
            <button
              onClick={() => onCreateEvent(new Date())}
              className="btn-primary"
            >
              <Plus size={16} />
              Create Event
            </button>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([date, dateEvents]) => {
            const dateObj = new Date(date);
            const isToday = date === today;
            const isPast = date < today;
            
            return (
              <div key={date} className={`date-group ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}>
                <div className="date-header">
                  <h3>
                    {dateObj.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {isToday && <span className="today-label">Today</span>}
                  </h3>
                  <span className="event-count">{dateEvents.length} event{dateEvents.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="date-events">
                  {dateEvents.map(event => (
                    <div
                      key={event.id}
                      className="event-item"
                      onClick={() => onEventClick(event)}
                    >
                      <div className="event-time">
                        <Clock size={14} />
                        {event.time}
                      </div>
                      <div className="event-content">
                        <h4>{event.title}</h4>
                        {event.description && (
                          <p className="event-description">{event.description}</p>
                        )}
                        <div className="event-duration">
                          Duration: {event.duration} minutes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListView;