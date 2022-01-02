/// <reference types="@altv/types-server" />
//Database initialization
import * as db from './database';
const dataBaseCollections = [];
new db.Database('mongodb://localhost:27017', 'freeoram-gm', dataBaseCollections);

//"Static" modules
import * as alt from 'alt-server';
import './user-commands';
import './main-events';

alt.log('Hello from server');