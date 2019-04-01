/*
（1）优选理财显示金额为用户在合作银行的在投金额之和，不含已兑付的投资金额。
（2）总资产＝账户余额＋持有金额
*/
MyAssetsCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$rootScope'];

function MyAssetsCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $rootScope) {
	$scope.init = function(){
		$scope.userInfo=$scope.getUserInfo();
		//查询资产余额
		var p = {
			"MobilePhone" : $scope.userInfo.MobilePhone,
			"EaccountNo" : $scope.userInfo.EAcNo
		};
		$remote.post("Fms.EAcctIntelQry.do",p,function(data){
			$scope.AssetsInfo = data;
		});
		
		//查询累计收益
		var p = {
			"MobilePhone" : $scope.userInfo.MobilePhone,
			"EaccountNo" : $scope.userInfo.EAcNo
		};
		$remote.post("Fms.MyInvestViewForChannel.do",p,function(data){
			$scope.Cumulative = data;
		});
		
		
		//查询风险测评信息
		var p = {};
		$remote.post("Fms.RiskLevQueryForChannel.do",p,function(data){
			$scope.RiskInfo = data;
		});
	};

	//跳转提现方法，检测余额是否为零
	$scope.cash = function(){
      if($scope.AssetsInfo.DepositAvailBal=="0.00"){
          $scope.$alert("当前余额为零，无法提现");
	  }else{
	  	_hmt.push(['_trackEvent', '提现', 'click']);
		$scope.goto('app.WithdrawCash');
	  }
	};
	
	//前往充值页面
	$scope.toRecharge = function(){
		_hmt.push(['_trackEvent', '充值', 'click']);
		$scope.goto('app.Recharge');
	};
	
}