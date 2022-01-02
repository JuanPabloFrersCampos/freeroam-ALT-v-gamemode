import alt from 'alt-server';
import * as chat from 'chat';
import * as mongodb from '../database';

//Handles a player connection.

async function handleConnect (player) {
  console.log(player.name);
  const db = mongodb.getDataBase();
  
  const result = await db.findOne(
    'users', 'username', player.name
  );

  if (result){
    player.spawn(-1291.71, 83.43, 54.89, 1000); // Spawns after 1 second.
    player.model = `mp_m_freemode_01`;
    chat.broadcast(`Welcome back ${player.name}!`);
  }
  else{
    const newUser = await db.insertOne('users', {
      'username': player.name
    }).catch(err => console.log(`Error when creating newUser, error: ${err}`));
    player.spawn(-1291.71, 83.43, 54.89, 1000); // Spawns after 1 second.
    player.model = `mp_m_freemode_01`;
    chat.broadcast(`Welcome ${player.name} for very first time.`);
  }
};


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