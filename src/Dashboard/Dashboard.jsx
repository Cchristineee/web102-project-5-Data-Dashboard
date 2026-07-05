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

    


}


