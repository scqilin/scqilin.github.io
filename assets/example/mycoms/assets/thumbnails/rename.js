// Description: 重命名文件
// Author: shaoqiling
// Date: 2023-01-29
// Version: 1.0.0
// 可在当前目录下执行 node rename.js
var fs = require('fs');
var path = require('path');

renames('./');
function renames(filepath) {
    fs.readdir(filepath, function (err, files) {
        if (err) {
            // console.log(err);
        } else {
            files.forEach(function (filename) {
                var filedir = path.join(filepath, filename);
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile();//是文件
                        //var isDir = stats.isDirectory();//是文件夹
                        if (isFile) {
                            console.log(filedir, filename);
                            //重名称png后缀的文件 转换为小写 并去掉Component
                            if (filename.indexOf('.png') > -1) {
                                var newname = filename.replace('Component', '');
                                newname = newname.toLowerCase();
                                var newfiledir = path.join(filepath, newname);
                                fs.rename(filedir, newfiledir, (err) => {
                                    console.log('err :>> ', err);
                                });
                            }
                        }
                    }
                })
            })
        }
    })
}