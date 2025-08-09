import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Sun, Moon, Plus } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.jsx';
import Calendar from './components/Calendar';
import ListView from './components/ListView';
import EventModal from './components/EventModal';
import EventDetailsModal from './components/EventDetailsModal';
import { saveEvent, updateEvent, deleteEvent, getEvents } from './utils/storage';
import './App.css';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const refreshEvents = () => {
    setEvents(getEvents());
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateEvents = events.filter(event => 
      event.date === date.toISOString().split('T')[0]
    );
    
    if (dateEvents.length === 1) {
      setSelectedEvent(dateEvents[0]);
      setIsDetailsModalOpen(true);
    } else if (dateEvents.length > 1) {
      // Show list of events for that day or open creation modal
      setIsEventModalOpen(true);
    } else {
      setIsEventModalOpen(true);
    }
  };

  const handleCreateEvent = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (eventData.id) {
        await updateEvent(eventData);
      } else {
        await saveEvent(eventData);
      }
      refreshEvents();
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      refreshEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>My Calendar</h1>
          <div className="view-switcher">
            <button
              className={`view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={18} />
              Calendar
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={18} />
              List
            </button>
          </div>
        </div>
        
        <div className="header-right">
          <button
            onClick={() => handleCreateEvent(new Date())}
            className="btn-primary create-event-btn"
          >
            <Plus size={16} />
            Create Event
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="app-main">
        {view === 'calendar' ? (
          <Calendar
            onDateClick={handleDateClick}
            onCreateEvent={handleCreateEvent}
            selectedDate={selectedDate}
          />
        ) : (
          <ListView
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;