/// <reference types="@altv/types-server"/>

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//Database initialization
import * as mongodb from './database';

const dataBaseCollections = ['users'];

const initialize = async () => {
  const db = new mongodb.Database('mongodb://localhost:27017', 'freeoram-gm', dataBaseCollections);
  await db.connectToDataBase();
  await db.generateCollections();
  //require('./globals');
  //import './main-events';
  
  //import './user-commands';
}

initialize();
import './globals';