const STORAGE_KEY = 'calendar-events';

export const getEvents = () => {
  try {
    const events = localStorage.getItem(STORAGE_KEY);
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const saveEvent = (event) => {
  try {
    const events = getEvents();
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

export const updateEvent = (updatedEvent) => {
  try {
    const events = getEvents();
    const index = events.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = { ...updatedEvent, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return events[index];
    }
    throw new Error('Event not found');
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = (eventId) => {
  try {
    const events = getEvents();
    const filteredEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const getEventsForDate = (date) => {
  const events = getEvents();
  const dateStr = date.toISOString().split('T')[0];
  return events.filter(event => event.date === dateStr);
};