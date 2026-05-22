import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './VestDetection.css';

export default function VestDetection() {
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: 'John Doe',
      dept: 'Logistics',
      loc: 'Loading Bay B-4',
      time: '10:45 AM',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      handled: false,
    },
    {
      id: 2,
      name: 'Unknown Worker',
      dept: 'Production',
      loc: 'Assembly Area 2',
      time: '09:30 AM',
      img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop',
      handled: false,
    },
    {
      id: 3,
      name: 'Michael Chen',
      dept: 'Safety Compliance',
      loc: 'Chemical Storage',
      time: '08:15 AM',
      img: 'https://images.unsplash.com/photo-1581092921461-eab10380bee1?q=80&w=1000&auto=format&fit=crop',
      handled: true,
    }
  ]);

  const handleMarkHandled = (id) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, handled: true } : w));
    alert(`Alert for worker resolved!`);
  };

  const activeAlerts = workers.filter(w => !w.handled).length;
  const handledCount = workers.filter(w => w.handled).length;

  return (
    <div className="vest-detection-wrapper">
      {/* Main */}
      <header className="topbar">
        <h2>Vest Detection</h2>

        <div className="top-icons">
          <i className="fa-regular fa-bell" style={{ cursor: 'pointer' }}></i>
          <i className="fa-solid fa-ellipsis-vertical" style={{ cursor: 'pointer' }}></i>
        </div>
      </header>

      {/* Stats */}
      <section className="stats">
        <div className="box">
          <h4>Active Alerts</h4>
          <h1>{activeAlerts}</h1>
        </div>

        <div className="box">
          <h4>Total Today</h4>
          <h1>12</h1>
        </div>

        <div className="box">
          <h4>Handled</h4>
          <h1>{handledCount}</h1>
        </div>

        <div className="box">
          <h4>Compliance</h4>
          <h1>94%</h1>
        </div>
      </section>

      {/* Stream */}
      <section className="stream">
        <h2>Live Detection Stream</h2>

        <div className="stream-grid">
          {workers.map((worker) => (
            <div className="stream-card" key={worker.id}>
              <img src={worker.img} alt={worker.name} />

              <div className="stream-content">
                <h3>{worker.name}</h3>
                <p>{worker.dept}</p>

                <div className="time">
                  <span>{worker.loc}</span>
                  <span>{worker.time}</span>
                </div>

                {worker.handled ? (
                  <button className="gray" disabled>
                    No Actions Required
                  </button>
                ) : (
                  <button onClick={() => handleMarkHandled(worker.id)}>
                    Mark as Handled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
