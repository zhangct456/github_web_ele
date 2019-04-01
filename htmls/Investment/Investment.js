/*

*/
InvestmentCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$modal', '$rootScope'];

function InvestmentCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $modal, $rootScope) {
	$scope.init = function(){
		$scope.formData = {};
		$scope.queryRiskFlag = false;
		
		$scope.userInfo=$scope.getUserInfo();
		
		$scope.InvePayWay = {
			"D" : "一次性还本付息",
			"R" : "先息后本"
		};
		
		//判断项目进度
		$scope.productSchedule = [
			"images/yx_xmjd1_2.png?versionStr=bZQhhcdSnG1525942067665",
			"images/yx_xmjd2_2.png?versionStr=bZQhhcdSnG1525942067665",
			"images/yx_xmjd3_2.png?versionStr=bZQhhcdSnG1525942067665"
		];
		var today = new Date();
		var begin = new Date($scope.currentProduct.BeginDate);
		var interest = new Date($scope.currentProduct.LatestInterestDate);
		var end = new Date($scope.currentProduct.EndDate);
		if(today < begin){
			
		}else if(today < interest){
			$scope.productSchedule[0] = "images/yx_xmjd1_1.png?versionStr=bZQhhcdSnG1525942067665";
		}else if(today < end){
			$scope.productSchedule[0] = "images/yx_xmjd1_1.png?versionStr=bZQhhcdSnG1525942067665";
			$scope.productSchedule[1] = "images/yx_xmjd2_1.png?versionStr=bZQhhcdSnG1525942067665";
		}else{
			$scope.productSchedule[0] = "images/yx_xmjd1_1.png?versionStr=bZQhhcdSnG1525942067665";
			$scope.productSchedule[1] = "images/yx_xmjd2_1.png?versionStr=bZQhhcdSnG1525942067665";
			$scope.productSchedule[2] = "images/yx_xmjd3_1.png?versionStr=bZQhhcdSnG1525942067665";
		}
		
		//余额查询
		if($scope.userInfo){
			var p = {
				"MobilePhone" : $scope.userInfo.MobilePhone,
				"EaccountNo" : $scope.userInfo.EAcNo
			};
			$remote.post("Fms.EAcctIntelQry.do",p,function(data){
				$scope.BalanceInfo = data;
			});
		}
		
		//判断募集进度状态
		if($scope.currentProduct.RemainAmt == 0){
			
		}
	};
	
	//录入页提交方法
	$scope.doPre = function(){
		_hmt.push(['_trackEvent', '提交', 'click']);
		//检查是否登录
		if(!$scope.userInfo){
			$scope.$confirm({
				title: "温馨提示",
				content: "您还未登录本行电子账户，请前往完成登录，再进行此交易。",
				ok: function() {
					$rootScope.LoginLastPage = 'app.Investment';
					$scope.goto('app.Login');
				}
			});
			return;
		}
		
		if($scope.queryRiskFlag){
			$scope.doSubmit();
		}else{
			//检查风险等级
			$remote.post("Fms.RiskLevQueryForChannel.do",{},function(data){
				//已登陆，未进行风险评估或风险评估过期
				if(data.Flag == 0){
					$scope.$confirm({
						title: "温馨提示",
						content: "您还未进行风险评估或评估已过期，请先完成风险评估测试。",
						ok: function() {
							$scope.goto('app.RiskAssessment');
						}
					});
					return;
				}
				//风险评估等级过低，不符合该产品要求
				if(data.RiskLev < $scope.currentProduct.InvestRiskLevel){
					$scope.$confirm({
						title: "温馨提示",
						content: "您的风险评估等级过低，不符合该产品要求，是否继续购买。",
						ok: function() {
							$scope.queryRiskFlag = true;
							$scope.doSubmit();
						}
					});
					return;
				}
				$scope.doSubmit();
			});
		}
	};
	
	//
	$scope.doSubmit = function(){
			//是否输入金额
			if(!$scope.formData.TrsAmount){
				$scope.$alert({
					title: "温馨提示",
	        		content: "请输入投资金额。"
				});
				return;
			}
			//是否勾选协议
			if(!$scope.AgreeFlag){
				$scope.$alert({
					title: "温馨提示",
	        		content: "请阅读并同意相关协议后再进行交易。"
				});
				return;
			}
			//检查剩余募集额度是否足够
			if(Number($scope.formData.TrsAmount) > Number($scope.currentProduct.RemainAmt)){
				$scope.$alert({
					title: "温馨提示",
	        		content: "投资金额大于可购金额"
				});
				return;
			}
			//可用余额不足
			if(Number($scope.formData.TrsAmount) > Number($scope.BalanceInfo.DepositAvailBal)){
				$scope.$confirm({
					title: "温馨提示",
					content: "您的可用余额不足，请前往充值，再进行此交易。",
					ok: function() {
						$scope.goto('app.Recharge');
					}
				});
				return;
			}
			//检查金额输入
			if(!$scope.checkAmount()){
				return;
			}
			//可以购买
			var p = {
				"MobilePhone" : $scope.userInfo.MobilePhone,
				"EaccountNo" : $scope.userInfo.EAcNo,
				"InvestProdno" : $scope.currentProduct.InvestProdno,
				"BuyAmt" : $scope.formData.TrsAmount,
				"PrdType" : $scope.currentProduct.PrdType,
				"ProjectName" : $scope.currentProduct.ProjectName,
				"ProjectScale" : $scope.currentProduct.ProjectScale,
				"BeginDates" : $scope.currentProduct.BeginDate,
				"InvestLimit" : $scope.currentProduct.InvestLimit,
				"ExpectIncome" : $scope.currentProduct.ExpectIncome,
				"EndDates" : $scope.currentProduct.EndDate
			};
			$scope.$showTrsPsdPage({
				sendSMS: function(modalScope) {
					p.EAccountTrsPwd = modalScope[0].EAccountTrsPwdId;
					
					$remote.post("Fms.InvestBuyForChannel.do",p,function(data){
						$scope.returnInfo = data;
						$scope.goto('#3');
					});
				}
			});
	}
	
	//检验金额
	$scope.checkAmount = function(){
		if(!(/(^[1-9]([0-9]{0,11})?(\.[0-9]{1,2})?$)|(^0\.[1-9]([0-9])?$)|(^0\.[1-9]([1-9])?$)|(^0\.0([1-9])+$)/.test($scope.formData.TrsAmount))){
			$scope.$alert("金额错误，请重新输入");
			return;
		}
		if(Number($scope.formData.TrsAmount) < Number($scope.currentProduct.MinInvestAmt)){
			$scope.$alert("投资金额应大于等于起购金额");
			return;
		}
		if(Number($scope.formData.TrsAmount) > Number($scope.currentProduct.MaxInvestAmt)){
			$scope.$alert("投资金额应小于单笔最大投资金额");
			return;
		}
		if((Number($scope.formData.TrsAmount)-Number($scope.currentProduct.MinInvestAmt))%Number($scope.currentProduct.EachAmt)!=0){
			$scope.$alert("投资金额大于起购金额部分应为递增金额的整数倍");
			return;
		}
		return true;
	};
	
	//计算收益
	$scope.$watch('formData.TrsAmount',function(){
		$scope.ProspectiveEarnings = $scope.formData.TrsAmount * ($scope.currentProduct.ExpectIncome/360) * $scope.currentProduct.InvestLimit;
	});
	
	//查看详情
	$scope.viewDetail = function(){
		$scope.goto('#2');
	};
	
	$scope.viewProtocol1 = function(){
		var p = {
			"InvestProdno":$scope.currentProduct.InvestProdno,
			"Type":"S"
		};
		$remote.post("Fms.InvestAgreementForChannel.do", p, function(data){
			$scope.Agreement = data.InvestAgreement;
			$scope.ProtocolTitle = "协议";
			$scope.goto('#4');
		});
	};
	
	$scope.viewProtocol2 = function(){
		var p = {
			"InvestProdno":$scope.currentProduct.InvestProdno,
			"Type":"B"
		};
		$remote.post("Fms.InvestAgreementForChannel.do", p, function(data){
			var Agreement = data.InvestAgreement;
			var p2 = {
				"InvestProdno" : $scope.currentProduct.InvestProdno
			};
			$remote.post("Fms.InvestDetailsQry.do", p2 , function(data){
				if($scope.userInfo){
					$scope.Agreement = Agreement.replace('\{ProtocolNumber\}', data.ProtocolNumber)//协议编号
						.replace('\{IUserName\}', $scope.userInfo.UserName)//投资人
						.replace('\{IIdNo\}', $scope.userInfo.IdNo)//身份证号
						.replace('\{BProtocolUserName\}', data.BProtocolUserName)//融资人
						.replace('\{BIdNo\}', data.BIdNo)//统一社会信用代码(身份证号)
						.replace('\{BProtocolUserName\}', data.BProtocolUserName)//融资人
						.replace('\{BProScanl\}', data.BProScanl)//融资总额
						.replace('\{DeadLine\}', data.DeadLine)//融资天数
						.replace('\{BeginDate\}', data.BeginDate)//起息日
						.replace('\{EndDate\}', data.EndDate)//到期日
						.replace('\{IUserName\}', $scope.userInfo.UserName)//投资人
						.replace('\{IAmount\}', $scope.formData.TrsAmount?$scope.formData.TrsAmount:0)//投资金额
						.replace('\{YRate\}', data.YRate)//投资利率
						.replace('\{LoanPurpose\}', data.Purpose)//融资用途
						.replace('\{PayMode\}', $scope.InvePayWay[data.PayMode]);//还款方式
				}else{
					$scope.Agreement = Agreement.replace('\{ProtocolNumber\}', data.ProtocolNumber)//协议编号
						.replace('\{IUserName\}', '')//投资人
						.replace('\{IIdNo\}', '')//身份证号
						.replace('\{BProtocolUserName\}', data.BProtocolUserName)//融资人
						.replace('\{BIdNo\}', data.BIdNo)//统一社会信用代码(身份证号)
						.replace('\{BProtocolUserName\}', data.BProtocolUserName)//融资人
						.replace('\{BProScanl\}', data.BProScanl)//融资总额
						.replace('\{DeadLine\}', data.DeadLine)//融资天数
						.replace('\{BeginDate\}', data.BeginDate)//起息日
						.replace('\{EndDate\}', data.EndDate)//到期日
						.replace('\{IUserName\}', '')//投资人
						.replace('\{IAmount\}', $scope.formData.TrsAmount?$scope.formData.TrsAmount:0)//投资金额
						.replace('\{YRate\}', data.YRate)//投资利率
						.replace('\{LoanPurpose\}', data.Purpose)//融资用途
						.replace('\{PayMode\}', $scope.InvePayWay[data.PayMode]);//还款方式
				}
				$scope.ProtocolTitle = "协议";
				$scope.goto('#4');
			});
		});
	};
}