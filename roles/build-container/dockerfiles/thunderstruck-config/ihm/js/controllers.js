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
	$scope.version = actPoint.getVersion();
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
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
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
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
	$scope.file = actPoint.getFile();
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
	$scope.version = actPoint.getVersion();
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
	$scope.version = actPoint.getVersion();
	$scope.version = actPoint.getModule();
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
	$scope.locked = false;
	$scope.item = {};
	$scope.item['paramValue'] = [];
	$scope.fieldList = [];
	var valueList = {};
	$scope.valueList = {};
	$scope.fieldValueList = [];
	$scope.param = null;
	var isValue = false;
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
	$scope.file = actPoint.getFile();
	$scope.help = null;
	$scope.showHelp = function(){
		if($scope.help == null){
			$scope.help = "First Field is for the name of the parameter\n\n"
			+ "Then use the selector to choose between value, table or list based on what type of parameter you want\n\n"
			+ "Value is simple, just enter the value you want in the field and click on confirm\n\n"
			+ "For table you enter a value in the field and click on + to add it. You can add as many as you want. If you entered a incorrect value you can select it in the select box and click - to delete it. When you added all the value in the table you need, click on confirm\n\n"
			+ "In list you must do a second selection base on what couple you need in your list : value for a couple \"field:value\" ex: debug:true or table for a couple \"field:table\".\n\n"
			+ "If you choosed value, enter the field in the first field and the value in the second field, like for the table selection you can add and delete entered value with the + and - button\n\n"
			+ "If you choosed table, You must first add a field in the first field, add it with the + button, and select it in the select box to then add the different value with the second field and the second + button. Like before select a field or value in the select box and use the - button to delete it\n\n"
			+ "If you want a parameter with a list composed of value and table, you can use the selection list\/value and enter couple \"field:value\" and \"field:[value,value]\" to make it";
		}else{
			$scope.help = null;
		}
	}
	$scope.updateValueType = function(selectedType){
		if(selectedType=="value"){
			$scope.item['paramValue'] = null;
			isValue = true;
		} else if (selectedType=="table"){
			isValue = false;
			$scope.item['paramValue'] = [];
		} else if (selectedType=="listing"){
			isValue = false;
			$scope.item['paramValue'] = {};
		}
	};
	$scope.setValue = function(value){
		if(isValue){
			if(/^\d+$/.test(value)){
				value = parseInt(value);
			}else if(/^[tT]rue$/.test(value)){
				value = true;
			}else if(/^[fF]alse$/.test(value)){
				value = false;
			}else if(/^\d+\.\d+$/.test(value)||/^\d+(\.\d+)?[eE]\-?\d+$/.test(value)){
				value = parseFloat(value);
			}
			$scope.item['paramValue'] = value;
		}
	}
	$scope.addParam = function(param){
		if(/^\d+$/.test(param)){
			param = parseInt(param);
		}else if(/^\d+\.\d+$/.test(param)||/^\d+(\.\d+)?[eE]\-?\d+$/.test(param)){
			param = parseFloat(param);
		}
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
	$scope.addField = function(field){
		$scope.item['paramValue'][field] = [];
		valueList[field] = [];
		$scope.fieldList[$scope.fieldList.length] = field;
	};
	$scope.deleteField = function(selectedField){
		var i = 0;
		while(i < $scope.fieldList.length){
			if($scope.fieldList[i] == selectedField){
				$scope.fieldList.splice(i, 1);
			}
			i ++;
		}
		delete valueList[field];
		delete $scope.item['paramValue'][selectedField];
	};
	$scope.onFieldChange = function(selectedField){
		$scope.valueList = valueList[selectedField];
	};
	$scope.addValue = function(selectedField, value){
		if(/^\d+$/.test(value)){
			value = parseInt(value);
		}else if(/^\d+\.\d+$/.test(value)||/^\d+(\.\d+)?[eE]\-?\d+$/.test(value)){
			value = parseFloat(value);
		}
		valueList[selectedField][valueList[selectedField].length] = value;
		$scope.item['paramValue'][selectedField][$scope.item['paramValue'][selectedField].length] = value;
	};
	$scope.deleteValue = function(selectedField, selectedValue){
		var i = 0;
		while(i < $scope.item['paramValue'][selectedField].length){
			if($scope.item['paramValue'][selectedField][i] == selectedValue){
				$scope.item['paramValue'][selectedField].splice(i, 1);
			}
			i ++;
		}
		var j = 0;
		while(j < valueList[selectedField].length){
			if(valueList[selectedField][j] == selectedValue){
				valueList[selectedField].splice(j, 1);
			}
			j ++;
		}
	};
	$scope.addFieldValue = function(field, value){
		if(/^\d+$/.test(value)){
			value = parseInt(value);
		}else if(/^[tT]rue$/.test(value)){
			value = true;
		}else if(/^[fF]alse$/.test(value)){
			value = false;
		}else if(/^\d+\.\d+$/.test(value)||/^\d+(\.\d+)?[eE]\-?\d+$/.test(value)){
			value = parseFloat(value);
		}
		$scope.item['paramValue'][field] = value;
	};
	$scope.deleteFieldValue = function(selectedValue){
		delete $scope.item['paramValue'][selectedValue];
	};
	$scope.add = function(param){
		if($scope.item['paramValue'] != null && $scope.item['paramValue'] != undefined && $scope.item['paramValue'].length != 0 &&!angular.equals($scope.item['paramValue'], {})){
			paramListFactory.addParam($scope.item, actPoint.getVersion(), actPoint.getModule(), actPoint.getFile(), function(data){
				if(data['state']){
					$scope.error = data['reason'];
				} else {
					$location.path('/params').replace();
				}
			});
		} else {
			$scope.error = "Enter a Value";
		}
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
	$scope.version = actPoint.getVersion();
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
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
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
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
	$scope.file = actPoint.getFile();
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
	$scope.version = actPoint.getVersion();
	$scope.module = actPoint.getModule();
	$scope.file = actPoint.getFile();
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





