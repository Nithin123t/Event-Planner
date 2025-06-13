import React, { useState } from "react";
import { useEvent } from "../events/EventContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CreateEvent.css";

export default function CreateEvent() {
  const { addEvent } = useEvent();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullEvent = {
      ...formData,
      id: Date.now().toString(),
      createdBy: user.email
    };
    addEvent(fullEvent);
    toast.success("🎉 Event created successfully!");
    setFormData({ title: "", date: "", location: "", description: "" });
    navigate("/events");
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter event title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Event Date</label>
          <input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="Enter event location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe your event"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button className="submit-button" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}
