
/// Demo Controller ///////////////

const ngApp = angular.module('RefScriptDemo',[]);

ngApp.controller('DemoCtrl', ['$scope', function($scope) {
    $scope.demoFiles = { content: [] };
    
    getFileList('/demo', files => { 
        $scope.demoFiles.content = files;
        $scope.$apply(); 
    });
     
}]);


function getFileList(path: string, cb: (fs: string[]) => void) {    
    const serverURL = window.location.protocol + "//" + window.location.host;    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', serverURL + path, true);
    xhr.send();
    xhr.addEventListener('readystatechange', e => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // For some reason we have to do `JSON.parse` twice
            const files = JSON.parse(JSON.parse(xhr.responseText));            
            cb(files);
        }
    });
}

