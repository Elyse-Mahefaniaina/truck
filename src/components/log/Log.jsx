import React, { useEffect } from "react";

import "./Log.scss";

const Eld = () => {

    const getDataDriving = () => {
        const data = JSON.parse(localStorage.getItem("data")).waypoints;

        let last_point = data[0]; 
        for (let i = 1; i < data.length; i++) {
            
        }
    }

    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem("data")));
    }, [])

    return (
        <div className="log-container">
            <div className="header">
                <div className="title-container">
                    <div className="title">Drivers Daily Log</div>
                    <div className="cycle">(24 Hours)</div>
                </div>
                <div className="date-container">
                    <div className="date-part-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">(month)</div>
                    </div>
                    <div className="date-part-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">(day)</div>
                    </div>
                    <div className="date-part-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">(years)</div>
                    </div>
                </div>
                <div className="wording-container">
                    <div className="mention">Original - File home terminal.</div>
                    <div className="duplicate">Driver retains in his/her possession for 8 days</div>
                </div>
            </div>
            <div className="pickup-dropoff-container">
                <div className="location-container">
                    <div className="label">From:</div>
                    <div className="input"><input type="text" /></div>
                </div>
                <div className="location-container">
                    <div className="label">To:</div>
                    <div className="input"><input type="text" /></div>
                </div>
            </div>
            <div className="about-container">
                <div className="truck-milleage-container">
                    <div className="info-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">Total miles Driving Today</div>
                    </div>
                    <div className="info-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">Total mileage Today</div>
                    </div>
                    <div className="info-container">
                        <div className="input"><input type="text" /></div>
                        <div className="label">
                            Truck/Tractor and Trailer Number or <br />
                            License Plate(s)/States(show each unit)
                        </div>
                    </div>
                </div>
                <div className="personal-info-container">
                    <div className="personnal-info-content">
                        <div className="input"><input type="text" /></div>
                        <div className="label">Name of carrier or carriers</div>
                    </div>
                    <div className="personnal-info-content">
                        <div className="input"><input type="text" /></div>
                        <div className="label">Main Office Address</div>
                    </div>
                    <div className="personnal-info-content">
                        <div className="input"><input type="text" /></div>
                        <div className="label">Home Terminal Address</div>
                    </div>
                </div>
            </div>
            <div className="graph-container">
                <div className="graph-content">
                    <div className="graph-header">
                        <div className="label-none"></div>
                        <div className="line-header">
                        {Array.from({ length: 25 }, (_, i) => {
                            let text = i;
                            if(i > 12) {
                                text = i - 12;
                            }
                            
                            if (i === 0 || i === 24) {
                                text = 'Mid-night'
                            }
                            if(i===12) {
                                text='Noon';
                            }  
                            return (
                                <div key={i}>
                                    {text}
                                </div>
                            );  
                        })}
                            <div className="total">Total hours</div>    
                        </div>
                    </div>
                    <div className="line-content">
                        <div className="label">1. Off Duty</div>
                        <div className="body">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div className="hour" key={i}>
                                <div className="quarter1"></div>
                                <div className="mid"></div>
                                <div className="quarter2"></div>
                            </div>
                        ))}
                            <div className="total"><input type="text" /></div>
                        </div>
                    </div>
                    <div className="line-content">
                        <div className="label">2. Sleeper Berth</div>
                        <div className="body">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div className="hour" key={i}>
                                <div className="quarter1"></div>
                                <div className="mid"></div>
                                <div className="quarter2"></div>
                            </div>
                        ))}
                            <div className="total"><input type="text" /></div>
                        </div>
                    </div>
                    <div className="line-content">
                        <div className="label">3. Driving</div>
                        <div className="body">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div className="hour" key={i}>
                                <div className="quarter1"></div>
                                <div className="mid"></div>
                                <div className="quarter2"></div>
                            </div>
                        ))}
                            <div className="total"><input type="text" /></div>
                        </div>
                    </div>
                    <div className="line-content">
                        <div className="label">4. On Duty</div>
                        <div className="body">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div className="hour" key={i}>
                                <div className="quarter1"></div>
                                <div className="mid"></div>
                                <div className="quarter2"></div>
                            </div>
                        ))}
                            <div className="total"><input type="text" /></div>
                        </div>
                    </div>
                    <div className="total-hours">
                        <input type="text" />
                    </div>
                </div>
            </div>
            <div className="remarks-container">
                <div className="remakrs-content">
                    <div className="names title">Remarks</div>
                    <div className="names docs">Shipping Documents:</div>
                    <div className="names manifest">DVL or Manifest No. or:</div>
                    <div className="names shipper">Shipper & Commodity:</div>
                    <div className="description">
                        Enter name of place you reported and where released from work and when and where each change og duty occured <br/>
                        Use Time standart of home terminal    
                    </div>
                </div>
            </div>
            <div className="infos-container">
                <div className="infos-content">
                    <div className="col recap">
                        <div className="top">
                            Recap:
                            Complete at <br/>
                            end of duty
                        </div>
                        <div className="info bottom"></div>
                    </div>
                    <div className="col infos">
                        <div className="line top"></div>
                        <div className="info bottom">
                            On duty hours. Total times 3 & 4
                        </div>
                    </div>
                    <div className="col cycle">
                        <div className="top">
                            70 Hour/ 8 Day Drivers
                        </div>
                        <div className="info bottom"></div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            A.
                        </div>
                        <div className="info bottom">
                            A. Total hours on duty last 7 days including today
                        </div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            B.
                        </div>
                        <div className="info bottom">
                            B. Total hours avalaible tomorrow 70hr minus A*
                        </div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            C.
                        </div>
                        <div className="info bottom">
                            C. Total hours on duty last 5 days including today
                        </div>
                    </div>
                    <div className="col cycle">
                        <div className="top">
                            60 Hour / 7 Day Drivers
                        </div>
                        <div className="info bottom"></div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            A.
                        </div>
                        <div className="info bottom">
                            A. Total hours on duty last 7 days including today
                        </div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            B.
                        </div>
                        <div className="info bottom">
                            B. Total hours avalaible tomorrow 60hr minus A*
                        </div>
                    </div>
                    <div className="col infos">
                        <div className="line top">
                            C.
                        </div>
                        <div className="info bottom">
                            C. Total hours on duty last 5 days including today
                        </div>
                    </div>
                    <div className="reset">
                        <p>
                            * If you took 34 consecutive hours off duty have 60/70 hours avalaible
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Eld;