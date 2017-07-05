'use strict';

// Declare app level module which depends on views, and on components
angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/version', {templateUrl: 'partials/liste.html', controller:'versionCtrl'});
	$routeProvider.when('/module', {templateUrl: 'partials/liste.html', controller:'moduleCtrl'});
	$routeProvider.when('/files', {templateUrl: 'partials/liste.html', controller:'filesCtrl'});
	$routeProvider.when('/params', {templateUrl: 'partials/liste.html', controller:'paramsCtrl'});
	$routeProvider.when('/moduleAdd', {templateUrl: 'partials/add.html', controller:'addModCtrl'});
	$routeProvider.when('/fileAdd', {templateUrl: 'partials/add.html', controller:'addFileCtrl'});
	$routeProvider.when('/paramAdd', {templateUrl: 'partials/add.html', controller:'addParamCtrl'});
	$routeProvider.when('/version/detail', {templateUrl: 'partials/detail.html', controller:'verDetailCtrl'});
	$routeProvider.when('/module/detail', {templateUrl: 'partials/detail.html', controller:'modDetailCtrl'});
	$routeProvider.when('/file/detail', {templateUrl: 'partials/detail.html', controller:'fileDetailCtrl'});
	$routeProvider.when('/param/detail', {templateUrl: 'partials/detail.html', controller:'paramDetailCtrl'});
	$routeProvider.when('/menu', {templateUrl: 'partials/menu.html', controller:'menuCtrl'});
	$routeProvider.otherwise({redirectTo: '/version'});
}]);

