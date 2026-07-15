import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

export default function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
 
    const CLIENT_ID = import.meta.env.VITE_SEATGEEK_CLIENT_ID;

    // ݁₊ ⊹ Using useEffect and async/await to fetch event data ⊹ . ݁˖ . ݁
    useEffect(() => {
        const fetchSingleEventDetails = async () => {
            try {
                const response = await fetch(`https://api.seatgeek.com/2/events/${id}?client_id=${CLIENT_ID}`);
                const data = await response.json();
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setLoading(false);
            }
        };
        fetchSingleEventDetails();
    }, [id, CLIENT_ID]);

    
    if (loading) {
        return <div className="loading">Digging up extra box office specs...</div>;
    }
    if (!event) {
        return <div className="no-results">Event not found.</div>;
    }

    const priceData = [
        {
            name: 'Ticket Price Range',
            'Lowest Price': event.stats?.lowest_price || 0,
            'Highest Price': event.stats?.highest_price || 0
        }
    ];

    return (
        <div className="event-view-container">
            <div className="detail-back-row">
                <Link to="/" className="back-btn">⬅️ Back to Performance List</Link>
            </div>

            <header className="detail-header">
               <span className="detail-badge">{(event.type || 'Show').replace('_', ' ')}</span>
               <h2>{event.title}</h2>
               <p className="subtitle">Hosted at {event.venue?.name_v2 || event.venue?.name}</p>
            </header>

            <section className="details-card-grid">
                <div className="detail-info-card">
                    <h4>🎟️ Ticket Inventory Metrics</h4>
                    <div className="detail-list">
                        <div className="detail-row">
                            <span className="detail-key">Listing Status</span>
                            <span className="detail-value">{event.status || 'Active'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Listing Count</span>
                            <span className="detail-value">{event.stats?.listing_count ?? 'Data Protected'} available seats</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Market Floor Price</span>
                            <span className="detail-value">{event.stats?.lowest_price ? `$${event.stats.lowest_price}` : 'Unavailable'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Premium Ceiling Price</span>
                            <span className="detail-value">{event.stats?.highest_price ? `$${event.stats.highest_price}` : 'Unavailable'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-info-card">
                    <h4>📍 Logistics & Venue Blueprint</h4>
                    <div className="detail-list">
                        <div className="detail-row">
                            <span className="detail-key">City Region</span>
                            <span className="detail-value">{event.venue?.city}, {event.venue?.state}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Postal Address</span>
                            <span className="detail-value">{event.venue?.address || 'TBD'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Venue Capacity Cap</span>
                            <span className="detail-value">{event.venue?.capacity?.toLocaleString() || 'Not Listed'} attendees</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Local Scheduling Coordinate</span>
                            <span className="detail-value">{new Date(event.datetime_local).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-info-card">
                    <h4>Public Tracking Attributes</h4>
                    <div className="detail-list">
                        <div className="detail-row">
                            <span className="detail-key">SeatGeek Scoring Index</span>
                            <span className="detail-value">{(event.popularity * 100).toFixed(1)} / 100</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Announced On</span>
                            <span className="detail-value">{event.announce_date ? new Date(event.announce_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Visible to Public</span>
                            <span className="detail-value">{event.visible_until_utc ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                    <a href={event.url} target="_blank" rel="noreferrer" className="buy-btn">
                        View Official Listings on SeatGeek
                    </a>
                </div>
            </section>

            <section className="detail-chart-card">
                <div className="detail-info-card chart-card-detail">
                    <h4>📊 Ticket Price Spectrum</h4>
                    {event.stats?.lowest_price || event.stats?.highest_price ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={priceData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="Lowest Price" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Highest Price" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="no-results" style={{ padding: '1rem' }}>Pricing spectrum data is currently unavailable for this listing.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
