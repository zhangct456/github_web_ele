/*

*/
RechargeCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter','$rootScope'];

function RechargeCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $rootScope) {
	$scope.init = function(){
		$scope.userInfo=$scope.getUserInfo();

		//查询账号所属银行,查询卡号开户行
		var p = {
			"AcNo" : $scope.userInfo.BandAcNo
		};
		$remote.post('Fms.QueryBankInfoForChannel.do',p,function(data){
			$scope.BankInfo = data;
		});
		
		var clip = new Clipboard('.Recharge-copy');
		clip.on('success',function(){
			$scope.$alert('复制成功');
		});
		clip.on('error',function(){
			$scope.$alert('复制失败，您的浏览器不支持');
		});
	};
	
	//发送充值交易请求
	$scope.doPre = function(){
		_hmt.push(['_trackEvent', '充值', 'click']);
		var message={};
		$scope.$showTrsPsdPage(message);
		message.sendSMS = function (modalScope) {
            var p = {
				"MobilePhone" : $scope.userInfo.MobilePhone,
				"AcNo" : $scope.userInfo.BandAcNo,
				"EaccountNo" : $scope.userInfo.EAcNo,
				"TrsAmount" : $scope.RechargeAmt+'',
				"EAccountTrsPwd" : modalScope[0].EAccountTrsPwdId
			};
			$remote.post("Fms.TransferIn.do",p,function(data){
				$scope.RechargeInfo = data;
				//判断交易是否成功显示结果页
				if($scope.RechargeInfo.ReturnCode==="000000"){
					$scope.flag=true;
				}
				$scope.goto('#2');
			});
        };
	};
	
	//复制电子账户
	$scope.copyEAcNo = function(){
		var eacNo = document.getElementById('copyEAcNo');
		eacNo.select();
		document.execCommand('Copy');
		$scope.$alert('复制完成');
	}
	
	//复制开户行
	$scope.copyOpenBank = function(){
		var eacNo = document.getElementById('copyOpenBank');
		eacNo.select();
		document.execCommand('Copy');
		$scope.$alert('复制完成');
	}
	
	//资金转入限额表
	$scope.TransferFundsList = [
		{"BankName" : "招商银行","Single" : "0","OneDay" : "0"},
		{"BankName" : "农业银行","Single" : "0","OneDay" : "0"},
		{"BankName" : "广发银行","Single" : "200000","OneDay" : "200000"},
		{"BankName" : "兴业银行","Single" : "200000","OneDay" : "200000"},
		{"BankName" : "平安银行","Single" : "50000","OneDay" : "50000"},
		{"BankName" : "民生银行","Single" : "0","OneDay" : "0"},
		{"BankName" : "华夏银行","Single" : "0","OneDay" : "0"},
		{"BankName" : "中信银行","Single" : "5000","OneDay" : "5000"},
		{"BankName" : "浦发银行","Single" : "50000","OneDay" : "50000"},
		{"BankName" : "邮储银行","Single" : "5000","OneDay" : "5000"},
		{"BankName" : "交通银行","Single" : "10000","OneDay" : "10000"},
		{"BankName" : "建设银行","Single" : "50000","OneDay" : "50000"},
		{"BankName" : "中国银行","Single" : "50000","OneDay" : "50000"},
		{"BankName" : "光大银行","Single" : "50000","OneDay" : "50000"},
		{"BankName" : "工商银行","Single" : "50000","OneDay" : "100000"}
	]
	
}