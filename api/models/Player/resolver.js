const Player = require('./Player');
const Team = require('../Team/Team');
const League = require('../League/League');
const { TEAM_RESOURCE }  = require('../../config/constants');
const { axiosGet } = require('../../common/axiosHandler');
const { transformTeamsImportedInArrayIds } = require('../../common/general');

/**
 * Extract Players from API
 */
 const extractPlayers = async (teamCode, teamId) => {
    try {
        const getData = await axiosGet(`${TEAM_RESOURCE}/${teamCode}`);
        let players = [];
        if(Array.isArray(getData.squad) && getData.squad.length) {
            getData.squad.forEach(p => {
                const {name, position, id, dateOfBirth, nationality } = p;
                players.push({
                    name,
                    position: position || '',
                    code: id,
                    dateOfBirth: new Date(dateOfBirth) || '',
                    nationality: nationality || '',
                    countryOfBirth: nationality || '',
                    team: teamId
                });
            });
        }
        return players;
    } catch (err) {
        throw new Error(err.message);
    }
}
const getItemsToSave = async (players) => {
    const playersToSave = [];
    for await (let p of players) {
        const exist = await Player.findOne({ code: { $eq: p.code } })
        if(!exist) { 
            playersToSave.push(p);
        }
    }
    return playersToSave;
}

const importPlayers =  async(job) => {
    const { code, _id: teamId, name } = job.data.team;
    try {
        console.log(`JobId: ${job.id} started processing Team: ${name}`);
        const players = await extractPlayers(code, teamId);
        const playersToSave  = await getItemsToSave(players);
        console.log(`Players to save: ${playersToSave.length}`);
        if(!playersToSave.length > 0) {
            throw new Error(`There's no players to save in the team ${name}`);
        }
        const insertPlayers = await Player.insertMany(playersToSave);
        const arrgIds = transformTeamsImportedInArrayIds(insertPlayers);
        let team = await Team.findOne({ code });
        team.players = [...arrgIds];
        team.save();
        job.moveToCompleted('done', true)
        console.log(`TEAM QUEUE: PLAYERS OF TEAM: ${name.toUpperCase()}  ${arrgIds.length} players imported!`);
        console.log(`JobId: ${job.id} finished Team: ${name}`);
    } catch (err) {
        if(err.message === `There's no players to save in the team ${name}`){
            console.log(`TEAM QUEUE: PLAYERS OF TEAM: ${name.toUpperCase()}  0 players imported!`);
            job.moveToCompleted('done', true)
        } else {
            console.log(err.message);
            console.log(`JobId: ${job.id} Fails Team: ${name}`);
            job.moveToFailed({message: 'job failed'})
        }
    }

}

const getAllPlayers = async (_, {}, ctx) => {
    if(!ctx.user) throw new Error('You must be logged in');
    const Players = await Player.find({}).populate('team');
    return Players;
}

const getPlayersByLeague = async(_, {leagueCode}, ctx) => {
    if(!ctx.user) throw new Error('You must be logged in');
    try {
        const leagueExist = await League.findOne({ code: leagueCode});
        if(!leagueExist) throw new Error(`${leagueCode} is not present in the database`);
        const players = await Player.aggregate([
            {
                '$lookup': {
                    'from': 'teams',
                    'localField': 'team',
                    'foreignField': '_id',
                    'as': 'teams'
                },
            },
            {
                '$lookup': {
                    'from': 'leagues',
                    'localField': 'teams.leagues',
                    'foreignField': '_id',
                    'as': 'league'
                },
            },
            {
                '$match': {
                    'league.code': { '$eq': leagueCode }
                }
            },
            { 
                $addFields: { id: "$_id" }
            },
            {
            $project: { _id: 0 }
            }
        ]).exec();
        await Team.populate(players, {path: "team"});
        return players;
    } catch(err) {
        throw new Error(err.message);
    }
}

module.exports = {
    importPlayers,
    getAllPlayers,
    getPlayersByLeague
}
