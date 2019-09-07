// // pass : remah654312@
// to deploy:

// create .gitignore

// make const port = process.env.PORT || 3000;
// app.listen(port,()=>{
//     console.log(`server started on port successfully`);
// });

// you have first to install heroku toolbelt cli to write below commands to deal with your code
// we put file .gitignore to reduce size of app , after you push to heroku server it install all dependecies in your package.json

// heroku login 
// git init
// git add .
// git commit -am "flag" => take snapshots for your code
// heroku create
// heroku git:remote ... 'at your account in own app' => to store your code and commit on cloud and deploy it automatically
// git push heroku master
// heroku open



// for api you deploy as previous no changes but you can't open app since we don't have rendered views 
// on your front end you change url 'instead of localhost' to your url app then deploy it as convinient way
// with react you write npm run build 