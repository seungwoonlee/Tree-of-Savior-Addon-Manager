(function() {
	'use strict';

	angular
		.module('app')
		.controller('BrowseController', BrowseController);

	BrowseController.$inject = [
    '$scope', '$http', 'addonretriever', 'installer','settings', '$log',
    'SharedScopes', '$translate'
  ];

	function BrowseController(
    $scope, $http, addonretriever,installer, settings, $log,
    SharedScopes, $translate
  ) {
		const vm = this;
		this.sort = "name";

		require('electron-json-storage').get('settingCol', function(error, col) {
			console.log(col)
		    vm.col = col
            if(typeof col == 'object' )
                vm.col = 50
        });

		addonretriever.getAddons(function(addons) {
			vm.addons = addons;
		});

		addonretriever.getDependencies(function(dependencies) {
			$log.info(JSON.stringify(dependencies));
		});

		this.changeCol = ()=>{
			require('electron-json-storage').set('settingCol',vm.col, error =>{
				console.log(error)
			})
		}
	
		$scope.updateAllAddons = function(){
			let updatelist = '';
			for(let i = 0;i<vm.addons.length - 1;i++){
				let addon = vm.addons[i]
				if(addon.isUpdateAvailable){
					installer.update(vm.addons[i])
					updatelist += addon.name + '\n';			
				}
			}

			if(updatelist !== '')
				alert(`${updatelist}${$translate.instant('ADDONS.UPDATE_LIST_SUCCESS')}`);
			else
				alert($translate.instant('ADDONS.UPDATE_LIST_BLANK'));
		
		}
	}
})();
