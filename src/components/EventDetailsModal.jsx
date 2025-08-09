import { X, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const EventDetailsModal = ({ isOpen, onClose, event, onEdit, onDelete }) => {
  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content event-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event.title}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{new Date(event.date + 'T' + event.time).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="detail-item">
            <Clock size={16} />
            <span>{event.time} ({event.duration} minutes)</span>
          </div>
          
          {event.description && (
            <div className="detail-description">
              <p>{event.description}</p>
            </div>
          )}
        </div>
        
        <div className="event-actions">
          <button onClick={handleEdit} className="btn-secondary">
            <Edit2 size={16} />
            Edit
          </button>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;