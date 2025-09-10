import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import Navbar from "../components/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues :", data);

        if (Array.isArray(data)) {
          const formattedEvents = data.map((ev) => {
            const startDate = new Date(ev.dates);
            return {
              id: ev.id,
              title: ev.name,
              start: startDate,
              end: startDate,
              location: ev.location,
              description: ev.description,
              event_type: ev.event_type,
              target_audience: ev.targent_audience,
            };
          });
          setEvents(formattedEvents);
        } else {
          console.error("Format de données inattendu :", data);
        }
      })
      .catch((err) => console.error("Erreur de chargement des événements :", err));
  }, []);

  return (
    <div style={{ height: 700 }}>
      <Navbar />
      <Calendar
        localizer={localizer}
        events={events}
        step={60}
        views={["month", "week", "day", "agenda"]}
        defaultDate={new Date()}
        popup
        onShowMore={(events) => {
          setSelectedEvents(events);
          setShowModal(true);
        }}
      />
      {showModal && (
        <div
          style={{
            background: "white",
            padding: 20,
            border: "1px solid black",
            position: "absolute",
            top: "20%",
            left: "30%",
            zIndex: 1000,
          }}
        >
          <h3>Événements du jour</h3>
          <ul>
            {selectedEvents.map((ev, i) => (
              <li key={i}>
                <strong>{ev.title}</strong> <br />
                📍 {ev.location} <br />
                📝 {ev.description}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>Fermer</button>
        </div>
      )}
    </div>
  );
};

export default App;
