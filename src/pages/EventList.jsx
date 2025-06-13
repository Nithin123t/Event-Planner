import React, { useState } from "react";
import { useEvent } from "../events/EventContext";
import { useAuth } from "../auth/AuthContext";
import NotificationToggle from "../components/NotificationToggle";
import "./EventList.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventList() {
  const { events, deleteEvent, updateEvent, handleRSVP, getUserRSVP } = useEvent();
  const { user } = useAuth();
  const [editIndex, setEditIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const startEdit = (index, event) => {
    setEditIndex(index);
    setEditedData({ ...event });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    if (editedData && editedData.id) {
      updateEvent(editedData);
      toast.success("✅ Event updated successfully!");
      setEditIndex(null);
      setEditedData({});
    } else {
      toast.error("❌ Missing event ID. Cannot save changes.");
    }
  };

  const handleRSVPClick = (eventId, status) => {
    handleRSVP(eventId, status);
    toast.info(`You marked: ${status}`);
  };

  const calculateTotalStats = () => {
    let going = 0,
      notGoing = 0,
      noResponse = 0;

    filteredEvents.forEach((event) => {
      const userRsvp = getUserRSVP(event.id);
      
      if (userRsvp === "Going") going++;
      else if (userRsvp === "Not Going") notGoing++;
      else noResponse++;
    });

    return { going, notGoing, noResponse };
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { going, notGoing, noResponse } = calculateTotalStats();

  return (
    <div className="event-list-container">
      <h2>All Events</h2>

      {user && <NotificationToggle />}

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by title, location, or creator"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="rsvp-summary">
        <h3>📈 Summary</h3>
        <p>✅ Going: {going}</p>
        <p>❌ Not Going: {notGoing}</p>
        <p>🤷 No Response: {noResponse}</p>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No matching events found.</p>
      ) : (
        <div className="event-list-flex">
          {filteredEvents.map((event, index) => (
            <div key={event.id || index} className="event-card">
              {editIndex === index ? (
                <>
                  <input
                    name="title"
                    value={editedData.title}
                    onChange={handleEditChange}
                    placeholder="Event Title"
                  />
                  <input
                    name="date"
                    value={editedData.date}
                    onChange={handleEditChange}
                    type="date"
                  />
                  <input
                    name="location"
                    value={editedData.location}
                    onChange={handleEditChange}
                    placeholder="Location"
                  />
                  <textarea
                    name="description"
                    value={editedData.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  />
                  <button onClick={saveEdit} className="save-btn">
                    💾 Save
                  </button>
                </>
              ) : (
                <>
                  <h3>{event.title}</h3>
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.description}
                  </p>
                  <p>
                    <em>Created by: {event.createdBy}</em>
                  </p>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      event.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    📍 View on Google Maps
                  </a>

                  {user && (
                    <div className="rsvp-section">
                      <span>RSVP: </span>
                      <button
                        onClick={() => handleRSVPClick(event.id, "Going")}
                        className="rsvp-btn going"
                      >
                        ✅ Going
                      </button>
                      <button
                        onClick={() => handleRSVPClick(event.id, "Not Going")}
                        className="rsvp-btn not-going"
                      >
                        ❌ Not Going
                      </button>
                      <p>Status: {getUserRSVP(event.id)}</p>
                    </div>
                  )}

                  {user?.email === event.createdBy && (
                    <div className="action-buttons">
                      <button
                        onClick={() => startEdit(index, event)}
                        className="edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteEvent(event.id);
                          toast.warn("🗑️ Event deleted");
                        }}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
