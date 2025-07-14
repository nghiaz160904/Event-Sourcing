class PostCreated {
    constructor({ id, author, title, content, createdAt }) {
        this.type = 'PostCreated';
        this.aggregateId = id;
        this.payload = { author, title, content, createdAt };
    }
}

module.exports = { PostCreated };