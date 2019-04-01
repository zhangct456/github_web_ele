/*

*/
TransDetailsCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$rootScope', '$scrollPage', '$timeout', '$os'];

function TransDetailsCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $rootScope, $scrollPage, $timeout, $os ) {
	$scope.init = function(){
		$scope.userInfo=$scope.getUserInfo();
		$scope.DateArray = $scope.getDateArray();
		$scope.queryDate = $scope.DateArray[0];
		$scope.changeDate();
	};
	
	//查询数据请求
	$scope.doQuery = function(PageIndex){
		var p = {
			"EaccountNo" : $scope.userInfo.EAcNo,
			"BeginDates" : $scope.queryDate.beginDate,
			"EndDates" : $scope.queryDate.endDate,
			"PageIndex" : PageIndex+"",
			"PageSize" : '10'
		};
		$remote.post("Fms.TransListQuery.do",p,function(data){
			$scope.list_o =$scope.list_o.concat(data.List);
		});
	};
	
	//改变时间查询数据方法
	$scope.changeDate = function(){
		$scope.setPageInfo();
		$scope.scrollerPage();
	};
	
	// 查询列表
    $scope.nextPage = function () {
    	$scope.nextPageIndex = $scope.params.currentPage + 1;
        var p = {
			"EaccountNo" : $scope.userInfo.EAcNo,
			"BeginDates" : $scope.queryDate.beginDate,
			"EndDates" : $scope.queryDate.endDate,
			"PageIndex" : $scope.nextPageIndex+"",
			"PageSize" : $scope.params.pageSize
		};
        $remote.post("Fms.TransListQuery.do", p, function (response) {
            $scope.projectList = response.List;
            // 把新查询到的数据组装需要展示的数据
            $scope.list_o = $scope.list_o.concat($scope.projectList);
            $scope.params.currentPage = $scope.nextPageIndex;
           
            // 判断已经查询完所有数据时，停止分页
            $scope.endFlag = (($scope.projectList.length != 0) && (($scope.list_o.length % $scope.params.pageSize) == 0)) ? false : true;
            $timeout(function () {
                // 刷新数据
                $scope.list_o=$scope.list_o;

                // 判断已经查询完所有数据时，停止分页
                if ($scope.endFlag) {
                    $scrollPage.disable();
                }
                // 当分页对象存在时，刷新分页
                if ($scope.scroller) {
                    $scope.scroller.refresh();
                }
            }, 0);
        });
    };
	// 重置scroll数据
    $scope.scrollerPage = function () {
        if ($scope.scroller) {
            $scope.scroller.destroy();
        }
        // 获得首页的数据
        $scope.nextPage();
        $scope.scroller = $scrollPage.create("scrollWrap", function (noMoreFn) { //上拉加载函数
            $scope.nextPage();
		}, function () { //下拉刷新函数
			$scope.changeDate();
        });
    };
	
	//计算当前时间之前一年，查询一年内记录
	$scope.getDateArray = function(){
		var today = new Date();
		var year = today.getYear()+1900;
		var month = today.getMonth()+1;
		queryDate = [];
		for( var i = 0 ; i < 12 ; i ++){
			var d = year + '-' + ((month<10)?('0'+month):month)+'-01';
			var d1 = new Date(d);
			var d2 = new Date(d);
			d2.setMonth(month);
			var tt = (d2-d1)/1000/3600/24;
			queryDate.push({
				"view" : $filter('date')(d1,'yyyy-MM'),
				"beginDate" : $filter('date')(d1,'yyyyMMdd'),
				"endDate" : $filter('date')(d1,'yyyyMM')+tt
			});
			if(--month == 0){
				month = 12;
				year -- ;
			}
		}
		return queryDate;
	};
	
	// 分页参数配置
	$scope.setPageInfo = function(){
        $scope.params = {
            pageSize : 10,
            currentPage : 0
        };
        $scope.recordNumber = 0;
        $scope.list_o = [];
        $scope.noDataFlag=false;
        // 设置查询页面与滑动区域的开始位置 start
        // 安卓等其他手机
        $scope.scrollWraptop = 220;
        $scope.wraptop = 55;
        $scope.blueline = false;
        if ($os.ios === true) {
            // 苹果手机
            $scope.scrollWraptop = 239;
            $scope.wraptop = 74;
            $scope.blueline = true;
        }
	};
}