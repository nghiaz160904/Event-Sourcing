class CreatePostCommand {
    constructor({ author, title, content }) {
        this.author = author;
        this.title = title;
        this.content = content;
    }
}

module.exports = CreatePostCommand;