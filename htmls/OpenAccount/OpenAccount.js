/*

*/
OpenAccountCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal', '$takePhoto' ,'$timeout'];

function OpenAccountCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal, $takePhoto, $timeout) {
	$scope.init = function(){
		$scope.formData = {};
		$scope.TiedCardInfo = {};
		$scope.formData.Occupation = '0';
		$scope.formData.Education = '10';
		$scope.path = '#4';
		$scope.formData.frontImg = '';
		$scope.formData.backImg = '';
	};
	// 初始化密码
	$scope.loginPasswordInit = function(){
		$("#newLoginPasswordWidget").PasswordWidget({'UseCache':false});
        $("#newTradePasswordWidget").PasswordWidget();
	};
	
	//身份证初始化
	$scope.authInitFn = function() {
		$timeout(function() {
			$scope.positiveImg = $takePhoto("positiveImg", "positiveImgBox", '1');
			$scope.oppositeImg = $takePhoto("oppositeImg", "oppositeImgBox", '1');
		}, 500);
	};
	
	$scope.$on("takephotoFinishEvent", function(event, data) {
		if (data.picinfo == "positiveImgBox") {
			$scope.formData.frontImg = $scope.positiveImg.getList();
		} else if (data.picinfo == "oppositeImgBox") {
			$scope.formData.backImg = $scope.oppositeImg.getList();
		}
	});
	
	$scope.submitOpenInfo = function(){//提交开户信息
		if(vx.equals($scope.formData.frontImg,'')){
			$scope.$alert('请上传身份证正面照');
			return false;
		}
		if(vx.equals($scope.formData.backImg,'')){
			$scope.$alert('请上传身份证反面照');
			return false;
		}
		var message = {"MobilePhone": $scope.formData.MobilePhone, "TokenMessage": "sms.RegisterPre.P"};
		message.sendSMS = function (modalScope) {
			var param = {
				"MobilePhone": $scope.formData.MobilePhone,
				"MsgAuthCode": modalScope[0].MsgAuthCode,
				"Messagetoken": modalScope[0].smsCodeToken,
				"ReferrNo": "",
				"UserName": $scope.formData.UserName,
				"IdNo": $scope.formData.IDNumber.toLocaleUpperCase(),
				"UserDuty": $scope.formData.Occupation,
				"Education": $scope.formData.Education,
				"IdentityFront": $scope.formData.frontImg, //身份证正面
				"IdentityBack": $scope.formData.backImg //身份证背面
			};
			$remote.post("Fms.RegisterCifInfo.do", param, function(data){
				$scope.userSeq = data.UserSeq;
				$scope.TiedCardInfo.CardNo=undefined;
				$scope.goto("#2");
			});
		};
		$scope.$showSmsPage(message);
	};
	
	$scope.submitTiedCard = function(){//提交绑卡信息
		//根据输入卡号判断银行
		var p = {
			"AcNo" : $scope.TiedCardInfo.CardNo
		};
		$remote.post("Fms.QueryBankInfoForChannel.do",p,function(data){
			$scope.TiedCardInfo.BankInfo = data;
			var p = {
				"MobilePhone" : $scope.formData.MobilePhone,
				"IdNo" : $scope.formData.IDNumber.toLocaleUpperCase(),
				"AcNo" : $scope.TiedCardInfo.CardNo,
				"PayeeBankId" : $scope.TiedCardInfo.BankInfo.BankId,
				"PayeeBankName" : $scope.TiedCardInfo.BankInfo.BankName,
				"UserSeq" : $scope.userSeq
			};
			$remote.post("Fms.RegisterCardInfo.do",p,function(data){
				$scope.goto('#3');
				$scope.path = '#3';
			});
		});
	};
	
	$scope.submitLoginPassword = function(){//设置登录密码
		$scope.newLoginPasswordLength=parseInt($("#newLoginPasswordWidget").$getPasswordLength(),10);
        // 获得密码的内容
        $scope.newLoginPasswordWidget = $("#newLoginPasswordWidget").$getCiphertext();
        if(!$scope.newLoginPasswordWidget||vx.equals($scope.newLoginPasswordLength,0)){
            $scope.$alert("登录密码不符合要求格式");
            return false;
        }
        if(!($scope.newLoginPasswordLength>=8&&$scope.newLoginPasswordLength<=20)){
            $scope.$alert("登录密码不符合要求格式");
            return false;
        }
        //获取登录密码的长度
        $scope.newTradePasswordLength=parseInt($("#newTradePasswordWidget").$getPasswordLength(),10);
        if(!vx.equals($scope.newTradePasswordLength,6)){
            $scope.$alert("请输入6位数字交易密码");
            return false;
        }
        $scope.newTradePasswordWidget = $("#newTradePasswordWidget").$getCiphertext();
		if(!$scope.AgreeFlag){
            $scope.$alert("请阅读并同意相关协议");
            return false;
		}
        if($scope.AgreeFlag){
            var p = {
                "MobilePhone" : $scope.formData.MobilePhone,
                "IdNo" : $scope.formData.IDNumber.toLocaleUpperCase(),
                "Password" : $scope.newLoginPasswordWidget,
                "EAccountTrsPwd" : $scope.newTradePasswordWidget,
                "UserSeq" : $scope.userSeq
            };

            $remote.post("Fms.Register.do",p,function(data){
                $scope.returnInfo = data;
                if(data.ReturnCode === "000000"){
                    $scope.goto('#4');//开户成功
                }else{
                    $scope.goto('#5');//开户失败
                }
            });
		}
	};
	$scope.viewProtocol1 = function(){
		$scope.goto('#6');
	};

	$scope.viewProtocol2 = function(){
		$scope.goto('#7');
	};

	$scope.gobackto = function(){
		$scope.goto($scope.path);
	};
	
	$scope.OpenFin = function(){
		$scope.goto('app.Login');
	}
}