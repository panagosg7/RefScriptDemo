
declare let angular: any;


console.log('INITING APP')

// app.js
var demoApp = angular.module('demoApp', ['ui.router']);

demoApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'editor.html'
        })
        
        .state('demo', {
            url: '/demo',
            templateUrl: 'demo.html',
            controller: 'DemoCtrl'                   
        });
        
});