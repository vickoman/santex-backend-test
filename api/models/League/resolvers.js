const League = require('./League');
const axios = require('axios');
const { LEAGUE_RESOURCE }  = require('../../config/constants');

const axiosGet = async (urlComplement) => {
    try {
        const response = await axios.get(`${process.env.FOOTBALL_API_URL}/${urlComplement}`,
            { headers: { 'X-Auth-Token': process.env.FOOTBALL_TOKEN } 
        });
        const {name, code, area: { name: areaName}} = response.data;
        return {
            name,
            code,
            areaName
        };
    }catch (err) {
        console.log(err.response.data.message);
        throw new Error(err.response.data.message);
    }

};
const importLeague = async (_, { leagueCode }, ctx) => {
    const league = await axiosGet(`${LEAGUE_RESOURCE}/${leagueCode}`);
    const leagueExists = await League.findOne({ code: league.code });
    if (leagueExists) {
        throw new Error(`League with code ${league.code} already exists`);
    }
    const newLeague = new League(league);
    await newLeague.save();
    return newLeague;
}

const getAllLeague = async () => {
    const leagues = await League.find();
    return leagues;
}

module.exports = {
    importLeague,
    getAllLeague
}