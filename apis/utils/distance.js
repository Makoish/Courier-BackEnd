const axios = require('axios');

module.exports = async (source, destination) =>{
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY

    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        params: {
            origins: source,
            destinations: destination,
            key: API_KEY
        }
    });

    
    const ETA = response.data.rows[0].elements[0].duration.text
    const distance = response.data.rows[0].elements[0].distance.text
    
    let hours = 0
    try{
    hours = parseInt(ETA.match(/(\d+) hours/)[1])
    }
    catch(error){}

    let minutes = 0
    try{
    minutes = parseInt(ETA.match(/(\d+) mins/)[1])
    }
    catch (error){}

    
    let kms = 0
    try{
    kms = parseInt(distance.match(/(\d+(\.\d+)?) km/)[1])
    }

    catch(error){}

    if (hours !== undefined )
        minutes += hours * 60 


    return {"minutes": minutes, "distance": kms  }



}