# 表单验证助手
一款简单易用且适合复杂表单验证的插件

##特色
1. 简单易用
2. 为处理复杂表单逻辑而写 复杂场景如: 多个表单元素验证多个ajax异步验证 有条件式的校验
3. 验证逻辑处理模块与信息反馈界面模块分离 可利用验证逻辑处理模块编写自己的 信息反馈界面
4. 验证规则传参
5. 自定规则简单易学
```
<input type="text" data-valid="required ajax_checkAvalable" id="myElement">

```


##使用示例
变量 form 为逻辑处理模块负责处理数据有效性
变量 formValid 为用户界面模块 利用 变量form 返回的信息呈现到用户界面
```html
<form action="#">
	<input type="text" data-valid="required" placeholder="Username:" id="myElement">
	<input type="text" data-valid="required email" placeholder="Email:">
</form>
<script>
	// 单个元素校验 并显示相关 tooltips 提示
	formValid.test($('#myElement')).then(function(result){
		console.log(result);
		{
			$el: ..., // 表单$元素
			isPassed: ... // 是否通过 true or false
			allResults: ... // 所有规则校验结果
			errors: ... // 错误的校验结果
			msg: ... // 错误反馈信息 (第一条错误的规则)
			type: ... // 错误规则名称 (第一条错误的规则)
		}
	});

	// 多个表单元素校验 并显示相关 tooltips 提示
	var result = formValid.tests($('[data-valid]'), function(){
		console.log(result);
		{
			allResults: ... // 所有规则校验结果
			errors: ... // 错误的校验结果
			isPassed: ... // 是否通过 true or false
		}
	});
</script>
```

```html
<form action="#">
	<input type="text" data-valid="required email" placeholder="Email:">
	<input type="text" data-valid="minLength_10" placeholder="最少长度10">
</form>
<script>
	formValid.blurValid($('form'));
</script>
```

##API
```javascript
待补充

form.test($element).then(function(result){
	
});
form.tests($elements).then(function(result){
	
});

formValid.tests($elements).then(function(result){
	
});
formValid.tests($elements).then(function(result){
	
});
```

手动显示tooltips
```
formValid.tooltips.error($element, 'msg', isScroll); // isScroll 若为 true 则自动滚动到相应表单位置并显示 tooltips
```

###自定义验证规则
```html
<input type="text" data-valid="abc_1">
<script>
form.isAbc = function($el, argument1, argument2, ...){
	// $el 为表单元素 是一个 jQuery Object
	// arument1,2,3... 为规则参数, 即 data-valid="abc_1_2_3" 规则里面 以下划线分隔的参数
	console.log(arguments);

	var isPassed = false;
	
	if($el.val() == 'abc') {
		isPassed = true;
	}
	return {
			isPassed: false, // 规则验证结果
			type: 'abc', // 规则名称
			msg: 'abc' // 验证结果信息
		};
}
</script>
```

###自定义异步验证规则
以最为常见的ajax 验证为例
```html
<input type="text" data-valid="ajaxUsernameExist_argument">
<script>
form.isAjaxUsernameExist = function($el, argument, argument2, ...){
	var This = this;
	$.ajax({
	    url: href,
	    data: {
	    	value: $el.val()
	    	// 可以在这里 传 规则参数 argument 给后端协助验证
	    },
	    success: function (data) {
	        if(!data.isPassed) {
	        	This.resolve({
					isPassed: false,
					type: 'isAjaxUsernameExist',
					msg: '用户名不可用'
				});
				return;
	        }
	        if(!data.isPassed) {
	        	This.resolve({
					isPassed: true,
					type: 'isAjaxUsernameExist',
					msg: '用户名不可用'
				});
				return;
	        }
	        // 简短写法
	        This.resolve({
				isPassed: data.isPassed,
				type: 'isAjaxUsernameExist',
				msg: '用户名不可用'
			});
	    }
	});

	return This.promise();
}
</script>
```

###约定
1. 规则命名以 is 开头, 规则名称大写开头, 如 form.isCheckUsernameExist = function($el){};
2. 如果规则涉及异步验证, 如 ajax 等, 命名以 isAjax 开头 如 form.isAjaxUsernameExist = function($el){};
3. 规则名字不可含有 "-" "_"
4. 表格元素验证规则如含有异步检测, 推荐放到最后

###预设验证类型
* required
* email
* chinese
* noChinese
* zipcode
* mobile
* phone
* phoneCn
* numbers
* numbers_dot
* abc
* numbersAbcUnderline
* url
* username
* price
* chinaIdLoose
* chinaZip
* ipv4
* url
* minLength
* maxLength



###依赖说明
1. form 逻辑处理模块依赖 jQuery,
2. formValid 提示界面模块 依赖 [tooltipster](http://iamceege.github.io/tooltipster/)