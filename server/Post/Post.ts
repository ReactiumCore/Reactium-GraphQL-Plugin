import { db } from "../Data/Db.ts";
import { ObjectId } from "mongo.ts";

type PostRecord = {
  _id?: ObjectId;
  title: string;
  body: string;
  published?: boolean;
};

export class Post {
  constructor({ _id, title, body, published = true }: PostRecord) {
    this.id = _id;
    this.title = title;
    this.body = body;
    this.published = published;
  }

  id?: ObjectId;
  title: string;
  body: string;
  published?: boolean;

  static collection = db.collection("Post");

  async save() {
    let rec;
    if (this.id) {
      rec = await Post.collection.updateOne({ _id: this.id }, { $set: this });
    } else {
      rec = await Post.collection.insertOne(this);
    }

    const saved = new Post({ ...this, ...rec });
    Object.assign(this, saved);
    return saved;
  }

  static async find(query?: any) {
    const records = await Post.collection.find(query).toArray();
    return records.map((record) => new Post(record as PostRecord));
  }

  static async load(_id: string) {
    const record = await Post.collection.findOne({ _id: new ObjectId(_id) });
    if (typeof record == "undefined") return null;
    return new Post(record as PostRecord);
  }
}
