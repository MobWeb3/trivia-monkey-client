import { GameSession } from '../game-domain/GameSession';
import *  as  Realm from "realm-web";

// Define an interface representing a session document in MongoDB.
export interface ISession extends Document, GameSession { }

// Mongo db
// Add your App ID
const app = new Realm.App({ id: import.meta.env.VITE_MONGODB_APP_ID });

class SessionConnection {

  private static instance: globalThis.Realm.Services.MongoDB.MongoDBCollection<any> | undefined;

  private static changeStream: AsyncGenerator | null = null;

  private constructor() {
    // Private constructor to prevent direct construction calls
  }

  public static async getInstance() {
    if (!SessionConnection.instance) {
      const MONGO_URL = import.meta.env.VITE_MONGODB_URL ?? '';

      SessionConnection.instance =  await SessionConnection.connectAndCreateInstance(MONGO_URL, "monkey-trivia");
    }
    return SessionConnection.instance;
  }

  // Read a session by ID
  public static async getSession(sessionId: string): Promise<ISession | null> {
    const collection = await SessionConnection.getInstance();
    return await collection?.findOne({ sessionId });
  }

  // // On watch for changes to a session by ID
  public static async watchSession(sessionId: string, callback: (session: ISession) => void) {
    const session = await SessionConnection.getSession(sessionId);
    if (session) {
      callback(session);
    }
    const collection = await SessionConnection.getInstance();

    if (!collection) throw new Error("Collection not found");

    interface MyChangeEvent {
      documentKey: { _id: string };
      fullDocument: ISession;
      // Include other properties as needed
    }

    this.changeStream = collection.watch({
      filter: { "fullDocument.sessionId": sessionId },
    });

    for await (const change of this.changeStream)  {
      const { fullDocument } = change as unknown as MyChangeEvent;

      // if (documentKey._id === sessionId) {
        console.log("changed!", change)
        console.log("fullDocument", fullDocument)
      //   callback(change.fullDocument);
      // }
    };
  }

  public static stopWatchingSession() {
    this.changeStream = null;
  }

  // Static method to create an instance
  static async connectAndCreateInstance(dbUrl: string, dbName: string) {
    // Create an anonymous credential
    const credentials = Realm.Credentials.apiKey(import.meta.env.VITE_MONGODB_API_KEY);
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    console.log("Logged in with user id:", user.id);
    // Connect to the database
    const mongodb = app?.currentUser?.mongoClient('monkey-trivia');
    const collection = mongodb?.db("monkey-trivia").collection("Session");

    // console.log("collection", collection);

    // const getONe = await collection?.findOne({ sessionId: "mk-pbid-8f199b67-debc-4210-a327-43505d86a91d" });

    // console.log("getONe", getONe);
    return collection;
  }
}

export default SessionConnection;