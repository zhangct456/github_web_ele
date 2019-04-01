/*

*/
RiskAssessmentCtrl.$inject = ["$state", "$stateParams", "$cookieService", '$scope', '$remote', '$filter', '$timeout'];

function RiskAssessmentCtrl($state, $stateParams, $cookieService, $scope, $remote, $filter, $timeout) {
	$scope.init = function() {
		$scope.userInfo=$scope.getUserInfo();
		
		var p = {
			"MobilePhone": $scope.userInfo.MobilePhone
		};

		$remote.post("Fms.RiskLevQueryForChannel.do",p,function(data){
			$scope.RiskInfo = data;
		});
		
	};
	
	$scope.submitAnswers = function(){
		var score = 0;
		var detailArray = [];
		for (var i = 0 ; i < $scope.Questions.length-1 ; i ++) {
			score = score + ($scope.Questions[i].selectedIndex+1);
			var t = (i+1) + "_" + ($scope.Questions[i].selectedIndex+1);
			detailArray.push(t);
		}
		
		if($scope.Questions[$scope.Questions.length-1].selectedIndex == 0){
			score = score - 8;
		}
		
		detailArray.push((i+1)+"_"+($scope.Questions[i].selectedIndex+1));
		var detail = detailArray.toString();
		var p = {
  			"MobilePhone": $scope.userInfo.MobilePhone,
			"Score" : score,
			"Detail" : detail
		};
		$remote.post("Fms.RiskLevCalForChannel.do",p,function(data){
			$scope.riskRes = data;
			$scope.goto('#3');
		});
	};
	
	$scope.nextQuestion = function(){
		if($scope.timer){
			$timeout.cancel($scope.timer);
		}
		$scope.timer = $timeout(function(){
			if($scope.currentQueIndex < $scope.Questions.length-1){
				$scope.currentQueIndex ++;
			}else{
				$scope.submitAnswerFlag = true;
			}
		},500);
	};
	
	$scope.LastQuestion = function(){
		$scope.currentQueIndex --;
	};
	
	$scope.reAssessment = function(){
		vx.forEach($scope.Questions,function(item){
			delete item.selectedIndex;
		});
		$scope.submitAnswerFlag = false;
		$scope.currentQueIndex = 0;
		$scope.RiskInfo.Flag = 0;
		$scope.goto('#1');
	};
	
	//风险描述
	$scope.RiskTxt = {
		"1" : "您的风险承受能力低，对收益要求不高，追求资本金绝对安全。预期报酬率优于中长期存款利率，并确保本金在通货膨胀中发挥保值功能。",
		"2" : "您的风险承受度较低，能容忍一定幅度的本金损失，止损意识强。资产配置以低风险品种为主。",
		"3" : "您的风险承受度适中，偏向于资产均衡配置，能够承受一定的投资风险。同时，对资产收益要求高于保守型、谨慎型投资者。",
		"4" : "您偏向于激进的资产配置，对风险有较高的承受能力，投资收益预期相对较高，资产配置以股票等高风险品种为主，资产市值波动较大，除获取资本利得之外，也寻求投资差价收益。",
		"5" : "您对风险有非常高的承受能力，资产配置以高风险投资品种为主，投机性强，利用市场波动赢取差价，追求在较短周期内的收益最大化。"
	};
	
	//测评题目
	$scope.currentQueIndex = 0;//当前题目
	$scope.Questions = [{
		"Question": "您的主要收入来源是？",
		"Answers": [
			"无固定收入",
			"出租、出售房地产等非金融性资产收入",
			"利息、股息、转让证券等金融性资产收入",
			"生产经营所得",
			"工资、劳务报酬"
		]
	}, {
		"Question": "您最近3 年的个人年均收入是？",
		"Answers": [
			"10万元以下",
			"10-30万元",
			"30-50万元",
			"50-100万元",
			"100万元以上"
		]
	}, {
		"Question": "您的金融资产数额（不含自住、自用房产及汽车等固定资产）是？",
		"Answers": [
			"50万元以下",
			"50-100万元",
			"100-300万元",
			"300-500万元",
			"500万元以上"
		]
	}, {
		"Question": "您是否有尚未清偿的债务，如有，其性质是：？",
		"Answers": [
			"有，且包含以下多项债务类型",
			"有，住宅抵押贷款等长期定额债务",
			"有，信用卡欠款、消费信贷等短期信用债务",
			"有，亲朋之间借款",
			"没有"
		]
	}, {
		"Question": "以下描述中哪项符合您的实际情况？",
		"Answers": [
			"没有金融、投资相关的教育和学习经历",
			"学习过金融、投资相关课程或已取得金融相关专业学历",
			"具有金融相关专业学历，且有相关投资经历或金融行业工作经历",
			"具有金融相关专业学历，且职业是金融机构高级管理人员，或是具有职业资格认证的金融业务相关的注册会计师、律师",
			"不仅具有金融相关专业学历，职业是金融机构高级管理人员，或是有职业资格认证的金融业务相关的注册会计师、律师，还具有实际投资经历与经验",
		]
	}, {
		"Question": "您的投资经验如何？",
		"Answers": [
			"有限：除银行活期账户和定期存款外，基本没有其他投资经验",
			"一般：除银行活期账户和定期存款外，还买过国债、基金、保险中的低风险产品验",
			"丰富：有一定的投资经验，除投资于存款、低风险产品外，还购买过股票、基金等风险产品，但需要进一步的投资指导",
			"比较丰富：比较有经验的投资者，资产均衡地分布于存款、国债、银行理财产品、信托产品、股票、基金等，并倾向于自己做出投资决策",
			"非常丰富：非常有经验的投资者，大部分投资于股票、基金、外汇等高风险产品，参与过权证、期货或创业板等高风险产品的交易",
		]
	}, {
		"Question": "您认为较为理想的基金投资期限为？",
		"Answers": [
			"1年以下",
			"1-3年",
			"3-5年",
			"5-10年",
			"10年以上"
		]
	}, {
		"Question": "您打算投资以下哪类投资品种（本题选项按排列顺序依次向上覆盖，如选择“最后一项”即表示可同时投资全部品种）？",
		"Answers": [
			"货币及短期理财类产品",
			"固定收益类投资为主的产品",
			"含固定收益及权益类投资的混合类产品",
			"权益类投资为主的产品",
			"大宗商品、衍生品及其他投资类产品"
		]
	}, {
		"Question": "您可以承担的投资风险与期望收益为？",
		"Answers": [
			"厌恶风险，取得较少收益",
			"承受风险能力较小，取得适度收益",
			"承受银行同期存款风险，取得比存款稍高的收益",
			"可以承受与证券市场相当的风险，同时获得与市场表现相当的收益",
			"可以承受比证券市场波动更大的风险，同时获得超过市场表现的高收益"
		]
	}, {
		"Question": "您能承受的投资本金最大损失为？",
		"Answers": [
			"5%以内",
			"5%-10%",
			"10-30%",
			"30-50%",
			"50%以上"
		]
	}, {
		"Question": "您是否在银行或资本市场有过不良诚信记录？",
		"Answers": [
			"是",
			"否"
		]
	}];
}