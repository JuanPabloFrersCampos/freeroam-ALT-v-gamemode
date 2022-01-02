/// <reference types="@altv/types-server" />
//Database initialization
import './database';

//"Static" modules
import * as alt from 'alt-server';
import './user-commands';
import './main-events';

alt.log('Hello from server');