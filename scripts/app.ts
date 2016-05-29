
/// Demo Controller ///////////////

// const editor;
// const removeAllMarkers;

// const ngApp = angular.module('RefScriptDemo',[]);

// ngApp.controller('DemoCtrl', ['$scope', function($scope) {
//     $scope.demoFiles = { content: [] };

//     getFileList('/demo', files => {
//         $scope.demoFiles.content = files;
//         $scope.$apply();
//     });

//     $scope.selectTest = function(file: string) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', '/load-test', true);
//         xhr.setRequestHeader("Content-type", "application/json");
//         xhr.send(JSON.stringify({ 'name': 'demo/file' }));
//         xhr.addEventListener('readystatechange', function (e) {
//             if (xhr.readyState == 4 && xhr.status == 200) {
//                 let fileText = '// file: ' + file + '\n' + xhr.responseText;
//                 let session = editor.getSession();
//                 removeAllMarkers(session);
//                 session.setValue(fileText);
//             }
//         });
//     }
// }]);


// function getFileList(path: string, cb: (fs: string[]) => void) {
//     const serverURL = window.location.protocol + "//" + window.location.host;
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', serverURL + path, true);
//     xhr.send();
//     xhr.addEventListener('readystatechange', e => {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             // For some reason we have to do `JSON.parse` twice
//             const files = JSON.parse(JSON.parse(xhr.responseText));
//             cb(files);
//         }
//     });
// }

