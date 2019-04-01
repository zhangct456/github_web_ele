AcPswResetCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal'];

function AcPswResetCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal) {
    $scope.init = function(){
        $scope.userInfo=$scope.getUserInfo();
    };
    $scope.submitPre = function(){//录入页提交
        //显示设置交易密码弹窗
        $scope.$showSetTrsPsdPage({
            "sendSMS":function (params) {
                $scope.newPasswordWidget= params[0].newPasswordWidget;
                $scope.ConfirmPasswordWidget = params[0].ConfirmPasswordWidget;
                $scope.setTrsPsd();
            }
        });
    };
    // 重置交易密码
    $scope.setTrsPsd = function () {
        var message ={"MobilePhone":$scope.userInfo.MobilePhone,"TokenMessage":"sms.resettrspassword.msg"};
        message.sendSMS=function (modalScope) {
            var param ={
                "MobilePhone": $scope.userInfo.MobilePhone,
                "IdNo": vx.uppercase($scope.IdNo) ,
                "EaccountNo": $scope.userInfo.EAcNo,
                "EaccountAcName": $scope.userInfo.UserName,
                "EAccountTrsPwd": $scope.newPasswordWidget,
                "ConfirmTrsPassword": $scope.ConfirmPasswordWidget,
                "MsgAuthCode": modalScope[0].MsgAuthCode,
                "Messagetoken": modalScope[0].smsCodeToken
            };
            $remote.post("Fms.EAcPswReset.do",param,function (data) {
                $scope.goto('#2');
            });

        };
        //弹出发送短信验证码操作的模态框
        $scope.$showSmsPage(message);
    };

}
