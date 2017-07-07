
$(document).ready(function () {


    function init_table_chousing() {



        var all_tabels_places = $(".restaurant_tables .table");
        $(".restaurant_tables").mousemove(function (e) {
           
            if ($(e.target).hasClass("table")) {

                var index = $(e.target).index();
                all_tabels_places.removeClass("active");
                for (var i = 0; i <= index; i++) {
                    all_tabels_places[i].classList.add("active");
                }
                ;

            }
        });
        $(".restaurant_tables .table").click(function () {
            var parent = $(this).parents(".restaurant_tables");
            var all_childs = parent.find(".table");
            all_childs.removeClass("active");

            for (var ik = 0; ik <= $(this).index(); ik++) {
                all_childs[ik].classList.add("active");
            }
            parent.attr("data-selected", $(this).index());
        });

        $(".restaurant_tables").mouseout(function (e) {


            var e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) {
                return;
            }
            if ($(this)[0].hasAttribute("data-selected")) {
                var selected_index = $(this).attr("data-selected");

                all_tabels_places.each(function () {
 
                    if ($(this).index() > selected_index) {

                        $(this).removeClass("active");
                    }else{
                        $(this).addClass("active");
                    }
                });
            } else {
                all_tabels_places.removeClass("active");
            }
        });



    }

    init_table_chousing();


});
