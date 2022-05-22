var SftpUpload = require('sftp-upload'),
fs = require('fs');

var options = {
host:'www.appmn.cn',
username:'zhanglinghuan',
password:"sinaxm1803++",
path: './public',
remoteDir: '/home/wwwroot/default/front/project2022/smoker',
excludedFolders: ['**/.git', 'node_modules'],
exclude: ['.gitignore', '.vscode/tasks.json'],
// privateKey: fs.readFileSync('privateKey_rsa'),
// passphrase: fs.readFileSync('privateKey_rsa.passphrase'),
dryRun: false,
},
sftp = new SftpUpload(options);

sftp.on('error', function(err) {
throw err;
})
.on('uploading', function(progress) {
console.log('Uploading', progress.file);
console.log(progress.percent+'% completed');
})
.on('completed', function() {
console.log('Upload Completed');
})
.upload();