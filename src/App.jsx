import { useState, useEffect } from 'react'
import './App.css'
import { Link } from "react-router-dom";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList} from 'recharts';

function App() {
  const [standings, setStandings] = useState(null);
  const [raceYear, setRaceYear] = useState("2023");
  const [team, setTeam] = useState("");
  const [driver, setDriver] = useState("");
  const [wins, setWins] = useState("-999");
  const [points, setPoints] = useState("-999");

  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await fetch(`http://ergast.com/api/f1/${raceYear}/driverStandings.json`);
      const json = await response.json();
      setStandings(json.MRData.StandingsTable.StandingsLists[0].DriverStandings);
      console.log(standings);

    }

    fetchMeetings().catch(console.error);
  }, [raceYear]);

  const generateBarChart = () => {
    let data1 = {};

    for (let i = 0; i < standings.length; i++) {
      if (data1[standings[i].Driver.nationality] === undefined) {
        data1[standings[i].Driver.nationality] = {points: parseInt(standings[i].points), numOfPpl: 1};
      } else {
        data1[standings[i].Driver.nationality].points += parseInt(standings[i].points);
        data1[standings[i].Driver.nationality].numOfPpl += 1;
      };
    }

    let data = [];

    for (const [key, value] of Object.entries(data1)) {
      data.push({nationality: key, points: value.points, numOfPpl: value.numOfPpl});
    }

    return (
      <ResponsiveContainer width={'100%'} height={500}>
        <BarChart
          width={1500}
          height={500}
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          style={{color: "black"}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nationality"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="points" stackId="a" fill="pink">
            <LabelList dataKey="numOfPpl" position="insidetop"/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  const calculateAverage = (standings) => {
    let totalPoints = 0;

    for (let i = 0; i < standings.length; i++) {
      totalPoints += parseInt(standings[i].points);
    }

    return Math.round((totalPoints / standings.length)*100) / 100;
  }

  const zeroPointDrivers = (standings) => {
    let zeroPointDrivers = 0;

    for (let i = 0; i < standings.length; i++) {
      if (parseInt(standings[i].points) === 0) {
        zeroPointDrivers++;
      }
    }

    return zeroPointDrivers;
  }

  const createList = (standings, team, person, wins, points) => {
    return (standings ? (standings.map((driver) =>  
      ((driver.Driver.givenName+" "+driver.Driver.familyName).toLowerCase().includes(person.toLowerCase()) || person === "") 
      && 
      (team === "" || driver.Constructors[0].name.toLowerCase().includes(team.toLowerCase()))
      &&
      (wins === "-999" || parseInt(driver.wins) === parseInt(wins))
      &&
      (points === "-999" || parseInt(driver.points) === parseInt(points))
      ? (
      <>
        <Link
          style={{color: "white"}}
          to={`/driver/${driver.Driver.driverId}`}
          key={driver.Driver.driverId}
        >
          <h2>{driver.Driver.givenName} {driver.Driver.familyName}</h2>
        </Link>
        <h2>{driver.Constructors[0].name}</h2>
        <h2>{driver.points}</h2>
        <h2>{driver.wins}</h2>
      </>
      ) : null)
      ) : null
    )
  }

  return (
    <div className='appContainer'>
      <h1>F1 Race Stats</h1>
      <h3>Year is {raceYear}</h3>

      <input type='text' placeholder='Enter a year (1950-2024)' style={{width: "15%"}}/>
      <button onClick={() => {
        setRaceYear(document.querySelector('input').value);
      }} style={{color: "white"}}>Search</button>

      <h1>Season Statistics</h1>
      <div className='information'>
        <h2>Number of Drivers: {standings ? standings.length : null}</h2>
        <h2>Average Points Per Driver: {standings ? calculateAverage(standings) : null}</h2>
        <h2># of Zero Point Driver(s): {standings ? zeroPointDrivers(standings) : null}</h2>
      </div>

      <h3>Points per Nationality</h3>
      <p>Number inside the bars represent the number of drivers in those nationalities</p>
      {standings ? generateBarChart() : null}
      

      <h1>Driver's Standings</h1>

      <div className='searchData'>
        <input type='text' placeholder='Search Driver' onChange={(e) => setDriver(e.target.value)}/>
        <input type='text' placeholder='Search Team' onChange={(e) => setTeam(e.target.value)}/>
        <input type='text' placeholder='Search Points' onChange={(e) => {e.target.value == "" ? setPoints("-999") : setPoints(e.target.value)}}/>
        <input type='text' placeholder='Search Wins' onChange={(e) => {e.target.value == "" ? setWins("-999") : setWins(e.target.value)}}/>
      </div>

      <div className='driversInfoGrid'>
        <h2>Driver Name</h2>
        <h2>Constructor</h2>
        <h2>Points</h2>
        <h2>Wins</h2>

        {createList(standings, team, driver, wins, points)}
      </div>
      
    </div> 
  )
}

export default App;
