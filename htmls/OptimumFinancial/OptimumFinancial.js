/*

*/
OptimumFinancialCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$rootScope', '$scrollPage','$timeout', '$os'];

function OptimumFinancialCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $rootScope, $scrollPage, $timeout, $os) {
	$scope.init = function () {
		$scope.userInfo = $scope.getUserInfo();

		// 分页参数配置
		$scope.setPageInfo();

		// 还款方式
		$scope.InvePayWay = {
			"D": "一次性还本付息",
			"R": "先息后本"
		};
		
		$scope.FinaListShowFlag = 2;
		$scope.getFinInfo();
	};
	//获取理财信息
	$scope.getFinInfo = function (){
		var p = {
			"MobilePhone": $scope.userInfo.MobilePhone,
			"EaccountNo": $scope.userInfo.EAcNo
		};
		$remote.post("Fms.MyInvestViewForChannel.do", p, function (data) {
			$scope.MyInvestInfo = data;
			//获取理财产品信息
			$scope.getProducList($scope.FinaListShowFlag);
		},function (){
			$scope.reloadFlag = true;
		});
	};
	
	
	// 查询列表
	$scope.nextPage = function () {
		var pageIndex = ($scope.params.currentPage - 1) * $scope.params.pageSize;
		$timeout(function () {
			$scope.projectList = vx.copy($scope.productTotalList).splice(pageIndex, $scope.params.pageSize);
			// 把新查询到的数据组装需要展示的数据
			$scope.showProjectList = $scope.showProjectList.concat($scope.projectList);
			// 总数据条数
			// 判断已经查询完所有数据时，停止分页
			$scope.endFlag = $scope.showProjectList.length < $scope.recordNumber ? false : true;
			$timeout(function () {
				// 刷新数据
				$scope.showProjectList = $scope.showProjectList;

				// 判断已经查询完所有数据时，停止分页
				if ($scope.endFlag) {
					$scrollPage.disable();
				}
				// 当分页对象存在时，刷新分页
				if ($scope.scroller) {
					$scope.scroller.refresh();
				}
			}, 0);
		}, 500);
	};
	
	//获取理财产品信息
	$scope.getProducList = function (flag) {
		$scope.FinaListShowFlag = flag||$scope.FinaListShowFlag;
		$scope.setPageInfo();
		var p = {
			"MobilePhone": $scope.userInfo.MobilePhone,
			"EaccountNo": $scope.userInfo.EAcNo,
			"SortType": 4
		};
		if (flag == 1) {
			p.InvestState = "6";
		} else if (flag == 2) {
			p.InvestState = "";
		} else if (flag == 3) {
			p.InvestState = "5";
		}
		$remote.post("Fms.MyInvestListQryForChannel.do", p, function (data) {
			$scope.reloadFlag = false;
			$scope.productTotalList = data.List;
			$scope.showProjectList = [];
			$scope.recordNumber = data.Total;
			$scope.scrollerPage();
		},function(){
			$scope.reloadFlag = true;
		});
	};
	$scope.scrollFirstFlag = true;
	// 重置scroll数据
	$scope.scrollerPage = function () {
		if ($scope.scroller) {
			$scope.scroller.destroy();
		}
		// 获得首页的数据
		$scope.nextPage();
		$scope.scroller = $scrollPage.create("scrollWrap", function (noMoreFn) { //上拉加载函数
//			if($scope.scrollFirstFlag){
//				$('#pullUp_Hide').slideUp(200,function(){
//					$('#pullUp_Hide').show();
//					window.scrollTo(0,800);
//				});
//			}
			window.scrollTo(0,800);
//			$('#scrollWrap').animate({'top':'8vw'},200);
			if ($scope.recordNumber > $scope.showProjectList.length) {
				$scope.params.currentPage = $scope.params.currentPage + 1;
				// 需要查询的页码
				$scope.nextPage();

			} else {
				noMoreFn(true);
			}
		}, function () { //下拉刷新函数
			$scope.getProducList($scope.FinaListShowFlag);
		});
	};

	// 分页参数配置
	$scope.setPageInfo = function () {
		$scope.params = {
			pageSize: 5,
			currentPage: 1
		};
		$scope.recordNumber = 0;
		$scope.showProjectList = [];
		$scope.noDataFlag = false;
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
	/********end */

	$scope.showDetail = function (row) {
		$scope.currentRecord = row;
		$scope.goto('#2');
	};

	$scope.viewProdDetail = function () {
		var p = {
			"InvestProdno": $scope.currentRecord.InvestProdno,
			"InstNo": $scope.currentRecord.InstNo
		};
		$remote.post("Fms.InvestDetailsQry.do", p, function (data) {
			$scope.prodDetail = data;
			$scope.goto('#3');
		});

	};

	$scope.viewInveProtocol = function () {
		var p = {
			"InvestProdno": $scope.currentRecord.InvestProdno,
			"Type": "S"
		};
		$remote.post("Fms.InvestAgreementForChannel.do", p, function (data) {
			$scope.InvestAgreement = data.InvestAgreement;
			$scope.goto('#4');
		});

	};

	$scope.viewBorrowProtocol = function () {
		var p1 = {
			"InvestProdno": $scope.currentRecord.InvestProdno,
			"Type": "B"
		};
		$remote.post("Fms.InvestAgreementForChannel.do", p1, function (data) {
			var p2 = {
				"InvestProdno": $scope.currentRecord.InvestProdno,
				"InstNo": $scope.currentRecord.InstNo
			};
			$remote.post("Fms.InvestDetailsQry.do", p2, function (dataa) {
				var InvestAgreement =
					data.InvestAgreement.replace('\{ProtocolNumber\}', dataa.ProtocolNumber)//协议编号
						.replace('\{IUserName\}', $scope.userInfo.UserName)//投资人
						.replace('\{IIdNo\}', $scope.userInfo.IdNo)//身份证号
						.replace('\{BProtocolUserName\}', dataa.BProtocolUserName)//融资人
						.replace('\{BIdNo\}', dataa.BIdNo)//统一社会信用代码(身份证号)
						.replace('\{BProtocolUserName\}', dataa.BProtocolUserName)//融资人
						.replace('\{BProScanl\}', dataa.BProScanl)//融资总额
						.replace('\{DeadLine\}', dataa.DeadLine)//融资天数
						.replace('\{BeginDate\}', dataa.BeginDate)//起息日
						.replace('\{EndDate\}', dataa.EndDate)//到期日
						.replace('\{IUserName\}', $scope.userInfo.UserName)//投资人
						.replace('\{IAmount\}', dataa.IAmount)//投资金额
						.replace('\{YRate\}', dataa.YRate)//投资利率
						.replace('\{LoanPurpose\}', dataa.Purpose)//融资用途
						.replace('\{PayMode\}', $scope.InvePayWay[dataa.PayMode]);//还款方式
				$scope.InvestAgreement = InvestAgreement;
				$scope.goto('#5');
			});
		});
	};
	
}