import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { notificationService } from "../utils/notificationService";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({});

  // Load events and RSVPs for logged-in user from localStorage
  useEffect(() => {
    if (user) {
      const storedEvents = localStorage.getItem(`events_${user.email}`);
      const storedRsvps = localStorage.getItem(`rsvps_${user.email}`);
      setEvents(storedEvents ? JSON.parse(storedEvents) : []);
      setRsvps(storedRsvps ? JSON.parse(storedRsvps) : {});
    } else {
      setEvents([]); // clear when logged out
      setRsvps({});
    }
  }, [user]);

  // Save events to localStorage on every change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`events_${user.email}`, JSON.stringify(events));
    }
  }, [events, user]);

  // Save RSVPs to localStorage on every change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`rsvps_${user.email}`, JSON.stringify(rsvps));
    }
  }, [rsvps, user]);

  // Start notification service when user is logged in and has RSVPs
  useEffect(() => {
    if (user && Object.keys(rsvps).length > 0) {
      notificationService.start(events, rsvps, user.email);
    }
    return () => {
      notificationService.stop();
    };
  }, [user, events, rsvps]);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    // Remove associated RSVPs
    const updatedRsvps = { ...rsvps };
    delete updatedRsvps[id];
    setRsvps(updatedRsvps);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleRSVP = (eventId, status) => {
    if (!user) return;

    setRsvps((prev) => {
      const current = prev[eventId] || [];
      const updated = [
        ...current.filter((r) => r.user !== user.email),
        { user: user.email, status }
      ];
      return { ...prev, [eventId]: updated };
    });
  };

  const getUserRSVP = (eventId) => {
    if (!user || !rsvps[eventId]) return "No response";
    const userRsvp = rsvps[eventId].find(r => r.user === user.email);
    return userRsvp ? userRsvp.status : "No response";
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      rsvps,
      addEvent, 
      deleteEvent, 
      updateEvent,
      handleRSVP,
      getUserRSVP
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
