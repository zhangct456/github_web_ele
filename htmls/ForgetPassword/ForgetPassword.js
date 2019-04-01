/*

*/
ForgetPasswordCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal'];

function ForgetPasswordCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal) {
	$scope.init = function(){
		$("#newPasswordWidget").PasswordWidget({'UseCache':false});
    	$("#ConfirmPasswordWidget").PasswordWidget();
	};
	$scope.submitPre = function(){//录入页提交
		// 获得密码的长度
		$scope.newPasswordLength=parseInt($("#newPasswordWidget").$getPasswordLength(),10);
        // 获得密码的内容
        $scope.newPasswordWidget = $("#newPasswordWidget").$getCiphertext();
        if(!$scope.newPasswordWidget||vx.equals($scope.newPasswordLength,0)){
            $scope.$alert("请输入您的新登录密码");
            return false;
        }
		if(!($scope.newPasswordLength>=8&&$scope.newPasswordLength<=20)){
				$scope.$alert("密码为8-20位数字、字母组成区分大小写");
				return false;
		}
		// 获得确认密码的长度
		$scope.ConfirmPasswordLength=parseInt($("#ConfirmPasswordWidget").$getPasswordLength(),10);
        $scope.ConfirmPasswordWidget = $("#ConfirmPasswordWidget").$getCiphertext();
        if(!$scope.ConfirmPasswordWidget||vx.equals($scope.ConfirmPasswordWidget,0)){
            $scope.$alert("请输入您的确认新登录密码");
            return false;
        }
		var message = { "MobilePhone": $scope.MobilePhone, "TokenMessage": "sms.findPassword.P" };
		message.sendSMS = function (modalScope) {
			var param = {
				"MobilePhone": $scope.MobilePhone,
				"IdNo": $scope.IDNumber,
				"UserId": $scope.UserName,
				"NewPassword": $scope.newPasswordWidget,
				"ConfirmPassword": $scope.ConfirmPasswordWidget,
				"MsgAuthCode": modalScope[0].MsgAuthCode,
				"Messagetoken": modalScope[0].smsCodeToken
			};
			$remote.post("Fms.LoginPswResetForChannel.do", param, function (data) {
				modalScope[0].close();
				$scope.goto('#2');
			});

		};
		$scope.$showSmsPage(message);
	};
	
}