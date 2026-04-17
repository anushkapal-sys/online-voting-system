import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePollModal = ({ open, onClose, onPollCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    options: ['', ''],
    startDate: new Date().toISOString().slice(0, 16),
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.filter(opt => opt.trim()).length < 2) {
      toast.error('Add at least 2 options');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Poll
      const response = await axios.post('/api/polls', {
        title: formData.title,
        startdate: formData.startDate,
        enddate: formData.endDate || null
      });

      const newPollId = response.data.pollid;

      if (newPollId) {
        // 2. Add Options (Only if poll created successfully)
        await axios.post(`/api/polls/${newPollId}/options`, {
          options: formData.options.filter(opt => opt.trim())
        });

        // 3. Refresh Dashboard & Close
        await onPollCreated(); 
        toast.success('🎉 Poll created successfully!');
        onClose();
        setFormData({ title: '', options: ['', ''], startDate: '', endDate: '' });
      } else {
        throw new Error('No poll ID returned from server');
      }

    } catch (error) {
      console.error('Create poll error:', error);
      toast.error('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>✨ Create New Poll</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="poll-form">
              <div className="form-group">
                <label>Poll Title</label>
                <input
                  type="text"
                  placeholder="What is your favorite programming language?"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dates</label>
                <div className="date-group">
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <span>to</span>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="option-row">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        className="remove-option"
                        onClick={() => removeOption(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <motion.button
                  type="button"
                  className="add-option-btn"
                  onClick={addOption}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Add Option
                </motion.button>
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating...' : (
                  <>
                    <Check size={20} /> Create Poll
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePollModal;