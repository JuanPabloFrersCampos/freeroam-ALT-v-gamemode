//I HIGHLY based on simplymongo npm package >> https://www.npmjs.com/package/simplymongo
import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

//Will contain a DB copy, once initialized and connected to the db.
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
   * @param {string} url e.g for local connection: mongodb://localhost:27017
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
      this.client = new MongoClient(url,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        auth: {
          user: username,
          password: password,
        }
      });
    }
    else{
      this.client = new MongoClient(url,{
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
    //If no collections as parameters were passed to Class Constructor
    if (this.collections.length < 1){
      console.log(`[DATABASE] No collections were specified for creation.`);
      return;
    }
  
    //Creates pointers (cursor) to the different collections already created in the DB.
    const collectionCursor = this.db.listCollections();
    //Converts the cursors to an array.
    const collections = await collectionCursor.toArray();
    let totalCollections = collections.length;
    
    //If no collections were already created, then create all of them and return.
    if (collections.length <= 0) {
      for (let i = 0; i < this.collections.length; i++) {
          const collectionName = this.collections[i];
          this.db.createCollection(collectionName);
          console.log(`[DATABASE] #1 Created new collection '${collectionName}'`);
      }

      console.log(`[DATABASE] #2 Connection Complete! Utilizing ${totalCollections} collections.`);
      return;
    }

    //Stores in collectionsNotFound the collections to be created in the DB.
    const collectionsNotFound = this.collections.filter((collectionName) => {
      return !collections.find((existingData) => existingData && existingData.name === collectionName);
    });

    //If the all collections were already created in the DB, then it returns.
    if (collectionsNotFound.length <= 0) {
      console.log(`[DATABASE] #3 Connection Complete! Utilizing ${totalCollections} collections.`);
      return;
    }

    //If one or more collections were not created in the DB, then it will be created.
    for (let i = 0; i < collectionsNotFound.length; i++) {
      const collectionName = collectionsNotFound[i];
      const newCollection = this.db.createCollection(collectionName);
      console.log(`[DATABASE] #4 Created new collection '${collectionName}'`);
    }

    console.log(
      `[DATABASE] #5 Connection Complete! Utilizing ${totalCollections + collectionsNotFound.length} collections.`
    );
  }
}