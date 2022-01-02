//I HIGHLY based on simplymongo npm package >> https://www.npmjs.com/package/simplymongo
import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

//Will contain a DB copy, once initialized and connected.
let instance = null;

//Function that will return a DB copy if conditions are accomplished.
export function getDataBase(){
  if (!instance){
    throw new Error('Initialize and connect to a DB first.');
  }
  else return instance;
}

export class Database{
  /**
   * 
   * @param {string*} url e.g for local connection: mongodb://localhost:27017
   * @param {string} databasename Database name
   * @param {Array <string>} collections Collections to be created
   * @param {string || null} username Optional
   * @param {string || null} password Optional
   */
  constructor (url, databasename, collections = [], username = null, password = null){
    this.client = null;
    this.collections = collections;
    this.databasename = databasename;

    if (username && password){
      const client = new MongoClient(url,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        auth: {
          user: username,
          password: password,
        }
      });
    }
    else{
      const client = new MongoClient(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    this.connectToDataBase();
  };

  async connectToDataBase(){
    // Connect to the MongoDB cluster
    await this.client.connect().catch(e => {
      console.log('[DATABASE] Failed to connect to DB. Log error:');
      console.log(e);
      console.log('Finishing program with code 1.');
      process.exit(1);
    });
    
    this.db = this.client.db(this.databasename);
    this.generateCollections();
    instance = this;
  }

  async generateCollections(){
    if (this.collections.length < 1){
      console.log(`[DATABASE] No collections were specified for creation.`);
      return;
    }
  
  const collectionCursor = this.db.listCollections();
  const collections = await collectionCursor.toArray();
  let totalCollections = collections.length;


  }
}