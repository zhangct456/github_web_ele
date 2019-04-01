/*

*/
ChangeBindCardCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$timeout'];

function ChangeBindCardCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $timeout) {
	$scope.init = function(){
		
		$scope.userInfo=$scope.getUserInfo();
		
		//密码控件初始化
//		$("#TrsPassword").PasswordWidget({'UseCache':false});
		
		$scope.formData = {};
		
	};
	
	//查询卡号开户行
	$scope.queryBank = function(){
		$timeout(function(){
			if(!(/^\d{16,}$/.test($scope.formData.NewAccountNo+''))){
				return;
			}
			var p = {
				"AcNo" : $scope.formData.NewAccountNo+''
			};
			$remote.post("Fms.QueryBankInfoForChannel.do",p,function(data){
				$scope.AcBankInfo = data;
			});
		},0)
	};
	
	$scope.doPre = function(){
		if(vx.equals(parseInt($("#TrsPassword").$getPasswordLength(),10),0)){
		    $scope.$alert("请输入交易密码");
		    return false;
		}
		var p = {
			"MobilePhone" : $scope.userInfo.MobilePhone,
			"NewAcNo" : $scope.formData.NewAccountNo
		};
		$scope.$showTrsPsdPage({
			sendSMS: function(modalScope) {
				p.EAccountTrsPwd = modalScope[0].EAccountTrsPwdId;
				
				$remote.post("Fms.RelaAcct.do",p,function(data){
					$scope.userInfo.BandAcNo = $scope.formData.NewAccountNo;
					sessionStorage.setItem("userInfo",vx.toJson($scope.userInfo));
					$scope.goto('#2')
				});
			}
		});
		
	};
	
	$scope.clearBankInfo = function(){
		$scope.AcBankInfo = undefined;
	};
	
}