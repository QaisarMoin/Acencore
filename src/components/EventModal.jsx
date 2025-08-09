import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Type, AlignLeft } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';

const EventModal = ({ isOpen, onClose, onSave, event, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        duration: event.duration || 60
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: formatDate(selectedDate),
        time: formatTime(new Date())
      }));
    }
  }, [event, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.time) {
      return;
    }
    
    onSave({ ...formData, id: event?.id });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={handleClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>
              <Type size={16} />
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Event title"
              required
            />
          </div>
          
          <div className="form-group">
            <label>
              <AlignLeft size={16} />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add description"
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                <Calendar size={16} />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>
                <Clock size={16} />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Duration (minutes)</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {event ? 'Update' : 'Create'} Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;