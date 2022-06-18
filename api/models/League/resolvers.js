const League = require('./League');
const axios = require('axios');
const { LEAGUE_RESOURCE }  = require('../../config/constants');

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

/**
 *  importLeague import a league from football api
 * @param {*} leeagueCode 
 * @param {*} ctx 
 * @returns 
 */
const importLeague = async (_, { leagueCode }, ctx) => {
    const getData = await axiosGet(`${LEAGUE_RESOURCE}/${leagueCode}`);
    const {name, code, area: { name: areaName}} = getData;
    const league = {
        name,
        code,
        areaName
    };
    const leagueExists = await League.findOne({ code: league.code });
    if (leagueExists) {
        throw new Error(`League with code ${league.code} already exists`);
    }
    const newLeague = new League(league);
    await newLeague.save();
    return newLeague;
}

const getAllLeague = async (_, {}, ctx) => {
    if(!ctx.user) throw new Error('You must be logged in');
    const leagues = await League.find();
    return leagues;
}

module.exports = {
    importLeague,
    getAllLeague
}