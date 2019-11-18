let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');
let uuid = require('uuid/v4');
let { BlogPostsList } = require('./blog-post-model');
const { DATABASE_URL, PORT } = require('./config');

let mongoose = require('mongoose');
let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;


app.use(express.static('public'));
app.use(morgan("dev"));

app.get("/api/blog-posts", (req, res, next) => {
    BlogPostsList.get()
        .then(posts => {
            return res.status(200).json(posts)
        })
        .catch(error => {
            res.statusMessage = "Something went wrong with the DB. Try it again later."
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try it again later."
            })
        })
});


app.get("/api/blog-posts", (req,res, next) => {
    let author = req.query.author;
 
    if(!author) 
    {
        res.statusMessage = "Missing author!";
        return res.status(406).json({
            message : "Missing author!",
            status : 406
        });
    }

    BlogPostsList.getByAuthor(author)
        .then(posts => {
            if(posts) 
            {
                return res.status(200).json(posts);
            } 
            else 
            {
                res.statusMessage = "Author not found";
                return res.status(404).json({
                    message: "Author not found", 
                    status: 404});
            }
        })

        .catch(error => {
            res.statusMessage = "Something went wrong with the DB. Try it again later"
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try it again later"
            })
        })

});



app.post("/api/blog-posts", jsonParser, (req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;
   

    if (title == "" || content == "" || author == "" || date == "") {
        res.statusMessage = "Query not complete!";
        return res.status(406).json({
            message : "Query not complete!",
            status : 406
        });
    }

    let newPost=
    {
    	id : uuid(),
    	title : title,
    	content : content,
    	author : author,
    	publishDate : date,
	};
    
    BlogPostsList.post(newPost)
        .then(posts => {
            return res.status(201).json(posts);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrongwith the DB. Try again later."
            })
        });
});

app.delete("/api/blog-posts/:id", (req, res) => 
{
	let idauthor = req.params.id;
	BlogPostsList.deletePost(idauthor)
   
    .then(posts => {
        if (post) 
        {
            return res.status(200).json(posts)
        } 
        else 
        {
            res.statusMessage = "Post not found"
            return res.status(404).json({
                message: "Post not found",
                status: 404
                })
            }
        })
    .catch(error => {
            conole.log(error);
            res.statusMessage = "Something went wrong with the DB. Try again later"
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try it again later"
            })
        })

});

app.put("/api/blog-posts/:id", jsonParser, (req,res) => {
    let idauthor = req.params.id;
    let blogId = req.body.id;
	let Title = req.body.title;
	let Content = req.body.content;
	let Author = req.body.author;
    let nDate = req.body.publishDate;

    if (!blogId) 
    {
        res.statusMessage = "Missing ID in query!";
        return res.status(406).json({
            message : "Missing ID in query!",
            status : 406
        });
    }

    if (idauthor != blogId) 
    {
        res.statusMessage = "Parameter ID different from body ID!";
        return res.status(409).json({
            message : "Parameter ID different from body ID!",
            status : 409
        });
    }

   let postToUpdate = { }
   postToUpdate.id=idauthor;

   if (Title)
   {
        postToUpdate.title= Title;
   } 

   if (Content)
   {
        postToUpdate.content = Content;
   }

   if (Author)
   {
        postToUpdate.author = Author;
   }

   if (nDate)
   {
        postToUpdate.publishDate = nDate; 
   }

   BlogPostsList.updatePost(postToUpdate)
    .then(posts => {
        return res.status(202).json(posts);
        })
    .catch( error => {
            console.log(error);
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            });
        });
   

});


let server;
function runServer(port, databaseUrl){

    return new Promise( (resolve, reject ) => {

        mongoose.connect(databaseUrl, response => {

            if ( response ){

                return reject(response);

            }

            else{

                server = app.listen(port, () => {

                    console.log( "App is running on port " + port );

                    resolve();

                })

                .on( 'error', err => {

                    mongoose.disconnect();

                    return reject(err);

                })

            }

        });

    });

}

function closeServer () {
    return mongoose.disconnect()
        .then(() => {
            return new Promise( (resolve, reject) => {
                console.log('Closing the server')
                server.close(err => {
                    if (err) 
                    {
                        return reject(err)
                    } 
                    else
                    {
                        resolve()
                    }
                })
            })
        })
}

runServer(PORT, DATABASE_URL)
    .catch(err => {
        console.log(err);
    });

module.exports = {app, runServer, closeServer}