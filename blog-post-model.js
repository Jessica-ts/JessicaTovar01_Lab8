let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let BlogPostSchema = mongoose.Schema({
	id: {type: String},
	title: {type: String},
	content: {type: String},
	author: {type: String},
	publishDate: {type: String}

});

let BlogPosts = mongoose.model('BlogPosts', BlogPostSchema);

let BlogPostsList = {
	get : function(){
		return BlogPosts.find()
				.then( posts => {
					return posts;
				})
				.catch( err => {
					throw Error(err);
				});
	},

	getById: function(id) {
		return BlogPosts.findOne({"id": id})
			.then (post => {
				return posts
			})
			.catch (err => {
				throw Error(err)
			})
	},

	getByAuthor : function(author) {
        return BlogPosts.find({"author" : author})
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            });
    },

    post : function(newPost) {
        return BlogPosts.create(newPost)
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            });
    },

    deletePost : function(id) {
    	return BlogPosts.findOneAndRemove({"id":id})
			.then(posts => {

				return posts;

			})

			.catch(err => {

				throw Error(err);

			})
    },

    updatePost: function(updatePost) {
		return BlogPosts.findOneAndUpdate({id:updatePost.id}, {$set : updatePost}, {return:true})

			.then(newPost => {

				return newPost;

			})

			.catch(err => {

				throw Error(err);

			})

	}

};

module.exports = { BlogPostsList };