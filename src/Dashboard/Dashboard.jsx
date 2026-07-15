import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import './Dashboard.css'

// . ݁₊ ⊹ Fetch events from the API ⊹ . ݁˖ . ݁
export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

// . ݁₊ ⊹ State for user input filters ⊹ . ݁˖ . ݁
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');

// . ݁₊ ⊹ Pulling the Client ID safely from my environment variables ⊹ . ݁˖ . ݁
    const CLIENT_ID = import.meta.env.VITE_SEATGEEK_CLIENT_ID;

// . ݁₊ ⊹ Using useEffect and async/await to fetch event data ⊹ . ݁˖ . ݁
    useEffect(() => {
        const fetchLiveEvents = async () => {
            try {
                // . ݁₊ ⊹ Safe Check ⊹ . ݁˖ . ݁
                if (!CLIENT_ID) {
                    console.error("SeatGeek Client ID is not set. Please check your environment variables.");
                    setLoading(false);
                    return;
                }
                const response = await fetch(`https://api.seatgeek.com/2/events?client_id=${CLIENT_ID}&per_page=100`);
                const data = await response.json();

                // . ݁₊ ⊹ Using a fallback empty array if the 'events' key is not present or undefined ⊹ . ݁˖ . ݁
                setEvents(data.events || []);
                setLoading(false);
            } catch (error) {
                console.error("Error connecting to SeatGeek API:", error);
                setLoading(false);
            }
        };

        fetchLiveEvents();
    }, [CLIENT_ID]);
   
    // . ݁₊ ⊹ Safe, crash-proof filtering ⊹ . ݁˖ . ݁
    const filteredEvents = (events || []).filter(event => {
        if (!event) return false; // Skip any empty items safely

        const titleText = event.title || event.short_title || '';
        const venueText = event.venue?.name || '';
        const eventType = event.type || '';

        const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                venueText.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedType === 'All' || eventType === selectedType;

        return matchesSearch && matchesCategory;
});

// 3 Unique Summary Stats calculated using the dynamically filtered array
const totalCount = filteredEvents.length;

const averagePopularity = totalCount > 0
    ? (filteredEvents.reduce((sum, item) => sum + (item.popularity || 0), 0) / totalCount) * 100
    : 0;
// . ݁₊ ⊹ Count of events in New York State ⊹ . ݁˖ . ݁
const eventsInNY = filteredEvents.filter(item => item.venue?.state === 'NY').length;

const categoryData = Object.entries(
    filteredEvents.reduce((acc, event) => {
        const type = (event.type || 'Other').replace(/_/g, ' ');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {})
).map(([type, count]) => ({ type, count }));

const priceTrendData = filteredEvents.slice(0, 10).map((event, index) => ({
    name: event.short_title?.slice(0, 20) || `Event ${index + 1}`,
    lowest: event.stats?.lowest_price || 0,
    popularity: event.popularity ? parseFloat((event.popularity * 100).toFixed(1)) : 0,
}));

if (loading) {
    return <div className="loading">Loading event data...</div>;
}

return (
    <div className="dashboard">
    <header className='dashboard-header'>
        <h1>TicketPulse: Event Dashboard</h1>
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
    <section className="controls-panel">
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

        <section className="charts-grid">
            <div className="chart-card">
                <h3>Event Categories</h3>
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={categoryData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#17233a" />
                            <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                            <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="no-results">No category data available yet.</p>
                )}
            </div>

            <div className="chart-card">
                <h3>Price & Popularity Snapshot</h3>
                {priceTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={priceTrendData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#17233a" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                            <Line type="monotone" dataKey="lowest" stroke="#4ade80" strokeWidth={3} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="popularity" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="no-results">No pricing snapshot available yet.</p>
                )}
            </div>
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
                    <Link key={event.id} className="data-row-link" to={`/event/${event.id}`}>
                        <div className="data-row">
                            <div className="feature-title">
                                <strong>{event.short_title}</strong>
                                <span className="badge">{(event.type || 'Other').replace('_', ' ')}</span>
                            </div>

                            <div className="feature-venue">
                                {event.venue?.name} • <small>{event.venue?.city}, {event.venue?.state}</small>
                            </div>

                            <div className="feature-price">
                                {event.stats?.lowest_price ? `$${event.stats.lowest_price}` : 'N/A'}
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="no-results">No events found.</div>
            )}
        </main>
    </div>
    );
}