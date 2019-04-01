/*
登录交易
*/
LoginCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal', '$context'];

function LoginCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal, $context) {
	$scope.init = function(){
		$("#vPasswordWidget").PasswordWidget({'UseCache':false});
	};
    /**
     * 登录
     *
     */
	$scope.Login = function(){
		_hmt.push(['_trackEvent', '立即登录', 'click']);
		// 获得密码的长度
		$scope.vPasswordWidget=parseInt($("#vPasswordWidget").$getPasswordLength(),10);
		if(!$scope.vPasswordWidget || vx.equals($scope.vPasswordWidget,0)){
            $scope.$alert("请输入登录密码");
            return false;
		}
		if($scope.vPasswordWidget < 8 || $scope.vPasswordWidget > 20){
			$scope.$alert("手机号码或登录密码无效");
			return false;
		}
		$scope.Password = $("#vPasswordWidget").$getCiphertext();
		var param = {
			"LoginId" : $scope.LoginName,
			"Password" : $scope.Password,
			"LoginType" : "P",
			"VerCodeFlag" : "0"
		};
		$remote.post("Fms.LoginForChannel.do",param,function(data){
            //成功
		    $scope.resData = data;
			// 保存登录用户信息
            sessionStorage.setItem("userInfo",vx.toJson(data));
            $scope.goto($scope.LoginLastPage || 'app.Main');
		});
		
	};
	
	$scope.toOpenAc = function(){
		_hmt.push(['_trackEvent', '立即注册', 'click']);
		$scope.goto('app.OpenAccount');
	}

}
