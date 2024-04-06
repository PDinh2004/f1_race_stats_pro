import React from 'react';
import {useEffect, useState} from 'react';

const RaceInformation = ({race}) => {
    const [sessions, setSessions] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [raceSessionKey, setRaceSessionKey] = useState(0);

    useEffect(() => {
        const fetchSessions = async () => {
            const response = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${race.meeting_key}`);
            const json = await response.json();
            setSessions(json);
            for (let i = 0; i < sessions.length; i++) {
                if (sessions[i].session_type == "Race"){
                    setRaceSessionKey(sessions[i].session_key);
                    break;
                }
            }
        };

        const fetchDriverData = async () => {
            const response = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
            const json = await response.json();
            setDrivers(json);
            console.log(drivers);
        };

        fetchSessions();

        fetchDriverData();
    }, []);



    return (
        <div>
            <h1>{race.meeting_name}</h1>

            {drivers ? (drivers.map((driver) => 
                <div className='driverStats'>
                    <h3>{driver.broadcast_name}</h3>
                    <li>
                        {driver.team_name}
                    </li>
                </div>
            )
            ) : null}
        </div>
    );
};

export default RaceInformation;