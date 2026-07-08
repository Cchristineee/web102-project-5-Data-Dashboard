import { useState, useEffect } from 'react'
import './Dashboard.css'

// . ݁₊ ⊹ Fetch events from the API ⊹ . ݁˖ . ݁
export default function Dashboard() {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);

// . ݁₊ ⊹ State for user input filters ⊹ . ݁˖ . ݁
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedtype, setSelectedType] = useState('All');

// . ݁₊ ⊹ Pulling the Client ID safely from my environment variables ⊹ . ݁˖ . ݁
    const CLIENT_ID = import.meta.env.VITE_SEATGEEK_CLIENT_ID;

// . ݁₊ ⊹ Using useEffect and async/await to fetch event data ⊹ . ݁˖ . ݁
    useEffect(() => {
        const fetchLiveEvents = async () => {
            try {
                const response = await fetch(`https://api.seatgeek.com/2/events?client_id=${CLIENT_ID}&per_page=50`);
                const data = await response.json();

                setEvents(data.events || []);
                setLoading(false);
            } catch (error) {
                console.error("Error connecting to SeatGeek API:", error);
                setLoading(false);
            }
        };

        fetchLiveEvents();
    }, [CLIENT_ID]);

// . ݁₊ ⊹ Dynamically filtering the results based on user types/interacts ⊹ . ݁˖ . ݁
const fileredEvents = events.filter(event => {
    // . ݁₊ ⊹ Search Bar checks matching the text against Title or the Venue Name ⊹ . ݁˖ . ݁
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            event.venue.name.toLowerCase().includes(searchQuery.toLowerCase());

    // . ݁₊ ⊹ Category Filter to check different attributes (event types) ⊹ . ݁˖ . ݁
    const matchesCategory = selectedtype === 'All' || event.type === selectedtype;

    return matchesSearch && matchesCategory;
});

// 3 Unique Summary Stats calculated using the dynamically filtered array
const totalCount = fileredEvents.length;

const averagePopularity = totalCount > 0
? (filteredEvents.reduce((sum, item) => sum + item.averagePopularity || 0, 0) / totalCount) * 100
: 0;
// . ݁₊ ⊹ Count of events in New York State ⊹ . ݁˖ . ݁
const eventsInNY = filteredEvents.filter(item => item.venue.state === 'NY').length;

if (loading) {
    return <div className="loading">Loading event data...</div>;
}

return (
    <div className="dashboard">
    <header className='dashboard-header'>
        <h1>🎫 TicketPulse: Event Dashboard</h1>
        <p>Real-time analytics and booking insight aggregator</p>
    </header>

    {/* 3 Unique Summary Stats Pannels */}
    <section className="stats-container">
        <div className="stat-card">
            <h3>Total Events Available</h3>
            <p className="stat-number">{totalCount}</p>
        </div>

        <div className="stat-card">
            <h3>Average Buzz / Popularity</h3>
            <p className="stat-number">{averagePopularity.toFixed(1)}%</p>
        </div>

        <div className="stat-card">
            <h3>Events in NY</h3>
            <p className="stat-number">{eventsInNY}</p>
        </div>
    </section>
    
    {/* The Controls for the Search Bar and Categories */}
    <section className="controls-pannel">
        <input 
          type="text"
          className="search-input"
          placeholder="Search by artist, team or venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select 
            className="filter-dropdown"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
        >
            <option value="All">All Categories</option>
            <option value="Concert">Concert</option>
            <option value="nba">NBA Basketball</option>
            <option value="nfl">NFL Football</option>
            <option value="broadway_tickets">Broadway & Theater</option>
            <option value="comedy">Comedy</option>
        </select>
        </section>

        {/* Data layout mapping for at least 10 items (one per row) */}
        <main className="list-container">
           <div className="List-header-row">
            <span>Event & Performer</span>
            <span>Location</span>
            <span>Starting Price</span>
            </div>   

            {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    // . ݁₊ ⊹ Grid row template matching user elements dynamically via .map() ⊹ . ݁˖ . ݁
                    <div key={event.id} className="data-row">
                        <div className="feature-title">
                        <strong>{event.short_title}</strong>
                        <span className="badge">{event.type.replace('_', ' ')}</span>
                    </div>

                    <div className="feature-venue">
                        {event.venue.name} • <small>{event.venue.city}, {event.venue.state}</small>
                    </div>

                    <div className="feature-price">
                        {event.stats.lowest_price ? `$${event.stats.lowest_price}` : 'N/A'}
                    </div>
                </div>
                ))
            ) : (
                <div className="no-results">No events found.</div>
            )}
        </main>
    </div>
    );
}