exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ 
            title: 'First Post', 
            content: 'This is the First Post'
        }]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: 'Post created Successfully',
        post: { 
            id: new Date().getTime(), 
            title: title, 
            content: content
        }
    });
};