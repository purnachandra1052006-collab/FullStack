const fs= require('fs');

// readFile Function
fs.readFile('task.txt','utf8', (err,data)=>
{
    if (err) throw error;
    console.log(data)
});

// writeFile Function
const data = 'Google.com';
fs.writeFile('output.txt', data, err => {
  if (err) throw err;
  console.log('File is Written');
});

// Appending a File
const appended_data = "The End";
fs.appendFile('append.txt', appended_data, err =>{
    if (err) throw error;
    console.log("The File is Appended");
})

