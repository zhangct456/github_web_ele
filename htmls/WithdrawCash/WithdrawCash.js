
WithdrawCashCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter'];

function WithdrawCashCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter) {
	$scope.init = function(){		
		$scope.userInfo=$scope.getUserInfo();
		//查询账号所属银行
		var p = {
			"AcNo" : $scope.userInfo.BandAcNo
		};
		$remote.post('Fms.QueryBankInfoForChannel.do',p,function(data){
			$scope.BankInfo = data;
		});

		//查询余额
		var p = {
			"EaccountNo" : $scope.userInfo.EAcNo,
			"MobilePhone" : $scope.userInfo.MobilePhone
		};
		$remote.post('Fms.EAcctIntelQry.do',p,function(data){
			$scope.BalanceInfo = data;
		});
	};
	
	//发送提现交易请求
	$scope.doPre = function(){
		//判断输入的金额是否大于50000元
		if(Number($scope.TrsAmount)>50000){
			$scope.$alert("提现超过50000元请下载晋商银行直销银行APP");
		}
		else{
			_hmt.push(['_trackEvent', '提现', 'click']);
			var message={};
			message.sendSMS = function (modalScope) {
				var p = {
					"MobilePhone" : $scope.userInfo.MobilePhone,
					"AcNo" : $scope.userInfo.BandAcNo,
					"EaccountNo" : $scope.userInfo.EAcNo,
					"TrsAmount" : $scope.TrsAmount,
					"EAccountTrsPwd" :  modalScope[0].EAccountTrsPwdId
				};
				$remote.post("Fms.TransferOut.do",p,function(data){
					$scope.Cash = data;
					//判断交易是否成功显示结果页
					if($scope.Cash.ReturnCode==="000000"){
						$scope.flag=true;
					}
					$scope.goto('#2');
				});
			};
			$scope.$showTrsPsdPage(message);
			
		}
		
	};
}