'use strict'

/* Services */

var app = angular.module('myApp.services', []);

app.constant("URL", "https://localhost:3000/fileConf/");

app.factory("versionListFactory", function($http, URL){
	return{
		getVersionList: function(callback){
			$http.get(URL + "version").success(callback);
		}
	}
})
.factory("moduleListFactory", function($http, URL){
	return{
		getModuleList: function(version, callback){
			$http.get(URL + version + "/module").success(callback);
		},
                addModule: function(postData, version, callback){
                        $http({
                                url: URL + version + "/module",
				method: "POST",
				data: postData
			}).success(callback);
		},
		deleteModule: function(version, module, callback){
			$http({
				url: URL + version + "/" + module,
				method: "DELETE"
			}).success(callback);
		}
	}
})
.factory("fileListFactory", function($http, URL){
	return{
		getFileList: function(version, module, callback){
			$http.get(URL + version + "/" + module + "/files").success(callback);
		},
		addFile: function(postData, version, module, callback){
			$http({
				url: URL + version + "/" + module + "/file",
				method: "POST",
				data: postData
			}).success(callback);
		},
		deleteFile: function(version, module, file, callback){
			$http({
				url: URL + version + "/" + module + "/" + file,
				method: "DELETE"
			}).success(callback);
		}
	}
})
.factory("paramListFactory", function($http, URL){
	return{
		getParamList: function(version, module, file, callback){
			$http.get(URL + version + "/" + module + "/" + file + "/params").success(callback);
		},
		addParam: function(postData, version, module, file, callback){
			$http({
				url: URL + version + "/" + module + "/" + file + "/param",
				method: "POST",
				data: postData
			}).success(callback);
		},
		deleteParam: function(version, module, file, param, callback){
			$http({
				url: URL + version + "/" + module + "/" + file + "/" + param,
				method: "DELETE"
			}).success(callback);
		}
	}
})
.factory("actPoint", function($http, URL){
	var model = {
		version: '',
		module:'',
		file:'',
		paramName:'',
		paramValue:''
	}
	if(!sessionStorage.userModel){
		sessionStorage.userModel = angular.toJson(model);
	}
	return{
		getVersion: function(){
			model = angular.fromJson(sessionStorage.userModel);
			return model.version;
		},
		getModule: function(){
			model = angular.fromJson(sessionStorage.userModel);
			return model.module;
		},
		getFile: function(){
			model = angular.fromJson(sessionStorage.userModel);
			return model.file;
		},
		getParamName: function(){
			model = angular.fromJson(sessionStorage.userModel);
			return model.paramName;
		},
		getParamValue: function(){
			model = angular.fromJson(sessionStorage.userModel);
			return model.paramValue;
		},
		setVersion: function(input){
			model.version = input;
			if (model.module != null){
				model.module = null;
			}
			if (model.file != null){
				model.file = null;
			}
			if (model.paramName != null){
				model.paramName = null;
				model.paramValue = null;
			}
			sessionStorage.userModel = angular.toJson(model);
		},
		setModule: function(input){
			model.module = input;
			if (model.file != null){
                                model.file = null;
                        }
                        if (model.paramName != null){
                                model.paramName = null;
				model.paramValue = null;
                        }
			sessionStorage.userModel = angular.toJson(model);
		},
		setFile: function(input){
			model.file = input;
			if (model.paramName != null){
                                model.paramName = null;
				model.paramValue = null;
                        }
			sessionStorage.userModel = angular.toJson(model);
		},
		setParamName: function(input){
			model.paramName = input;
			if(input = null){
				model.paramValue = null;
			}
			sessionStorage.userModel = angular.toJson(model);
			
		},
		setParamValue: function(input){
			model.paramValue = input;
			sessionStorage.userModel = angular.toJson(model);
		}
	}
});
