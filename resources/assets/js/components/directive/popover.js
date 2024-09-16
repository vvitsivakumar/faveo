export const Popover={

bind(el) {
    setTimeout(function(){
        $(el).find(".pop").popover({ trigger: "manual" , html: true, animation:false})
            .on("mouseenter", function () {
                var _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                  if (!$(".popover:hover").length) {
                    $(_this).popover("hide");
                  }
                }, 300);
            });
           },1000); 
        }
 }
 app.directive('bs-popover', Popover);