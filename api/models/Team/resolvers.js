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
            const {name, tla, shortName, area: { name: areaName}, email } = t;
            teams.push({
                name,
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

const checkExistingTeams = async (teams, leagueCode) => {
    const teamsToUpdate = [];
    const teamsToSave = [];
    for await (let t of teams) {
        const exist = await Team.findOne({ name: { $eq: t.name } }).populate('leagues');
        if(exist) { 
            if(exist.leagues.length > 0) {
                exist.leagues.forEach(l => {
                    if(l.code === leagueCode) {
                        teamsToUpdate.push(t);
                    }
                }
                );
            }
        } else {
            teamsToSave.push(t);
        }
    }
    return { teamsToUpdate, teamsToSave };
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
        const {teamsToUpdate, teamsToSave } = await checkExistingTeams(teams, leagueCode);
        console.log(`Teams to save: ${teamsToSave.length}`);
        console.log(`Teams to upate: ${teamsToUpdate.length}`);
        if(teamsToSave.length > 0) {
            await Team.insertMany(teams, async (err, docs) => {
                        if (err) throw new Error(err.message);
                        const arrgOfIds = docs.map(d => d.id);
                        await League.findByIdAndUpdate(
                            leagueId,
                            { $push: { teams: arrgOfIds}},
                            { new: true, useFindAndModify: false }
                        )
                        return docs;
                    });
        }
        return true;
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