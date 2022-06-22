const axios = require('axios');

/**
 *  axiosGet get generic data from Get Endpoints
 * @param {*} urlComplement 
 * @returns Objec { response.data}
 */
 const axiosGet = async (urlComplement) => {
    try {
        const response = await axios.get(`${process.env.FOOTBALL_API_URL}/${urlComplement}`,
            { headers: { 'X-Auth-Token': process.env.FOOTBALL_TOKEN } 
        });
        return response.data;
    }catch (err) {
        console.log(err.response.data.message);
        throw new Error(err.response.data.message);
    }

};

module.exports = {
    axiosGet
}