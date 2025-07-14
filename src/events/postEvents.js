class PostCreated {
    constructor({ id, author, title, content, createdAt }) {
        this.type = 'PostCreated';
        this.aggregateId = id;
        this.payload = { author, title, content, createdAt };
    }
}
class PostDeleted {
    constructor({ id, deletedAt }) {
        this.type = 'PostDeleted';
        this.aggregateId = id;
        this.payload = { deletedAt };
    }
}
module.exports = { PostCreated, PostDeleted };