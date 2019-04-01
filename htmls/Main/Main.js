/*
公告部分一期不测试使用
*/
MainCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', "$scrollPage", "$context", '$rootScope', '$timeout', '$os', '$rootScope'];

function MainCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $scrollPage, $context, $rootScope, $timeout, $os, $rootScope) {
	$scope.init = function() {
		$scope.InvePayWay = {
			"D" : "一次性还本付息",
			"R" : "先息后本"
		};

		$scope.userInfo=$scope.getUserInfo();
		if($scope.userInfo){
			$scope.loginState = true;
		}
		
		//公告信息
		//$remote.post("",{},function(data){
		//	$scope.noticeList = [{}, {}, {}];
		//	$scope.noticeState = false;//是否有新信息
		//})
		
        // 分页参数配置
		$scope.setPageInfo();
        
        //获取理财产品信息
		$scope.getProducList();
		
	};
	
	// 查询列表
    $scope.nextPage = function () {
        var pageIndex = ($scope.params.currentPage - 1) * $scope.params.pageSize;
		$timeout(function(){
            $scope.projectList = vx.copy($scope.productTotalList).splice(pageIndex,$scope.params.pageSize);
            // 把新查询到的数据组装需要展示的数据
            $scope.showProjectList = $scope.showProjectList.concat($scope.projectList);
            // 判断已经查询完所有数据时，停止分页
            $scope.endFlag = $scope.showProjectList.length < $scope.recordNumber ? false : true;
            $timeout(function () {
                // 刷新数据
                $scope.showProjectList=$scope.showProjectList;
                // 判断已经查询完所有数据时，停止分页
                if ($scope.endFlag) {
                    $scrollPage.disable();
                }
                // 当分页对象存在时，刷新分页
                if ($scope.scroller) {
                    $scope.scroller.refresh();
                }
            }, 0);
		},500);
    };
	// 重置scroll数据
    $scope.scrollerPage = function () {
        if ($scope.scroller) {
            $scope.scroller.destroy();
        }
        // 获得首页的数据
        $scope.nextPage();
        $scope.scroller = $scrollPage.create("scrollWrapId", function (noMoreFn) { //上拉加载函数
            if ($scope.recordNumber > $scope.showProjectList.length) {
                $scope.params.currentPage = $scope.params.currentPage + 1;
                // 需要查询的页码
                $scope.nextPage();

            } else {
                noMoreFn(true);
            }
        }, function () { //下拉刷新函数
        	$scope.setPageInfo();
            $scope.getProducList();
        });
    };
	
	//获取理财产品信息
	$scope.getProducList = function(){
		$scope.reloadFlag = false;
		$remote.post("Fms.InvestListQry.do",{PrdScopeType:'1'},function(data){
			$scope.productTotalList = data.List;
			
			$scope.showProjectList = [];
			$scope.recordNumber = data.Total;
			
			$scope.scrollerPage();
		},function(data){
			$scope.reloadFlag = true;
		});
	};
	
	//选择产品投资
	$scope.InvestmentProduct = function(row){
		_hmt.push(['_trackEvent', '产品购买', 'click']);
		var currentProduct = vx.copy(row);
		$scope.$context.setNextScope({"currentProduct":currentProduct});
		$scope.goto('app.Investment');
	};
	
	// 分页参数配置
	$scope.setPageInfo = function(){
        $scope.params = {
            pageSize : 10,
            currentPage : 1
        };
        $scope.recordNumber = 0;
        $scope.showProjectList = [];
        $scope.noDataFlag=false;
	};
	
	//前往开户页面
	$scope.toOpenAc = function(){
		_hmt.push(['_trackEvent', '我要开户', 'click']);
		$rootScope.LoginLastPage = 'app.Main';
		$scope.goto('app.OpenAccount');
	}
	//前往登录页面
	$scope.toLogin = function(){
		_hmt.push(['_trackEvent', '我要登录', 'click']);
		$rootScope.LoginLastPage = 'app.Main';
		$scope.goto('app.Login');
	}
	//前往我的资产
	$scope.toMyAssets = function(){
		_hmt.push(['_trackEvent', '我的资产', 'click']);
		$scope.goto('app.MyAssets');
	}
}