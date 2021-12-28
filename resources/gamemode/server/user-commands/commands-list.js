import * as chat from 'chat';

//Cmds for testing porpouses
// Uses the chat resource to register a command.
// Sends a chat message to the player with their position information.
chat.registerCmd('pos', (player, args) => {
  chat.send(player, `X: ${player.pos.x}, Y: ${player.pos.y}, Z: ${player.pos.z}`);

  // Sends to all players.
  chat.broadcast(`${player.name} is located at: ${player.pos.x}, Y: ${player.pos.y}, Z: ${player.pos.z}`);
});

//Force player invoicer death
chat.registerCmd('setHp', (player, args) => {
  if (args.length < 1 || isNaN(args[0])){
    return chat.send(player, 'Usage: /sethp 0-100');
  }
  const hpAmount = parseInt(args[0]);
  if (hpAmount < 0 || hpAmount > 100) return chat.send(player, 'Usage: /sethp min 0-100 max') ;
  
  player.health = hpAmount + 99;
});

//Give a weapon to cmd invoicer
chat.registerCmd('getRifle', player => {
  player.giveWeapon(0x9D1F17E6, 1000, true);
})