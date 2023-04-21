let dmAPI = {
	runOnReady: (functionName, callback) => {
		if (functionName) {
			callback();
		} else {
			console.error("Please Enter Function Name!");
		}
	},
	loadScript: (url, callback) => {
		var fjs = document.getElementsByTagName("script")[0];
		script = document.createElement("script");
		script.src = url;
		fjs.parentNode.insertBefore(script, fjs);
		if (script.readyState) { //IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" ||
					script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { //Others
			script.onload = function () {
				callback();
			};
		}
		script.src = url;
		fjs.parentNode.insertBefore(script, fjs);
	}
};
let element = $('.widget-abc123');
let data = {
	config: {
		currency: "$"
	}
}

var currency = data.config.currency;

$(element).find('#loanRate').focus(function () {
	$(element).find('div.rateMeter').show();
	$(document).bind('focusin.rateMeter click.rateMeter', function (e) {
		if ($(e.target).closest('.rateMeter, #loanRate').length) return;
		$(document).unbind('.rateMeter');
		$(element).find('div.rateMeter').hide();
	});
});
$(element).find('div.rateMeter').hide();

$(element).find('#loanTerms').focus(function () {
	$(element).find('div.loanMeter').show();
	$(document).bind('focusin.loanMeter click.loanMeter', function (e) {
		if ($(e.target).closest('.loanMeter, #loanTerms').length) return;
		$(document).unbind('.loanMeter');
		$(element).find('div.loanMeter').hide();
	});
});
$(element).find('div.loanMeter').hide();

$(document).on('change', '#rateRangeMeter', function () {
	var jk = $(this).val();
	$(element).find('#loanRate').val(jk);
});

$(document).on('change', '#loanRangeMeter', function () {
	var tk = $(this).val();
	$(element).find('#loanTerms').val(tk);
});

$(element).find('.loanType').click(function () {
	$(element).find('.loanType').removeClass('activeOp');
	$(this).addClass('activeOp');
});

//CALCULATION
function calculatePandI() {
	var loanAmount = $(element).find('#loanAmount').val(); //LOAN AMOUNT
	var annualInt = $(element).find('#loanRate').val() <= 30 ? $('#loanRate').val() : 0; //ANNUAL INTEREST
	var loanTerms = $(element).find('#loanTerms').val() //YEARS OF PAYMENT
	var paymentFreq = $(element).find('option:selected', '#loanRepay').val(); //PAYMENT FREQUENCY

	var N = loanTerms * paymentFreq; //Number of Payments
	var I = (annualInt / 100) / paymentFreq; //Rate per Payments
	var v = Math.pow((1 + I), N);
	var t = (I * v) / (v - 1);

	var result = (loanAmount * t).toFixed(2); //Repayment Amount
	var totalRepay = (result * N).toFixed(2); //LOAN AMOUNT PLUS INTEREST
	var totalInter = (totalRepay - loanAmount).toFixed(2); //INTEREST ONLY

	if (isNaN(result)) {
		var result = 0;
	}
	if (isNaN(totalRepay)) {
		var totalRepay = 0;
	}
	if (isNaN(totalInter)) {
		var totalInter = 0;
	}

	$(element).find('.repaymentAmount').html(currency + ' ' + result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$(element).find('.totalRepayment').html(currency + ' ' + totalRepay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$(element).find('.totalInterest').html(currency + ' ' + totalInter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$(element).find('.rAmount').html(result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$(element).find('.rYears').html(loanTerms);
	$(element).find('.rRate').html(annualInt);

	if (paymentFreq == 12) {
		$(element).find('.rFreq').html('month');
	} else if (paymentFreq == 26) {
		$(element).find('.rFreq').html('two weeks');
	} else {
		$(element).find('.rFreq').html('week');
	}
} //end Calculate Principal And Interest

function calculateI() {
	var loanAmount = $(element).find('#loanAmount').val();
	var rate = $(element).find('#loanRate').val();
	var term = $(element).find('#loanTerms').val();
	var period = $(element).find('option:selected', '#loanRepay').val();

	var numPayment = (term * period); //NUMBER OF PAYMENTS
	var allRate = (rate / 100) * term; //TOTAL INTEREST
	var inter = loanAmount * allRate; //INTEREST ONLY
	var amountPay = Math.round(inter / numPayment); //AMOUNT PER PAYMENT
	var td = numPayment * amountPay; //ROUNDED OFF INTEREST ONLY

	if (isNaN(numPayment)) {
		var numPayment = 0;
	}
	if (isNaN(allRate)) {
		var allRate = 0;
	}
	if (isNaN(inter)) {
		var inter = 0;
	}
	if (isNaN(amountPay)) {
		var amountPay = 0;
	}
	if (isNaN(td)) {
		var td = 0;
	}

	$(element).find('.repaymentAmount').html(currency + ' ' + amountPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.00');
	$(element).find('.totalRepayment').html(currency + ' ' + td.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.00');
	$(element).find('.totalInterest').html(currency + ' ' + td.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.00');
	$(element).find('.rAmount').html(amountPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	$(element).find('.rYears').html(term);
	$(element).find('.rRate').html(rate);

	if (period == 12) {
		$(element).find('.rFreq').html('month');
	} else if (period == 26) {
		$(element).find('.rFreq').html('two weeks');
	} else {
		$(element).find('.rFreq').html('week');
	}
} //end Calculate Interest Only

$(function () {
	calculatePandI();

	var calculator = $(element).find('.calInputs');

	$(document).on('change', calculator, function () {
		if ($(element).find('.pAInterest').hasClass('activeOp')) {
			calculatePandI();
		} else {
			calculateI();
		}
	}); //ON CHANGE

	$(element).find('.pAInterest').click(function () {
		calculatePandI();
	});

	$(element).find('.intOnly').click(function () {
		calculateI();
	});

	$(element).find("#printBtn").unbind().click(function () {
		printDiv();
	});

	function printDiv() {
		var divToPrint = document.getElementById('printThis');
		var newWin = window.open('', 'Print-Window');
		newWin.document.open();
		newWin.document.write('<html><link rel="stylesheet" href="https://cdev.trilogycap.co/new-widget-workshop/mortgage-calculator-widget/calculator-style.css" type="text/css" /><link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet"><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
		newWin.document.close();
		setTimeout(function () {
			newWin.close();
		}, 500);
	}


}); //DOCUMENT READY

const cssId = 'fontAwesomeSource';
if (!document.getElementById(cssId)) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.id = 'fontAwesomeSource';
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://use.fontawesome.com/releases/v5.5.0/css/all.css';
	link.integrity = 'sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU';
	link.crossOrigin = 'anonymous';
	head.appendChild(link);
}