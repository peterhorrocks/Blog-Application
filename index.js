import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { rename } from 'node:fs';
import { dirname } from "path";
import { fileURLToPath } from "url";

// Middleware Settings
const app = express();
const port = 3000;
const upload = multer({ dest: './public/images/' })
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get Current Date
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}/${month}/${year}`;
console.log("Date: ", currentDate);

// Define Preloaded Posts
const feature1Heading = "Smoking! Be Happy, Go Lucky! Really?";
const feature1Contents = "Feature 1: Integer sed accumsan risus. Quisque accumsan nec ante sit amet vulputate. Etiam consequat augue vel ullamcorper maximus. Nulla tincidunt suscipit ullamcorper. Donec quis blandit enim. Curabitur vitae elit a erat malesuada posuere id et ipsum. Sed rutrum fermentum sollicitudin. In malesuada massa nulla, vel euismod metus dignissim vitae. Vivamus ut nunc est. Praesent sit amet iaculis dui, id lobortis urna. Nam ut facilisis orci. Duis tincidunt velit vestibulum massa laoreet scelerisque. Duis massa justo, accumsan ac feugiat sit amet, tempor vel mauris. Curabitur a eros elit. Aliquam condimentum at neque sed venenatis.\
\n\n\ Nullam in sem cursus, interdum purus et, eleifend nibh. Donec faucibus arcu eu est accumsan congue. Phasellus maximus odio justo, id semper massa congue vitae. Nullam vitae elit ut dui commodo molestie sit amet eu nibh. Quisque pharetra tempus neque, vel eleifend sapien maximus at. Vivamus iaculis eu nibh laoreet molestie. Duis lacinia congue tortor et cursus. Nullam egestas urna nibh, non gravida nunc molestie blandit. Aenean sed dictum nisi. Donec id erat dignissim, laoreet tortor id, sodales leo. Nulla dignissim vestibulum metus, at facilisis ligula consequat vitae. Vestibulum sed consectetur augue.";
const feature1Image = "/images/adverts-old-vintage-advertisements-posters-labels-251.jpg";

const feature2Heading = "Go on! Get it Down Your Neck, and Rot Those Teeth!";
const feature2Contents = "Feature 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tortor eros, aliquet eu dui id, tincidunt sagittis dolor. Donec tristique felis nec consectetur tempor. Vivamus sit amet aliquam magna, sit amet euismod eros. Etiam non sem mollis, aliquet leo nec, laoreet odio.";
const feature2Image = "/images/adverts-old-vintage-advertisements-posters-labels-191.jpg";

const post1Heading = "How About a Slice of Green Toast!";
const post1Contents = "Post 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tortor eros, aliquet eu dui id, tincidunt sagittis dolor. Donec tristique felis nec consectetur tempor. Vivamus sit amet aliquam magna, sit amet euismod eros. Etiam non sem mollis, aliquet leo nec, laoreet odio.";
const post1Image = "/images/adverts-old-vintage-advertisements-posters-labels-51.jpg";


// GLOBAL VARIABLES
// Post Arrays
let posts = [];
let heroComments = [];

let commentsDisplay = false;
let deleteDisplay = false;
let postNumber = 3;
let userName = "John/Jane Doe";
let author = "Peter";


// Set the EJS engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// Static files are linked to the public folder to show CSS
app.use(express.static("public"));

// EJS engine automatically looks in the views folder for ejs files

// PRELOAD Feature 1, Feature 2, and Post 1 into array
let preloadHeading = feature1Heading;
preloadHeading = sensibleURL(preloadHeading);

const feature1Key = {
    dbID: 0,
    dbAuthor: author,
    dbHeading: feature1Heading,
    dbContent: feature1Contents,
    dbURL: preloadHeading,
    dbImage: feature1Image,
    dbComments: [
        {dbComment: 
            []
        }]
};
posts.push(feature1Key);

preloadHeading = feature2Heading;
preloadHeading = sensibleURL(preloadHeading);
const feature2Key = {
    dbID: 1,
    dbAuthor: author,
    dbHeading: feature2Heading,
    dbContent: feature2Contents,
    dbURL: preloadHeading,
    dbImage: feature2Image,
    dbComments: [
        {dbComment: 
            []
        }]
};
posts.push(feature2Key);

preloadHeading = post1Heading;
preloadHeading = sensibleURL(preloadHeading);
const post1Key = {
    dbID: 2,
    dbAuthor: author,
    dbHeading: post1Heading,
    dbContent: post1Contents,
    dbURL: preloadHeading,
    dbImage: post1Image,
    dbComments: [
        {dbComment: 
            []
        }]
};
posts.push(post1Key);


// Reformat Post Headings for Address Bar
function sensibleURL(reformatString) {
    var newString = reformatString.replace(/\s+/g, "-");
    newString = newString.toLowerCase();
    newString = newString.replace(/[?!,:;]/g, "");
    return newString;
}


// GET Requests

app.get("/", (req, res) => {
    console.log("\n** GET Home Page **")

    // Also, redirect from Create Post
    res.render("index.ejs", {
        postsKey: posts,
        postDate: currentDate,
    });

});


app.get("/post_hero", (req, res) => {
    console.log("\n**GET Hero **")

    res.render("post_hero.ejs", {
        commentAction: false,
        displayDate: currentDate,
        displayAuthor: userName,
        displayComments: heroComments
    });

});

app.get("/hero_comment", (req, res) => {
    console.log("\n** GET Hero Comment **")

    res.render("post_hero.ejs", {
        commentAction: true,
        displayDate: currentDate,
        displayAuthor: userName,
        displayComments: heroComments
    });

});

app.get("/create_post", (req, res) => {
    console.log("\n** GET Create Post **")

    res.render("create_post.ejs");
});


app.get("/about", (req, res) => {
    console.log("\n** GET About Page **")

    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    console.log("\nG** ET Contact Page **")

    res.render("contact.ejs");
});

app.get("/archive", (req, res) => {
    console.log("\n** GET Archive Page **")

    res.render("archive.ejs");
});

// GET Dynamic Post page
// =====================
app.get("/posts/:postName", (req, res) => {
    console.log("\n** GET Dynamic Post page **")

    let i = 0;
    let requestedHeading = req.params.postName;
    
    for (i = 0; i < posts.length; i++) {

        if (posts[i].dbURL === requestedHeading) {

            let commentText = posts[i].dbComments[0].dbComment;

            if (posts[i].dbComments[0].dbComment.length === 0) {
                commentsDisplay = false;
            } else {
                commentsDisplay = true;
            }

            res.render("post.ejs", {
                displayComments: commentsDisplay,
                commentAction: false,
                postDate: currentDate,
                postID: posts[i].dbID,
                postAuthor: posts[i].dbAuthor,
                postHeading: posts[i].dbHeading,
                postContent: posts[i].dbContent,
                postURL: posts[i].dbURL,
                postImage: posts[i].dbImage,
                postComments: [
                    {postComment:
                        [commentText]
                    }
                ]
            })
            
        }

    };

});

// GET Post COMMENT Page
// =====================
app.get("/posts_comment/:postName", function(req, res) {
    console.log("\n** GET Posts COMMENTS: Postname **")

    let requestedHeading = req.params.postName;

    posts.forEach(function(post) {

        if (post.dbURL === requestedHeading) {
            console.log("Match found!");

            if (post.dbComments[0].dbComment.length === 0) {
                commentsDisplay = false;
            } else {
                commentsDisplay = true;
            }

            res.render("post.ejs", {
                displayComments: commentsDisplay,
                commentAction: true,
                postDate: currentDate,
                postID: post.dbID,
                postAuthor: post.dbAuthor,
                postHeading: post.dbHeading,
                postContent: post.dbContent,
                postURL: post.dbURL,
                postImage: post.dbImage,
                postComments: [
                    {postComment:
                        [post.dbComments[0].dbComment]
                    }]
            })

        }
    });
});

// GET Post EDIT Page
// =====================
app.get("/posts_edit/:postName", function(req, res) {
    console.log("\n** GET Posts EDIT: Postname **")

    let requestedHeading = req.params.postName;

    posts.forEach(function(post) {

        if (post.dbURL === requestedHeading) {
            console.log("Match found!");

            if (post.dbComments[0].dbComment.length === 0) {
                commentsDisplay = false;
            } else {
                commentsDisplay = true;
            }

            res.render("post.ejs", {
                displayComments: commentsDisplay,
                editAction: true,
                postDate: currentDate,
                postID: post.dbID,
                postAuthor: post.dbAuthor,
                postHeading: post.dbHeading,
                postContent: post.dbContent,
                postURL: post.dbURL,
                postImage: post.dbImage,
                postComments: [
                    {postComment:
                        [post.dbComments[0].dbComment]
                    }]
            })

        }
    });
});


// GET Post DELETE Page
// =====================
app.get("/posts_delete/:postName", function(req, res) {
    console.log("\n** GET Posts DELETE: Postname **")

    let requestedHeading = req.params.postName;

    posts.forEach(function(post) {

        if (post.dbURL === requestedHeading) {
            console.log("Match found!");

            if (post.dbComments[0].dbComment.length === 0) {
                commentsDisplay = false;
            } else {
                commentsDisplay = true;
            }

            res.render("post.ejs", {
                displayComments: commentsDisplay,
                displayDelete: true,
                postDate: currentDate,
                postID: post.dbID,
                postAuthor: post.dbAuthor,
                postHeading: post.dbHeading,
                postContent: post.dbContent,
                postURL: post.dbURL,
                postImage: post.dbImage,
                postComments: [
                    {postComment:
                        [post.dbComments[0].dbComment]
                    }]
            })

        }
    });
});


// POST REQUESTS
// =============

// POST Comment Hero
app.post("/hero_comment", (req, res) => {
    console.log("\nPOST Hero Comment")

    let commentText = req.body.commentText;

    if (commentText === "") {
        commentText = "COMMENTS...";
    }

    heroComments.push(commentText);

    res.render("post_hero.ejs", {
        commentAction: false,
        displayDate: currentDate,
        displayAuthor: userName,
        displayComments: heroComments
    });

});

// POST Post Comment
// =================
app.post("/posts_comment/:postName", (req, res) => {
    console.log("\n** POST Post Comment **")

    let requestedHeading = req.params.postName;

    console.log("req.body.commentText: ", req.body.commentText);

    let commentBody = req.body.commentText;

    if (req.body.commentText === "") {
        commentBody = "COMMENTS...";
    };

    console.log("commentBody: ", commentBody);

    let i = 0;
    for (i = 0; i < posts.length; i++) {

        if (posts[i].dbURL === requestedHeading) {

            posts[i].dbComments[0].dbComment.push(commentBody);

            let commentBodyS = posts[i].dbComments[0].dbComment;

            if (posts[i].dbComments === "[]") {
                commentsDisplay = false;
            } else {
                commentsDisplay = true;
            }
    
            res.render("post.ejs", {
                commentAction: false,
                displayComments: commentsDisplay,
                postDate: currentDate,
                postID: posts[i].dbID,
                postAuthor: posts[i].dbAuthor,
                postHeading: posts[i].dbHeading,
                postContent: posts[i].dbContent,
                postURL: posts[i].dbURL,
                postImage: posts[i].dbImage,
                postComments: [
                    {postComment:
                        [commentBodyS]
                    }]
            })
            break;
        }

    };

});


// POST Edit Update Post
// ======================
app.post("/posts_edit/:postName", upload.single("formPostImage"), (req, res) => {
    
    let requestedHeading = req.params.postName;

    // Multer crashes if there is no image, so the output file and extension
    // are extracted from the form, in order to bypass the multer facility.
    let imageFile = req.body.outputfile + "." + req.body.extension;
    console.log("imageFile: ", imageFile);
 
    // Multer stores the filename as a random generated filename, so this
    // needs to be renamed to the original filename. This is only used for
    // directory storage.
    if (req.body.outputfile || "") {
        rename(__dirname +"/public/images/" + req.file.filename, __dirname +"/public/images/" + req.file.originalname, (err) => {
            if (err) throw err;
            console.log("Image File Rename Complete!");
        });
    }
      
    // Format the image path for the EJS template
    var imageSource = "/images/" + imageFile;

    //Access the Array

    for (i = 0; i < posts.length; i++) {

        if (requestedHeading === posts[i].dbURL) {
            console.log("Match found!");

            let tempHeading = "";
            if (req.body.formPostHeading === "") {
                tempHeading = "Heading";
            } else {
                tempHeading = req.body.formPostHeading;
            }
        
            // Format the URL for array storage
            let formHeading = tempHeading;
            formHeading = sensibleURL(formHeading);
        
            formHeading = formHeading + "-" + postNumber;
        
            let tempContents = "";
            if (req.body.formPostContents === "") {
                tempContents = "CONTENTS...";
            } else {
                tempContents = req.body.formPostContents;
            }
        
            posts[i].dbHeading = req.body.formPostHeading;
            posts[i].dbContent = req.body.formPostContents;
            posts[i].dbURL = formHeading;
            if (imageSource === "/images/.") {
                console.log("No Image Upload");
            } else {
                posts[i].dbImage = imageSource;
            };

            // Redirect to Home Page GET route
            res.redirect("/");

        };

    };


});

// POST Login Form
// ===============
app.post("/login", (req, res) => {
    console.log("\n** POST Login Form **")

    // Load Form data to Local Data
    const loginUserName = req.body.userName;
    const loginPassword = req.body.password;

    if (loginUserName === "") {
        res.render("index.ejs", { loginResponse: "Please enter User Name" } );
    }
    if (loginPassword === "") {
        res.render("index.ejs", { loginResponse: "Please enter Password" } );
    }
            
    if (loginPassword !== "letmein") {
        res.render("index.ejs", { loginResponse: "Invalid Password" } );
    }
    else {
        res.render("index.ejs", { loginResponse: `Hello ${loginUserName}`} );
    }
  
    if (loginUserName !== "") {
        userName = loginUserName;
    }

    // Redirect to Home Page GET route
    res.redirect("/");

});

// POST Create Post Form
// ======================
app.post("/create_post", upload.single("formPostImage"), (req, res) => {
    console.log("\n** POST Create Post **")


    // Multer crashes if there is no image, so the output file and extension
    // are extracted from the form, in order to bypass the multer facility.
    let imageFile = req.body.outputfile + "." + req.body.extension;
 
    // Multer stores the filename as a random generated filename, so this
    // needs to be renamed to the original filename. This is only used for
    // directory storage.
    if (req.body.outputfile || "") {
        rename(__dirname +"/public/images/" + req.file.filename, __dirname +"/public/images/" + req.file.originalname, (err) => {
            if (err) throw err;
            console.log("Image File Rename Complete!");
        });
    }
      
    // Format the image path for the EJS template
    var imageSource = "/images/" + imageFile;

    let tempHeading = "";
    if (req.body.formPostHeading === "") {
        tempHeading = "Heading";
    } else {
        tempHeading = req.body.formPostHeading;
    }

    // Format the URL for array storage
    let formHeading = tempHeading;
    formHeading = sensibleURL(formHeading);

    formHeading = formHeading + "-" + postNumber;

    let tempContents = "";
    if (req.body.formPostContents === "") {
        tempContents = "CONTENTS...";
    } else {
        tempContents = req.body.formPostContents;
    }

      const postsKey = {
        dbID: postNumber,
        dbAuthor: userName,
        dbHeading: tempHeading,
        dbContent: tempContents,
        dbURL: formHeading,
        dbImage: imageSource,
        dbComments: [
            {dbComment:
                []
            }]
    };

    posts.push(postsKey);

    postNumber++,

    // Redirect to Home Page GET route
    res.redirect("/");

});


// DELETE REQUESTS

// DELETE Post DELETE Page
// =======================
app.post("/posts_delete/:postName", function(req, res) {
    console.log("\n** DELETE Posts DELETE: Postname **")

    //console.log(req.params.postName);
    let requestedHeading = req.params.postName;

    let tempArray = [];

    // UPDATING ARRAY
    let newID = 0;
    for (i = 0; i < posts.length; i++) {

        if (posts[i].dbURL !== requestedHeading) {
            posts[i].dbID = newID;
            tempArray.push(posts[i]);
            newID++;
        };

    };

    posts = tempArray;

    // Redirect to Home Page GET route
    res.redirect("/");

});



// SERVER Listening for Requests
// =============================
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});