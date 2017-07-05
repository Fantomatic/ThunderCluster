'use strict'

/* Controllers */

angular.module('myApp.controllers', ['ngRoute', 'myApp.services'])
	.controller('versionCtrl', ['$scope', 'versionListFactory', '$location', 'actPoint', function($scope, versionListFactory, $location, actPoint){
	$scope.itemType = "version";
	versionListFactory.getVersionList(function(data){
		if(data['state']){
			$scope.error = data['reason'];
		}
		$scope.list = data['data'];
	});
	$scope.go = function (item) {
		actPoint.setVersion(item[$scope.itemType]);
		$location.path('/version/detail').replace();
	};
	$scope.menu = function(){
		$location.path('/menu').replace();
	};
}])
	.controller('moduleCtrl', ['$scope', 'moduleListFactory', '$location', 'actPoint', function($scope, moduleListFactory, $location, actPoint){
	if(!actPoint.getVersion()){
		$location.path('/version').replace();
	}
	$scope.containerType = "Version";
	$scope.container = actPoint.getVersion();
	$scope.itemType = "module";
	$scope.notVersion = true;
	moduleListFactory.getModuleList(actPoint.getVersion(), function(data){
		if(data['state']){
			$scope.error = data['reason'];
			$scope.nodata = true;
		}
		$scope.list = data['data'];
	});
	$scope.go = function (item) {
		actPoint.setModule(item[$scope.itemType]);
		$location.path('/module/detail').replace();
	};
	$scope.add = function(){
		$location.path('/moduleAdd').replace();
	};
	$scope.menu = function(){
		$location.path('/menu').replace();
	};
}])
	.controller('filesCtrl', ['$scope', '$location', 'fileListFactory', 'actPoint', function($scope, $location, fileListFactory, actPoint){
	if(!actPoint.getModule()){
		$location.path('/module').replace();
	}
	$scope.containerType = "Module";
	$scope.container = actPoint.getModule(); 
	$scope.itemType = "file";
	$scope.notVersion = true;
	fileListFactory.getFileList(actPoint.getVersion(), actPoint.getModule(), function(data){
		if(data['state']){
			$scope.error = data['reason'];
			$scope.nodata = true;
		}
		$scope.list = data['data'];
	});
	$scope.go = function(item){
		actPoint.setFile(item[$scope.itemType]);
		$location.path('/file/detail').replace();
	};
	$scope.add = function(){
		$location.path('/fileAdd').replace();
	};
	$scope.menu = function(){
		$location.path('/menu').replace();
	};
}])
	.controller('paramsCtrl', ['$scope', '$location', 'paramListFactory', 'actPoint', function($scope, $location, paramListFactory, actPoint){
	if(!actPoint.getFile()){
		$location.path('/files').replace();
	}
	$scope.containerType = "File";
	$scope.container = actPoint.getFile();
	$scope.itemType = "paramName";
	$scope.notVersion = true;
	paramListFactory.getParamList(actPoint.getVersion(), actPoint.getModule(), actPoint.getFile(), function(data){
		if(data['state']){
			$scope.error = data['reason'];
			$scope.nodata = true;
		}
		$scope.list = data['data'];
	});
	$scope.go = function(item){
		actPoint.setParamName(item[$scope.itemType]);
		actPoint.setParamValue(item['paramValue']);
		$location.path('/param/detail').replace();
	};
	$scope.add = function(){
		$location.path('/paramAdd').replace();
	};
	$scope.menu = function(){
		$location.path('/menu').replace();
	};
}])
	.controller('addModCtrl', ['$scope', '$location' ,'moduleListFactory', 'actPoint', function($scope, $location, moduleListFactory, actPoint){
	if(!actPoint.getVersion()){
		$location.path('/version').replace();
	}
	$scope.itemType = "module";
	$scope.add = function(){
		moduleListFactory.addModule($scope.item, actPoint.getVersion(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/module').replace();
			}
		});
	};
	$scope.back = function(){
		$location.path('/module').replace();
	};
}])
	.controller('addFileCtrl', ['$scope', '$location', 'fileListFactory', 'actPoint', function($scope, $location, fileListFactory, actPoint){
	if(!actPoint.getModule()){
		$location.path('/module').replace();
	}
	$scope.itemType = "file";
	$scope.add = function(){
		fileListFactory.addFile($scope.item, actPoint.getVersion(), actPoint.getModule(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/files').replace();
			}
		});
	};
	$scope.back = function(){
		$location.path('/files').replace();
	};
}])
	.controller('addParamCtrl', ['$scope', '$location', 'paramListFactory', 'actPoint', function($scope, $location, paramListFactory, actPoint){
	if(!actPoint.getFile()){
		$location.path('/files').replace();
	}
	$scope.valueRequired = true;
	$scope.itemType = "paramName";
	$scope.item = {};
	$scope.item['paramValue'] = [];
	$scope.addParam = function(param){
		$scope.item['paramValue'][$scope.item['paramValue'].length] = param;
	};
	$scope.deleteParam = function(selectedParam){
		var i = 0;
		while(i < $scope.item['paramValue'].length){
			if($scope.item['paramValue'][i] == selectedParam){
				$scope.item['paramValue'].splice(i, 1);
			}
			i ++;
		}
	};
	$scope.add = function(){
		paramListFactory.addParam($scope.item, actPoint.getVersion(), actPoint.getModule(), actPoint.getFile(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/params').replace();
			}
		});
	};
	$scope.back = function(){
		$location.path('/params').replace();
	};
}])
	.controller('verDetailCtrl', ['$scope', '$location', 'actPoint', function($scope, $location, actPoint){
	if(!actPoint.getVersion()){
		$location.path('/version').replace();
	}
	$scope.itemType = 'version';
	$scope.itemContent = 'Modules';
	$scope.item = actPoint.getVersion();
	$scope.go = function(){
		$location.path('/module').replace();
	};
	$scope.back = function(){
		actPoint.setVersion(null);
		$location.path('/version').replace();
	};
}])
	.controller('modDetailCtrl', ['$scope', '$location', 'moduleListFactory', 'actPoint', function($scope, $location, moduleListFactory, actPoint){
	if(!actPoint.getModule()){
		$location.path('/module').replace();
	}
	$scope.notVersion = true;
	$scope.itemType =  "module";
	$scope.itemContent = 'Files';
	$scope.item = actPoint.getModule();
	$scope.go = function(){
		$location.path('/files').replace();
	};
	$scope.suppress = function(){
		moduleListFactory.deleteModule(actPoint.getVersion(), actPoint.getModule(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/module').replace();
			}
		});
	};
	$scope.back = function(){
		actPoint.setModule(null);
		$location.path('/module').replace();
	};
}])
	.controller('fileDetailCtrl', ['$scope', '$location', 'fileListFactory', 'actPoint', function($scope, $location, fileListFactory, actPoint){
	if(!actPoint.getFile()){
		$location.path('/files').replace();
	}
	$scope.notVersion = true;
	$scope.itemType =  "files";
	$scope.itemContent = 'params';
	$scope.item = actPoint.getFile();
	$scope.go = function(){
		$location.path('/params').replace();
	};
	$scope.suppress = function(){
		fileListFactory.deleteFile(actPoint.getVersion(), actPoint.getModule(), actPoint.getFile(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/files').replace();
			}
		});
	};
	$scope.back = function(){
		actPoint.setFile(null);
		$location.path('/files').replace();
	};
}])
	.controller('paramDetailCtrl', ['$scope', '$location', 'paramListFactory', 'actPoint', function($scope, $location, paramListFactory, actPoint){
	if(!actPoint.getParamName){
		$location.path('/params').replace();
	}
	$scope.notVersion = true;
	$scope.itemType = "param";
	$scope.item = actPoint.getParamName();
	$scope.value = actPoint.getParamValue();
	$scope.suppress = function(){
		paramListFactory.deleteParam(actPoint.getVersion(), actPoint.getModule(), actPoint.getFile(), actPoint.getParamName(), function(data){
			if(data['state']){
				$scope.error = data['reason'];
			} else {
				$location.path('/params').replace();
			}
		});
	};
	$scope.back = function(){
		actPoint.setParamName(null);
		$location.path('/params').replace();
	};
}])
	.controller('menuCtrl', ['$scope', '$location', 'actPoint', function($scope, $location, actPoint){
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
	$scope.file = actPoint.getFile();
	$scope.go = function(item){
		if(item){
			switch(item){
				case "version":
					actPoint.setVersion(null);
					break;
				case "module":
					actPoint.setModule(null);
					break;
				case "files":
					actPoint.setFile(null);
					break;
			}
			$location.path('/' + item).replace();
		}
	};
	$scope.back = function(){
		if(actPoint.getFile()){
			$location.path('/params');
		} else if (actPoint.getModule()){
			$location.path('/files');
		} else if (actPoint.getVersion()){
			$location.path('/module');
		} else {
			$location.path('/version');
		}
	};
}]);





