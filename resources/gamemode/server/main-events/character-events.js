import alt from 'alt-server';
import * as chat from 'chat';
import * as mongodb from '../database';
const db = mongodb.getDataBase();

//Handles a player connection.
async function handleConnect (player) {
  const account = await db.fetchData('username', player.name, 'users');
  console.log(account)
  
  //Finds a document with username == player.name
  const result = await db.findOne(
    'users', 'username', player.name
  );
  
  //If the document is found, the player is spawned.
  if (result){
    console.log('1')
    handleSpawn(account, player, false);
  }
  //If not, a document with player info is created, and after is spawned.
  else{
    console.log('2')
    await db.insertOne('users', {'username': player.name})
    .catch(err => console.log(`Error when creating newUser, error: ${err}`));

    handleSpawn(account, player, true);
  }
};

const handleSpawn = (accountInfo, player, firstTimeConnection) => {
  console.log(`is: ${firstTimeConnection}`)
  player.spawn(-1291.71, 83.43, 54.89, 1000); // Spawns after 1 second.
  player.data = accountInfo;
  player.model = `mp_m_freemode_01`;
  if (firstTimeConnection){
    chat.broadcast(`Welcome ${player.name} for very first time.`)
  }
  else chat.broadcast(`Welcome back ${player.name}!`);
}

export var deadPlayers = {};
const timeBetweenRespawn = 5000;

const handleDeath = player => {
  console.log(player);
  if (deadPlayers[player.id]){
    return;
  }

  deadPlayers[player.id] = true;
  setTimeout( () => {
    if (deadPlayers[player.id]){
      delete deadPlayers[player.id];
    }

    if (!player || !player.valid){
      return;
    }

    handleConnect(player);
  }, timeBetweenRespawn);
}

alt.on('playerConnect', handleConnect);
alt.on('playerDeath', handleDeath);