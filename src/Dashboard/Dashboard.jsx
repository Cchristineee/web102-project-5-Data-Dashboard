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

}