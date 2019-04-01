BindPhoneCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal','$targets'];

function BindPhoneCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal,$targets) {
    $scope.init = function(){
        $scope.userInfo=$scope.getUserInfo();
    };
    //录入页提交
    $scope.submitPre = function(){
        if(vx.equals($scope.userInfo.MobilePhone,$scope.NewMobilePhone)){
            $scope.$alert("新手机号与原手机号相同，请更换其它手机号码",function () {
                $scope.NewMobilePhone=undefined;
            });
            return false;
        }
        var message ={"MobilePhone":$scope.NewMobilePhone,"TokenMessage":"sms.UpdatePhone.U"};
        message.sendSMS=function (modalScope) {
            var param ={
                "MobilePhone": $scope.userInfo.MobilePhone,
                "NewMobilePhone": $scope.NewMobilePhone,
                "MsgAuthCode": modalScope[0].MsgAuthCode,
                "Messagetoken": modalScope[0].smsCodeToken
            };
            $remote.post("Fms.BindPhone.do",param,function (data) {
                $scope.userInfo.MobilePhone = data.NewMobilePhone;
                // 保存登录用户信息
                sessionStorage.setItem("userInfo",vx.toJson($scope.userInfo));
                $scope.result_img= "images/bd_cg.png?versionStr=bZQhhcdSnG1525942067665";
                $scope.goto('#2');
            });

        };
        //弹出发送短信验证码操作的模态框
        $scope.$showSmsPage(message);
    };

}
