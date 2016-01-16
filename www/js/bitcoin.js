var appBitcoin = new Framework7({
	animateNavBackIcon: true, // *Removes* back icon animation
	precompileTemplates: true,
	template7Pages: true
});
var $$ = Dom7;
var mainView = appBitcoin.addView('.view-main', {
	domCache: true, // Enable inline pages
	dynamicNavbar: true
});

var frame, // Will be used to put contents of iframe in initsetup for other functions
    loopCaptchaChecked, // setInterval to check Captcha checkbox
    loopCaptchaChallenge; // setInterval to check Captcha challenge

var Bitcoin = {
	setup: {
		getFrame: function() {
			frame = $('iframe').contents();
			Bitcoin.frame = $(frame);
		},
		setFrame: function() {
			setLoadStatus('Connecting…');
			Bitcoin.setup.getFrame();
			setLoadStatus('Checking balance…');
			Bitcoin.info.balance();
			setLoadStatus('Consociating…');
			Bitcoin.setup.framed();
			Bitcoin.frame.find('#free_play_form_button').click(function(){
				setTimeout(function(){
					iAd.prepareInterstitial({
						autoShow: true
					})
				},4000)}
			);
		}
	},
	info: {
		balance: function() {
			$('#topbalance').text(Bitcoin.frame.find('#balance2').text().replace(' BTC',''));
			appBitcoin.sizeNavbars('.view-main');
		},
		payout: function() {
			return Bitcoin.frame.find('.payout_time_remaining').text().replace('Days',' days ').replace('Day',' day ').replace('Hours',' hours ').replace('Hour',' hour ').replace('Minutes',' minutes ').replace('Minute',' minute ').replace('Seconds',' seconds;').replace('Second',' second;').split(';')[0];
		},
		lotteryprize: function() {
			return Bitcoin.frame.find('.lottery_first_prize').text();
		},
		globalstats: function() {
			return [
				Bitcoin.frame.find('#total_signups_number').text(),
				Bitcoin.frame.find('#total_plays_number').text(),
				Bitcoin.frame.find('#total_btc_won_number_signup_page').text()
			]
		}
	}
};

function setLoadStatus (status) {
	$('#loginstatus').text(status);
}

// Go
$(document).ready(function() {

	// Done welcome?
	var bLaunched = localStorage.getItem('bLaunched');
	if (!bLaunched) {
		setTimeout(function() {
			appBitcoin.popup('.popupWelcome');
			initWelcome();
		}, 1500);
	}

	Bitcoin.setup.setFrame();

	// Stuff to run constantly
	window.setInterval(function() {
		Bitcoin.info.balance(); // keeps balance updated
		$('#payouttime').text(Bitcoin.info.payout());
		Bitcoin.frame.find('.cc_banner-wrapper').remove(); // removes cookies banner
		$('#lotteryfirstprize').text('1st place: ' + Bitcoin.info.lotteryprize() + ' BTC');
		Bitcoin.frame.find('iframe[title="recaptcha challenge"], iframe[title="recaptcha widget"]').contents().find('html').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
		Bitcoin.frame.find('iframe[title="recaptcha challenge"]').contents().find('.rc-report-problem-text, .audio-button-holder, .image-button-holder, .help-button-holder').css('visibility', 'hidden');
	}, 1000);

	// When iframe changes location, iframe init needs to take place again
	$('#mainiframe').load(function() { frameLoad() });

	function frameLoad() {
		Bitcoin.setup.setFrame();
		var ellogintabs = $('#logintabs');
		if (ellogintabs.is(':visible')) {
			ellogintabs.hide();
			appBitcoin.hidePreloader();
		}
		setLoadStatus('Almost there…');
		window.setTimeout(function () {

			setLoadStatus('');

			if (Bitcoin.frame.find('.free_play_claim_button').is(':visible')) {

				// Faucet not opened, iframe is only showing Open Faucet button right now
				$('#loading-block, #mainiframe, #openfaucet-preloader').hide();
				$('#openfaucet').show();

				// Open Faucet list item link
				$('#openfaucet-button').on('click', function() {
					$('#openfaucet-button').off('click'); // disables subsequent clicks
					$('#openfaucet-preloader').show(); // show preloader
					Bitcoin.frame.find('.free_play_claim_button')[0].click(); // click on the button in the iframe
				}).parent().parent().parent().show();

				$('#text-maxwinnings').text(Bitcoin.frame.find('#free_play_payout_table > table tbody tr:last td:last').text().replace(' BTC',''));

			} else if (Bitcoin.frame.find('#free_play_form_button').is(':visible')) {

				// Faucet opened
				$('#loading-block').hide();
				$('#openfaucet-preloader').hide();
				Bitcoin.frame.find('#free_play_form_button').hide();
				$('#mainiframe').css('height', '0').show().animate({height: '600px'},'slow');
				$('#openfaucet-button').parent().parent().parent().hide();

				// every .5 seconds, check if Captcha is checked
				loopCaptchaChecked = setInterval(function() {
					if (Bitcoin.frame.find('#free_play_captchas_recaptcha_v2 .g-recaptcha iframe').contents().find('.recaptcha-checkbox').attr('aria-checked') == "true") {
						clearInterval(loopCaptchaChecked);
						Bitcoin.frame.find('#free_play_form_button').click();
						$('#loading-block, #mainiframe, #openfaucet-preloader').hide();
						$('#rollingindicator').show();
						setTimeout(function() {
							mainView.router.load({
								url: 'roll.html',
								context: {
									number: Bitcoin.frame.find('#free_play_digits').text(),
									bitcoin: Bitcoin.frame.find('#winnings').text()
								}
							});
						}, 3000);
					}
				}, 500);

			} else if (Bitcoin.frame.find('h5').eq(0).is(':visible')) { // visible if not logged in

				$('#mainiframe').hide();
				$('#logintabs').show();
				var elLoginForm = Bitcoin.frame.find('fieldset').eq(1);
				var elSignupForm = Bitcoin.frame.find('fieldset').eq(0);

				// login tab
				$('#logintabsloginsubmit').on('click', function() {
					appBitcoin.showPreloader('Authenticating');
					// get form values
					var localEmail = $('input[name=loginemail]')[0].value;
					var localPass = $('input[name=loginpass]')[0].value;
					// set form values into iframe form
					elLoginForm.find('#login_form_btc_address')[0].value = localEmail;
					elLoginForm.find('#login_form_password')[0].value = localPass;
					elLoginForm.find('#login_button')[0].click(); // submit frame form
					setTimeout(function() {
						if (Bitcoin.frame.find('#login_error').css('display') === 'block') { // login error
							appBitcoin.hidePreloader();
							appBitcoin.alert(Bitcoin.frame.find('#login_error').text(), 'Login error');
							Bitcoin.frame.find('#login_error').text('').css('display', 'none');
						} else {
							// login success, the iframe is already loading the page in the background
							$('input[name=loginemail]')[0].value = '';
							$('input[name=loginpass]')[0].value = '';
						}
					}, 2500);
				});

				// signup tab
				$('#logintabssignupsubmit').on('click', function() {
					appBitcoin.showPreloader('Authenticating');
					// get form values
					var localEmail = $('input[name=signupemail]')[0].value;
					var localPass = $('input[name=signuppass]')[0].value;
					var localBitcoin = $('input[name=signupbitcoin]')[0].value;
					// set form values into iframe form
					elSignupForm.find('#signup_form_email')[0].value = localEmail;
					elSignupForm.find('#signup_form_password')[0].value = localPass;
					elSignupForm.find('#signup_form_btc_address')[0].value = localBitcoin;
					elSignupForm.find('#signup_button')[0].click(); // submit frame form
					setTimeout(function() {
						if (Bitcoin.frame.find('#signup_error').css('display') === 'block') { // signup error
							appBitcoin.hidePreloader();
							appBitcoin.alert(Bitcoin.frame.find('#signup_error').text(), 'Sign up error');
							Bitcoin.frame.find('#login_error').text('').css('display', 'none');
						} else {
							// sign up success, the iframe is already loading the page in the background
							$('input[name=signupemail]')[0].value = '';
							$('input[name=signuppass]')[0].value = '';
							$('input[name=signupbitcoin]')[0].value = '';
						}
					}, 2500);
				});

				$('#loading-block').hide();

			} else if (Bitcoin.frame.find('#time_remaining').is(':visible')) { // not open, wait

				mainView.router.load({
					url: 'roll.html'
				});

			} else {

				$('#loading-block').hide();
				$('#mainiframe').show();

			}

		}, 1000);
	}

	// Button in info page used to check auto withdraw
	$('#checkAutoWithdrawStatus').click(function(){
		if (Bitcoin.frame.find('span#edaw > span').is('.green')) {
			$('#outputAutoWithdrawStatus').removeAttr('style').text('Auto Withdraw is enabled. Your balance will be automatically reset to zero when this occurs.');
		} else {
			$('#outputAutoWithdrawStatus').removeAttr('style').text('Auto Withdraw is disabled. Tap below to enable Auto Withdraw:');
			$('#enableAutoWithdraw').on('click', function(){
				Bitcoin.frame.find('#auto_withdraw').click();
				$(this).off('click').hide();
				$('#outputAutoWithdrawStatus').text('Auto Withdraw is enabled. Your balance will be automatically reset to zero when this occurs.');
			}).show().parent().removeAttr('style');
		}
	});

});

var initWelcomeDone = false;
function initWelcome() {
	if (!initWelcomeDone) {
		appBitcoin.swiper('.popupWelcome .swiper-container', {
			pagination:'.swiper-pagination'
		});
		var elStatistics = $('.item-after', '.popupWelcome');
		setInterval(function() {
			for (var iGS = 0; iGS < 3; iGS++) {
				elStatistics.eq(iGS).text(Bitcoin.info.globalstats()[iGS]);
			}
		}, 1000);
		$('.popupWelcome').on('close', function() {
			localStorage.setItem('bLaunched', 1);
		});
		initWelcomeDone = true;
	}
}

var loopRollTimeRemaining;
function rollTimeRemaining() {
	$('#roll-info').text(Bitcoin.frame.find('#time_remaining').text().replace('Days',' days ').replace('Day',' day ').replace('Hours',' hours ').replace('Hour',' hour ').replace('Minutes',' minutes ').replace('Minute',' minute ').replace('Seconds',' seconds;').replace('Second',' second;').split(';')[0]);
}
appBitcoin.onPageBeforeInit('roll', function() {
	loopRollTimeRemaining = setInterval(function() { rollTimeRemaining() }, 1000);
});
appBitcoin.onPageBeforeAnimation('roll', function() {
	rollTimeRemaining();
});
appBitcoin.onPageAfterAnimation('roll', function() {
	$('#rollingindicator').hide();
});
appBitcoin.onPageAfterBack('roll', function() {
	$('#loading-block').show();
	$('#openfaucet, #rollingindicator, #mainiframe').hide();
	setLoadStatus('Reloading…');
	$('#mainiframe')[0].contentWindow.location.reload();
});
appBitcoin.onPageBeforeRemove('roll', function() {
	clearInterval(loopRollTimeRemaining);
});

document.addEventListener("deviceready", onDeviceReady, false);
// iAd setup
function onDeviceReady() {
	if (iAd) {
		iAd.createBanner({
			position: iAd.AD_POSITION.BOTTOM_CENTER,
			autoShow: true,
			overlap: false,
			offsetTopBar: true
		});
	}
}

Bitcoin.setup.framed = function() {
	// Formatting
	Bitcoin.frame.find('.adsbygoogle').attr("style", "display: none;");
	Bitcoin.frame.find('#free_play_tab > center, #free_play_tab > br, #wait > p, #switch_to_solvemedia, .large-9 > div[align=center] > center, a[href="javascript:Recaptcha.showhelp()"], .top-bar, div[style="margin-top:25px;text-align:center;margin-bottom:15px;"] > span, p[style="width:80%;"]').remove();
	Bitcoin.frame.find('#free_play_payout_table').hide();
	Bitcoin.frame.find('div[style="margin-top:25px;text-align:center;margin-bottom:15px;"]').contents().filter(function() {return this.nodeType == Node.TEXT_NODE;}).remove();
	Bitcoin.frame.find('#free_play_form').find('p:not(:has(select))').remove();
	Bitcoin.frame.find('.row-collapse').css({'margin': '0 auto', 'width': '100%;', 'top': '0'});
	Bitcoin.frame.find('body').css('background','none');
	Bitcoin.frame.find('div[align=center]').first().css({'margin-top': '10px', 'margin-left': '0'});
	Bitcoin.frame.find('.g-recaptcha > div > div').css('width', '290px');
	Bitcoin.frame.find('#free_play_captchas_recaptcha_v2').css({'display': 'block', 'margin-left': '-10px'});
	Bitcoin.frame.find('#free_play_captchas_recaptcha_v1, #free_play_captchas_solvemedia').css('display', 'none');
	Bitcoin.frame.find('#free_play_captcha_types').remove();
	Bitcoin.frame.find('body').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
	Bitcoin.frame.find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
	Bitcoin.frame.find('#free_play_tab').css({'margin': '0', 'padding': '0'});
	Bitcoin.frame.find('div.large-12.columns').css('padding', '0');
	Bitcoin.frame.find('#free_play_form_button, .login_menu_button, .signup_menu_button, #signup_button, #login_button, #free_play_claim_button button, a.button.medium.success').css({'background-color': 'white', 'border-style': 'none', 'color': '#222', 'box-shadow': 'none', 'width': '100vw', 'border-radius': '0', 'font-weight': 'inherit'});
	Bitcoin.frame.find('#signup_button, #login_button').css('width', '80vw');
	Bitcoin.frame.find('#contact_form_error, #create_wallet_error, #double_your_btc_error, #free_play_error, #login_error, #signup_error').css({'font-weight': 'inherit', 'color': 'inherit'});
	Bitcoin.frame.find('#free_play_digits').css({'margin': '50px auto', 'width': '100vw', 'font-weight': 'inherit', 'font-size': '50px'});
	Bitcoin.frame.find('#free_play_result, #free_play_result > div, #free_play_result > div > b, #free_play_result > div > b > span').css({'font-weight': 'inherit', 'background-color': 'lightcyan'});
	Bitcoin.frame.find('#free_play').css('margin-top', '10px');
	Bitcoin.frame.find('#wait').css({'margin-top': '50px', 'background-color': 'lightgoldenrodyellow', 'width': '100vw'});
	Bitcoin.frame.find('fieldset').css({'background': 'none', 'border': 'none', 'padding': '20px 0'});
	Bitcoin.frame.find('a[data-reveal-id="myModal"]').parent().remove();
	Bitcoin.frame.find('a[data-reveal-id=myModal3], a[data-reveal-id=myModal5], a[data-reveal-id=myModal6]').parent().parent().remove();
	Bitcoin.frame.find('input[name=referrer]').parent().parent().hide();
	Bitcoin.frame.find('.pricing-table, .pricing-table li, .pricing-table li span').css({'border': 'none', 'background': 'none', 'font-weight': 'inherit'}).find('li[class=title]').remove();
	Bitcoin.frame.find('p.free_play_claim').remove();
	Bitcoin.frame.find('a.button.medium.success').text('Open Faucet').parents().eq(1).find('p:first').remove();
	Bitcoin.frame.find('#free_play_result div.bold.center.green a').replaceWith($('<span>two lottery tickets</span>'));
	Bitcoin.frame.find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
	// New home
	Bitcoin.frame.find('#new_home').removeAttr('style');
	Bitcoin.frame.find('#new_home p.bold').remove();
	Bitcoin.frame.find('#signup_form_div fieldset, #login_form_div fieldset').css({'background':'none', 'box-shadow':'none', 'padding': '20px'});
	Bitcoin.frame.find('label').css('font-weight','initial');
	Bitcoin.frame.find('.fa-stack').remove();
	Bitcoin.frame.find('.fa-stack, #features, #home_bitcoin ~ div, #home_bitcoin, .cc_banner-wrapper').remove();
	Bitcoin.frame.find('.columns, .row').css({'padding': '0', 'margin': '0'});
	Bitcoin.frame.find('#free_play_form_button').parent().parent().css('margin-top','25px');
	Bitcoin.frame.find('.free_play_claim_button').parent().parent().css('margin-top','70px');
	Bitcoin.frame.find('button[data-reveal-id="myModal17"]').parent().hide();
	// iPad
	Bitcoin.frame.find('.show-for-medium-up').remove();
	Bitcoin.frame.find('.show-for-small').removeClass('show-for-small');
	Bitcoin.frame.find('#signup_form_div').parent().css('width', '100vw');
	Bitcoin.frame.find('#login_form_btc_address').attr('type', 'email');
	// reCAPTCHA
	Bitcoin.frame.find('iframe[title="recaptcha widget"]').contents().find('.rc-anchor-pt').css('visibility', 'hidden');
	Bitcoin.frame.find('iframe[title="recaptcha challenge"], iframe[title="recaptcha widget"]').contents().find('html').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
	Bitcoin.frame.find('iframe[title="recaptcha challenge"]').contents().find('.rc-report-problem-text, .audio-button-holder, .image-button-holder, .help-button-holder').css('visibility', 'hidden');
};