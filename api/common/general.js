const transformTeamsImportedInArrayIds = (arrayOfObject) => {
    const arragIds = arrayOfObject.map(t => t.id);
    return arragIds;
}
module.exports  = {
    transformTeamsImportedInArrayIds
}