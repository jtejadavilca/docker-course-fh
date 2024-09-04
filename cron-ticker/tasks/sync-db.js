let times = 0;
const syncDB = () => {
    console.log('Tick cada múltiplo de 5 segundos', ++times);
    return times;
};

let seg = 0;
const indicatorSyncDB = () => {
    console.log('Cada segundo...', ++seg);
    if(seg == 5 ){seg = 0;} 
}


module.exports = {
    syncDB,
    indicatorSyncDB
};