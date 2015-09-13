// Initialize your app
var myApp = new Framework7({
	animateNavBackIcon: true // *Removes* back icon animation
});

// Export selectors engine for Framework7
var $$ = Dom7;

// App init
var mainView = myApp.addView('.view-main', {
	domCache: true, // Enable inline pages
	dynamicNavbar: true
});

// onDeviceReady, for iAd setup
document.addEventListener("deviceready", onDeviceReady, false);

var myFrame; // Will be used to put contents of iframe in initsetup for other functions

// First setup, run when document is ready
function initsetup() {
	// Get contents of iframe to be used in iframe init
	myFrame = $('iframe').contents();
	iframeinit();
	window.setInterval(function() {
		getBalance();
		$(myFrame).find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
		$(myFrame).find('iframe[title="recaptcha challenge"], iframe[title="recaptcha widget"]').contents().find('html').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
		$(myFrame).find('iframe[title="recaptcha challenge"]').contents().find('.rc-report-problem-text, .audio-button-holder, .image-button-holder, .help-button-holder').css('visibility', 'hidden');
		$(myFrame).find('.cc_banner-wrapper').remove();
	}, 1000);
}

// Put current balance in toolbar
function getBalance() {
	var balance = $(myFrame).find('#balance2').text();
	$('#topbalance').text(balance);
}

// Gets iframe ready to be shown
function iframeinit() {
	// Do this again, it gets overwritten when location changes
	myFrame = $('iframe').contents();
	getBalance();
	// Remove unnecessary content
	$(myFrame).find('.adsbygoogle').attr("style", "display: none;");
	$(myFrame).find('#free_play_tab > center, #free_play_tab > br, #wait > p, #switch_to_solvemedia, .large-9 > div[align=center] > center, a[href="javascript:Recaptcha.showhelp()"], .top-bar, div[style="margin-top:25px;text-align:center;margin-bottom:15px;"] > span, p[style="width:80%;"]').remove();
	$(myFrame).find('#free_play_payout_table').hide();
	$(myFrame).find('div[style="margin-top:25px;text-align:center;margin-bottom:15px;"]').contents().filter(function() {return this.nodeType == Node.TEXT_NODE;}).remove();
	$(myFrame).find('.bold.red').parent().remove();
	$(myFrame).find('#free_play_form').find('p:not(:has(select))').remove();
	$(myFrame).find('.row-collapse').css({'margin': '0 auto', 'width': '100%;', 'top': '0'});
	$(myFrame).find('body').css('background','none');
	$(myFrame).find('div[align=center]').first().css({'margin-top': '10px', 'margin-left': '0'});
	$(myFrame).find('.g-recaptcha > div > div').css('width', '290px');
	$(myFrame).find('#free_play_captchas_recaptcha_v2').css({'display': 'block', 'margin-left': '-10px'});
	$(myFrame).find('#free_play_captchas_recaptcha_v1, #free_play_captchas_solvemedia').css('display', 'none');
	$(myFrame).find('#free_play_captcha_types').remove();
	$(myFrame).find('body').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
	$(myFrame).find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
	$(myFrame).find('#free_play_tab').css({'margin': '0', 'padding': '0'});
	$(myFrame).find('div.large-12.columns').css('padding', '0');
	$(myFrame).find('#free_play_form_button, .login_menu_button, .signup_menu_button, #signup_button, #login_button, #free_play_claim_button button, a.button.medium.success').css({'background-color': 'white', 'border-style': 'none', 'color': '#222', 'box-shadow': 'none', 'width': '100vw', 'border-radius': '0', 'font-weight': 'inherit'});
	$(myFrame).find('#signup_button, #login_button').css('width', '80vw');
	$(myFrame).find('#contact_form_error, #create_wallet_error, #double_your_btc_error, #free_play_error, #login_error, #signup_error').css({'font-weight': 'inherit', 'color': 'inherit'});
	$(myFrame).find('#free_play_digits').css({'margin': '50px auto', 'width': '100vw', 'font-weight': 'inherit', 'font-size': '50px'});
	$(myFrame).find('#free_play_result, #free_play_result > div, #free_play_result > div > b, #free_play_result > div > b > span').css({'font-weight': 'inherit', 'background-color': 'lightcyan'});
	$(myFrame).find('#free_play').css('margin-top', '10px');
	$(myFrame).find('#wait').css({'margin-top': '50px', 'background-color': 'lightgoldenrodyellow', 'width': '100vw'});
	$(myFrame).find('fieldset').css({'background': 'none', 'border': 'none', 'padding': '20px 0'});
	$(myFrame).find('a[data-reveal-id="myModal"]').parent().remove();
	$(myFrame).find('a[data-reveal-id=myModal3], a[data-reveal-id=myModal5], a[data-reveal-id=myModal6]').parent().parent().remove();
	$(myFrame).find('input[name=referrer]').parent().parent().hide();
	$(myFrame).find('.pricing-table, .pricing-table li, .pricing-table li span').css({'border': 'none', 'background': 'none', 'font-weight': 'inherit'}).find('li[class=title]').remove();
	$(myFrame).find('p.free_play_claim').remove();
	$(myFrame).find('a.button.medium.success').text('Open Faucet').parents().eq(1).find('p:first').remove();
	$(myFrame).find('#free_play_result div.bold.center.green a').replaceWith($('<span>two lottery tickets</span>'));
	// New home
	$(myFrame).find('#new_home').removeAttr('style');
	$(myFrame).find('#new_home p.bold').remove();
	$(myFrame).find('#signup_form_div fieldset, #login_form_div fieldset').css({'background':'none', 'box-shadow':'none', 'padding': '20px'});
	$(myFrame).find('label').css('font-weight','initial');
	$(myFrame).find('.fa-stack').remove();
	$(myFrame).find('.fa-stack, #features, #home_bitcoin ~ div, #home_bitcoin, .cc_banner-wrapper').remove();
	$(myFrame).find('.columns, .row').css({'padding': '0', 'margin': '0'});
	$(myFrame).find('#free_play_form_button').parent().parent().css('margin-top','25px');
	$(myFrame).find('.free_play_claim_button').parent().parent().css('margin-top','70px');
	$(myFrame).find('button[data-reveal-id="myModal17"]').parent().hide();
	// iPad
	$(myFrame).find('.show-for-medium-up').remove();
	$(myFrame).find('.show-for-small').removeClass('show-for-small');
	$(myFrame).find('#signup_form_div').parent().css('width', '100vw');
	$(myFrame).find('#login_form_btc_address').attr('type', 'email');
	// reCAPTCHA
	$(myFrame).find('iframe[title="recaptcha widget"]').contents().find('.rc-anchor-pt').css('visibility', 'hidden');
	$(myFrame).find('#free_play_form_button').click(function(){
		setTimeout(function(){
			iAd.prepareInterstitial({
				autoShow: true
			})
		},1500)}
	);
	$(myFrame).find('p#free_play_claim_button button, a.button.medium.success').click(function(){
		$('#mainiframe').css('opacity', '0');
		$('#loading-block, .myloginprompt').show();
	});
}

// Run all aforementioned functions when necessary
$(document).ready(function() {
	initsetup();
	new FastClick(document.body);
	// When iframe changes location, iframe init needs to take place again
	$('#mainiframe').load(function() {
		iframeinit();
		window.setTimeout(function () {
			// Remove loading div from splash page and show iframe
			$('#loading-block, .myloginprompt').hide();
			$('#mainiframe').removeAttr('style');
		}, 3000);
	});
	// Button in info page used to check auto withdraw
	$('#checkAutoWithdrawStatus').click(function(){
		$('#checkAutoWithdrawStatus').html('<sub><span class="preloader preloader-white" style="height: 15px; width: 15px;"></span></sub>');
		window.setTimeout(function() {
			if ($(myFrame).find('span#edaw > span').is('.green')) {
				$('#checkAutoWithdrawStatus')
					.prop('class','button button-fill color-green')
					.text('Enabled');
				$('#outputAutoWithdrawStatus')
					.removeAttr('style')
					.text('Auto Withdraw is enabled. You should receive payment at around midday on Sunday (UTC). Your balance will be automatically reset to zero when this occurs.');
			} else {
				$('#checkAutoWithdrawStatus')
					.prop('class','button button-fill color-red')
					.text('Disabled');
				$('#outputAutoWithdrawStatus')
					.removeAttr('style')
					.text('Auto Withdraw is disabled. You will need to log in to freebitco.in on your computer to withdraw your funds manually.');
			}
		}, 1000);
	});
});

// iAd setup
function onDeviceReady() {
	if (iAd) {
		iAd.createBanner({
			position: iAd.AD_POSITION.BOTTOM_CENTER,
			autoShow: true,
			overlap: false,
			offsetTopBar: true
		});
	} else {
		console.log('iAd plugin not available/ready');
	}
}
