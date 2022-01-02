/// <reference types="@altv/types-server" />

//Database initialization
import * as db from './database';
//Collections to be initialized with node
const dataBaseCollections = ['users'];
new db.Database('mongodb://localhost:27017', 'freeoram-gm', dataBaseCollections);

//Other modules initialization
import * as alt from 'alt-server';
import './user-commands';
import './main-events';

alt.log('Hello from server');