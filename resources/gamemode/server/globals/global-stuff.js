import * as alt from 'alt-server';
import * as mongodb from '../database';
const db = mongodb.getDataBase();

alt.Player.prototype.saveField = async function(fieldName, fieldValue, sync = false) {
  if (sync) {
      this.setSyncedMeta(fieldName, this.data[fieldName]);
  }

  await db.updateField('users', this.player, { [fieldName]: fieldValue });
}