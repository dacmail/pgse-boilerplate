"use strict";
function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0)
    return 10;

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./))
    return 11;

  else if (sAgent.indexOf("Edge") > -1)
    return 'edge';

  else
    return false; //It is not IE
}

(function($) {
  const Util = {
    writeIECss: function (version) {
      const stylesheet = $('body').data('ie' + version);
      if (stylesheet && stylesheet !== 'undefined') {
        $("head").append(`<link rel="stylesheet" type="text/css" href="${stylesheet}">`);
      }
    },

    innerLinks: function(){
      $('.js-inner-link').click(function(e){
        let item = $($.attr(this, 'href'));

        if (item.length > 0) {
          e.preventDefault();
          $('html, body').animate({
              scrollTop: item.offset().top - 150
          }, 500);
        }
      })
    },

  };

  $(document).ready(function () {
    const isIE = GetIEVersion();
    if (isIE) {
      Util.writeIECss(isIE);
    }

    Util.innerLinks();
  });
})(jQuery);
