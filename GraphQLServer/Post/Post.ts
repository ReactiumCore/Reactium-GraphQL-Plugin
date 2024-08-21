import { db } from '../Data/Db.ts';
import { ObjectId } from 'mongo.ts';
import { User } from '../User/User.ts';

export type PostRecord = {
    _id?: ObjectId;
    authorId?: ObjectId;
    title: string;
    body: string;
    published?: boolean;
};

export class Post {
    id?: ObjectId;
    authorId?: ObjectId;
    author?: User;
    title: string;
    body: string;
    published?: boolean;

    constructor({ _id, authorId, title, body, published = true }: PostRecord) {
        this.id = _id && new ObjectId(_id);
        this.title = title;
        this.body = body;
        this.published = published;
        this.authorId = authorId && new ObjectId(authorId);
    }

    static collection = db.collection('Post');

    async loadAuthor() {
        if (this.authorId) {
            const author = await User.load(this.authorId.toHexString());
            if (author) this.author = author;
        }

        return this;
    }

    async save() {
        let rec;
        if (this.id) {
            await Post.collection.updateOne(
                { _id: new ObjectId(this.id) },
                { $set: this },
            );
            rec = {};
        } else {
            rec = await Post.collection.insertOne(this);
        }

        if (this.id) rec._id = this.id;
        const saved = new Post({ ...this, ...rec });

        Object.assign(this, saved);

        await this.loadAuthor();

        return saved;
    }

    static async find(query?: any) {
        const records = await Post.collection.find(query).toArray();
        return Promise.all(
            records.map(async (record) => {
                const post = new Post(record as PostRecord);
                await post.loadAuthor();
                return post;
            }),
        );
    }

    static async load(_id: string) {
        const record = await Post.collection.findOne({
            _id: new ObjectId(_id),
        });
        if (typeof record == 'undefined') return null;
        const post = new Post(record as PostRecord);
        await post.loadAuthor();
        return post;
    }

    static async delete(_id: string) {
        return await Post.collection.deleteOne({ _id: new ObjectId(_id) });
    }
}
