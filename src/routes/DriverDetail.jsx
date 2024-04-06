import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import '../App.css'

const DriverDetail = () => {
    let params = useParams();
    const [driverInfo, setDriverInfo] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
          const response = await fetch(`http://ergast.com/api/f1/drivers/${params.driverid}.json`);
          const json = await response.json();
          setDriverInfo(json.MRData.DriverTable.Drivers[0]);
          console.log(driverInfo);
        }
    
        fetchInfo().catch(console.error);
      }, []);

    return (
        <div>
            {driverInfo ? (
                <>
                    <h1>{driverInfo.givenName + " " + driverInfo.familyName}</h1>
                    <ul>
                        <li>Permanent Number: {driverInfo.permanentNumber}</li>
                        <li>Date of Birth: {driverInfo.dateOfBirth}</li>
                        <li>Nationality: {driverInfo.nationality}</li>
                        <li>
                            <a href={driverInfo.url}>Wikipedia Page</a>
                        </li>
                    </ul>
                </>
            ) : null }
        </div>
    );
}

export default DriverDetail;