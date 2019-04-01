/*

*/
NoticeCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter'];

function NoticeCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter) {
	$scope.init = function(){
		//获取消息列表
		//$remote.post("",{},function(data){
			$scope.noticeList = [{},{},{},{},{}]
		//})
	}
	
	$scope.showDetail = function(row){
		$scope.currentNotice = row;
		$scope.goto('#2');
	}
}