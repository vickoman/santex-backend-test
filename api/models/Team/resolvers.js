const Team = require('./Team');
const League = require('../League/League');
const { LEAGUE_RESOURCE }  = require('../../config/constants');
const { axiosGet } = require('../../common/axiosHandler');

/**
 * Extract Teams from API
 */
const extractTeams = async (leagueCode, leagueId) => {
    try {
        const getData = await axiosGet(`${LEAGUE_RESOURCE}/${leagueCode}/teams`);
        let teams = [];
        getData.teams.forEach(t => {
            const {name, tla, id, shortName, area: { name: areaName}, email } = t;
            teams.push({
                name,
                code: id,
                tla,
                shortName,
                areaName,
                email,
                leagues: [leagueId]
            });
        });
        return teams;
    } catch (err) {
        throw new Error(err.message);
    }
}

const getItemsToSave = async (teams) => {
    const teamsToSave = [];
    for await (let t of teams) {
        const exist = await Team.findOne({ name: { $eq: t.name } }).populate('leagues');
        if(exist) { 
            throw new Error(`Team with name: ${t.name} already exists`);
        } else {
            teamsToSave.push(t);
        }
    }
    return teamsToSave;
}
/**
 *  importLeague import a league from football api
 * @param {*} leeagueCode 
 * @param {*} ctx 
 * @returns 
 */
const importTeams = async (leagueCode, leagueId, ctx) => {
    try {
        if(!ctx.user) throw new Error('You must be logged in');
        const teams = await extractTeams(leagueCode, leagueId);
        const teamsToSave  = await getItemsToSave(teams);
        console.log(`Teams to save: ${teamsToSave.length}`);
        if(!teamsToSave.length > 0) {
            throw new Error('There no teams to save in the league');
        }
        const insertManyResult = await Team.insertMany(teams);
        return insertManyResult;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

const getAllTeams = async (_, {}, ctx) => {
    if(!ctx.user) throw new Error('You must be logged in');
    const Teams = await Team.find({}).populate('leagues');
    return Teams;
}

module.exports = {
    importTeams,
    getAllTeams
}