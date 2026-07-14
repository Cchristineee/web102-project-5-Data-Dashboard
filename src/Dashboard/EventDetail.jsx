import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import './Dashboard.css'

export default function EventDetail() {
    // ݁₊ ⊹ Using useParams to get the event ID from the URL ⊹ . ݁˖ . ݁
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
 
    const ClIENT_ID = import.meta.env.VITE_SEATGEEK_CLIENT_ID;
    
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

    if (loading) return 
    <div className="loading">Digging up extra box office specs...</div>;
    if (!event) return <div className="no-results">Event not found.</div>;

    return (
        <div className="event-view-container">
            <Link to="/" className="back-btn">⬅️ Back to Performance List</Link>

            <header className="detail-header">
               <span className="detail-badge">{(event.type || 'Show').replace('_', ' ')}</span>
               <h2>{event.title}</h2>
               <p className="subtitle">Hosted at {event.venue?.name_v2 || event.venue?.name}</p>
            </header>

            <section className="details-card-grid">
                <div className="detail-info-card">
            <h4>🎟️ Ticket Inventory Metrics</h4>
                <ul>
                    <li><strong>Listing Status:</strong> {event.status || 'Active'}</li>
                    <li><strong>Listing Count:</strong> {event.stats?.listing_count ?? 'Data Protected'} available seats</li>
                    <li><strong>Market Floor Price:</strong> {event.stats?.lowest_price ? `$${event.stats.lowest_price}` : 'Unavailable'}</li>
                    <li><strong>Premium Ceiling Price:</strong> {event.stats?.highest_price ? `$${event.stats.highest_price}` : 'Unavailable'}</li>
                </ul>
            </div>

            <div className="detail-info-card">
            <h4>📍 Logistics & Venue Blueprint</h4>
                <ul>
                    <li><strong>City Region:</strong> {event.venue?.city}, {event.venue?.state}</li>
                    <li><strong>Postal Address:</strong> {event.venue?.address || 'TBD'}</li>
                    <li><strong>Venue Capacity Cap:</strong> {event.venue?.capacity?.toLocaleString() || 'Not Listed'} attendees</li>
                    <li><strong>Local Scheduling Coordinate:</strong> {new Date(event.datetime_local).toLocaleString()}</li>
                </ul>
            </div>

            <div className="detail-info-card">
            <h4>Public Tracking Attributes</h4>
                <ul>
                    <li><strong>SeatGeek Scoring Index:</strong> {(event.popularity * 100).toFixed(1)} / 100</li>
                    <li><strong>Announced On:</strong> {event.announce_date ? new Date(event.announce_date).toLocaleDateString() : 'N/A'}</li>
                    <li><strong>Visible to Public:</strong> {event.visible_until_utc ? 'Yes' : 'No'}</li>
                </ul>
                <a href={event.url} target="_blank" rel="noreferrer" className="buy-btn">
                View Official Listings on SeatGeek</a>
            
            </div>
            </section>
        </div>
    );
}
