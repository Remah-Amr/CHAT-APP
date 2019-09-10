// when you want to add something without loss original folder or instead of to copy the folder
// you can remote to another branch then write what you want by:
// git branch name
// git checkout name
// do every thing or change you want
// git add .
// git commit -am 'name'
// then : git checkout master
// git merge name

// you can write git status to know which branch you in
// don't forget after any change to 'add .' then 'commit'

// if you want to add to github write: 
// git remote add origin https://github.com/Remah-Amr/chat.git
//git push -u origin master
// after first time you add this origin to your code , then you add another branch you don't have to add this origin to your ropository because you added it with master in you own ropository so diffentbranches has same remotes 
// so if you write git remote you can see heroku and origin 'if you have deployed'
// so in second branch you have to write only 
// note : master change by your branch git push -u origin nameOfBranch

// if you want to download any project in github 
// open your current folder in terminal 
// like cd Desktop then cd name
// then write: git clone https://github.com/Remah-Amr/chat.git 'link of project'