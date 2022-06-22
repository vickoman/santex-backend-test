const League = require('./League');
const axios = require('axios');
const { LEAGUE_RESOURCE }  = require('../../config/constants');
const { importTeams } = require('../Team/resolvers');

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
    if(!ctx.user) throw new Error('You must be logged in');
    const getData = await axiosGet(`${LEAGUE_RESOURCE}/${leagueCode}`);
    const {name, code, area: { name: areaName}} = getData;
    const league = {
        name,
        code,
        areaName
    };
    let leagueSearched = await League.findOne({ code: league.code });
    if (!leagueSearched) {
        //throw new Error(`League with code ${league.code} already exists`);
        leagueSearched = new League(league);
        await leagueSearched.save();
    }
    await importTeams(leagueSearched.code, leagueSearched.id, ctx);

    const leagueUpdated = await League.findOne({ code: league.code }).populate('teams');
    return leagueUpdated;
}

const getAllLeague = async (_, {}, ctx) => {
    if(!ctx.user) throw new Error('You must be logged in');
    const leagues = await League.find().populate('teams');
    return leagues;
}

module.exports = {
    importLeague,
    getAllLeague
}