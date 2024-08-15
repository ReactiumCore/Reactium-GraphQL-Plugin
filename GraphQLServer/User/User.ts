import { db } from "../Data/Db.ts";
import { ObjectId } from "mongo.ts";

type UserRecord = {
  _id?: ObjectId;
  name: string;
  email: string;
  age?: number;
};

export class User {
  constructor({ _id, name, email, age }: UserRecord) {
    this.id = _id;
    this.name = name;
    this.email = email;
    this.age = age;
  }

  id?: ObjectId;
  name: string;
  email: string;
  age?: number;

  static collection = db.collection("User");

  async save() {
    let rec;
    if (this.id) {
      rec = await User.collection.updateOne({ _id: this.id }, { $set: this });
    } else {
      rec = await User.collection.insertOne(this);
    }

    const saved = new User({ ...this, ...rec });
    Object.assign(this, saved);
    return saved;
  }

  static async find(query?: any) {
    const records = await User.collection.find(query).toArray();
    return records.map((record) => new User(record as UserRecord));
  }

  static async load(_id: string) {
    const record = await User.collection.findOne({ _id: new ObjectId(_id) });
    if (typeof record == "undefined") return null;
    return new User(record as UserRecord);
  }

  static async delete(_id: string) {
    return await User.collection.deleteOne({ _id: new ObjectId(_id) });
  }
}
