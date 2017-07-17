
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function menu_module(menu_item, toggle_class, category_container) {

    // constructor base
    this.stringConstructor = "test".constructor;
    this.arrayConstructor = [].constructor;
    this.objectConstructor = {}.constructor;

    // plugin wariables
    this.catContainer = category_container;
    this.storage = localStorage.menu_items;
    this.menu_item = menu_item;
    this.toggle_class = toggle_class;




    this.init = function () {

        if (localStorage.menu_items == "undefined" || localStorage.menu_items == null || localStorage.menu_items == "" || localStorage.menu_items == 'empty') {

            localStorage.setItem('menu_items', "{}");
            
            this.storage = localStorage.menu_items;

        }

        this.buildSelectedCategory(JSON.parse(this.storage));
        
        this.bindClicks();
        
        this.categoryClick();
        
    };

    this.findInJsonArray = function (jsonArray, parameters) {
        
        var newJsonArray = {};
        
        if (parameters.constructor === this.objectConstructor) {
            
            var parametersKeys = Object.keys(parameters);
            
        } else {
            
            return false;
            
        }

        var keys = Object.keys(jsonArray);

        for (var i = 0; i < keys.length; i++) {
            
            var accepteble = false;

            for (var ij = 0; ij < parametersKeys.length; ij++) {

                if (parameters[parametersKeys[ij]] == jsonArray[keys[i]][parametersKeys[ij]]) {
                    
                    accepteble = true;
                    
                } else {
                    
                    accepteble = false;
                    
                }
            }
            if (accepteble) {

                newJsonArray[Object.keys(newJsonArray).length] = (jsonArray[keys[i]]);
            }
        }
        
        return newJsonArray;

    }

    this.jsonFind = function (jsonSearch, jsonFind) {

        var jsonKey = [];

        console.log(jsonSearch);
        console.log(jsonFind);
        for (var ij = 0; ij < Object.keys(jsonSearch).length; ij++) {
            
            var newObj = jsonSearch[Object.keys(jsonSearch)[ij]];
           
            var returnValue = false;
            
       


                if (newObj.id === "undefined" || newObj.id === null || newObj.id === "" || newObj.category === "undefined" || newObj.category === null || newObj.category === "" ) {

                    returnValue = false;

                } else {
                     

                    if (newObj.id === jsonFind.id && newObj.category === jsonFind.category) {
                        
                        returnValue = true;
                        
                    } else {
                        
                        returnValue = false;
                        
                    }

                

                

            }
            
            if (returnValue === true) {
                
                    jsonKey.push(Object.keys(jsonSearch)[ij]);
                
            }

        }
        console.log(jsonKey);
        return jsonKey;
    }


    this.bindClicks = function () {
        
        var $that = this;
        
        var toggle_class = this.toggle_class;
        
        var storage = JSON.parse(this.storage);
        
        var stingConstructor = this.stringConstructor;
        
        if (storage.slected_items != [] && storage.slected_items != "undefined" && storage.slected_items != "" && storage.slected_items != null) {
            
            $(this.menu_item).each(function () {

                var this_menuCategory = $(this).data("menu-category");
                
                var this_menuId = $(this).data("menu-dishid");
                
                var find = $that.findInJsonArray(storage.slected_items, {category: this_menuCategory, id: this_menuId});
                
                if (!$.isEmptyObject(find) && find.constructor == $that.objectConstructor) {
                    
                    $(this).addClass("active");
                    
                }
                
            });
            
        }

        $(this.menu_item).click(function (e) {

            $(this).toggleClass(toggle_class);
            
            var category = $(this).data("menu-category");
            
            var id = $(this).data("menu-dishid");
            
            var heading = $(this).find(".dish_heading").text();
            
            var price = $(this).find(".price").text();
            
            var description = $(this).find(".description").html();
            
            


            var selectObject = {category: category, id: id, heading: heading, price: price, description: description }; 
            
            if (storage.constructor === stingConstructor) {
                
                var storage_answer = JSON.parse(storage);
                
            } else {
                var storage_answer = storage;
            }
            if ($(this).hasClass(toggle_class)) {


                if (typeof storage_answer.slected_items == "undefined" || storage_answer.slected_items == null || storage_answer.slected_items == "" || storage_answer.slected_items == "empty") {

                    storage_answer.slected_items = [];
                    
                    storage_answer.slected_items.push(selectObject);
                    
                } else {

                    storage_answer.slected_items.push(selectObject);

                }

            } else {

                if (typeof storage_answer.slected_items == "undefined" || storage_answer.slected_items == null || storage_answer.slected_items == "" || storage_answer.slected_items == "empty") {
                    
                    storage_answer.slected_items = [];
                    
                } else {

                    var findedObjects = $that.jsonFind(storage_answer.slected_items, selectObject);

                    for (var i = 0; i < findedObjects.length; i++) {

                        storage_answer.slected_items.splice([findedObjects[i]], 1);

                    }

                }

            }

            storage = storage_answer;

            localStorage.setItem('menu_items', JSON.stringify(storage));
            
            $that.buildSelectedCategory(storage);

        });
    };

    this.buildSelectedCategory = function (selectedMenu) {
        
        // check if empty !!!
        if ($.isEmptyObject(selectedMenu) || selectedMenu.slected_items.length == 0) {

            if ($(this.catContainer).children(":contains('Wybrane')").length > 0) {
                
                var cloned = $(this.catContainer).children(":contains('Wybrane')").remove();

            }

        } else {
            if ($(this.catContainer).children(":contains('Wybrane')").length == 0) {
                
                var cloned = $(this.catContainer).children(":first-child").clone();
                
                cloned.text("Wybrane");
                
                cloned.removeClass("active");
                
                cloned.addClass("current_dishes");
                
                $(this.catContainer).append(cloned);
                
            }
//           console.log($(this.catContainer).children(":first-child")); 
        }
    };

    this.findUniqInJSON = function (jsonObj, parameter) {

        var keys = Object.keys(jsonObj);
        
        var newObject = {};
        
        for (var i = 0; i < keys.length; i++) {
            var param = newObject[jsonObj[keys[i]][parameter]];
            if (param == "undefined" || param == null || param == "" || param.constructor != this.objectConstructor) {
                
                newObject[jsonObj[keys[i]][parameter]] = {};
                
            }
        }



    };

    this.categoryClick = function () {
        
        var $that = this;
        
        $(this.catContainer).children().click(function (event) {
            
            $($that.catContainer).children().removeClass("active");
            
            $(this).addClass("active");

            if ($(this).hasClass("current_dishes")) {
                var parent_container = $($that.menu_item).parent();
                parent_container.empty();
                var jsonObj = $that.findUniqInJSON(JSON.parse(localStorage.menu_items), "category");
                console.log(jsonObj);
                var items = (JSON.parse(localStorage.menu_items).slected_items);

                 var itemsHtml = "";
                 for(var i = 0; i < Object.keys(items).length; i++){

                     itemsHtml += '<li class="dish active" data-menu-category="'+items[Object.keys(items)[i]].category+'" data-menu-dishid="'+items[Object.keys(items)[i]].id+'">\
                                       <div class="main_desc">\
                                        <p class="dish_name"><span class="dish_index">'+items[Object.keys(items)[i]].id+'</span><span class="dish_heading">'+items[Object.keys(items)[i]].heading+'</span></p> \
                                         <div class="price"> \
                                           '+items[Object.keys(items)[i]].price+'\
                                            </div> \
                                           </div> \
                                         <div class="description"> \
                                            <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p> \
                                        </div> \
                                    </li>';
                     
                 }
                 parent_container.append(itemsHtml);
                 
            } else {
                
                // make ajax call  
                $($that.menu_item).parent().empty();
                
            }

           $that.bindClicks();

        });
         
//        this.bindClicks();
    };

    return this.init();
}




























$(document).ready(function () {



    var menumodule = new menu_module(".dish", "active", ".catitems");
    function init_table_chousing() {

        $(".gallery_slider .slider_container").slick({
            slidesToShow: 3,
            centerMode: true,
            centerPadding: '0',
            arrows: true,
            prevArrow: "<div class='small_slider_naw top'><div></div></div>",
            nextArrow: "<div class='small_slider_naw bottom'><div></div></div>"
        });
        var $history;
        $(".gallery_slider .slider_container .slider_item").fancybox({
            speed: 600,
            beforeLoad: function () {
                $history = window.history.length; // catch current history
            },
            afterClose: function () {
                if (navigator.userAgent.match(/(Chrome|Opera|Safari)/gi)) {
                    var goTo = window.history.length - $history;
                    window.history.go(-goTo) // restore initial history
                }
            }
        });
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
        $(".restaurant_tables").mouseout(function (event) {


            var e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) {
                return;
            }
            if ($(this)[0].hasAttribute("data-selected")) {
                var selected_index = $(this).attr("data-selected");
                all_tabels_places.each(function () {

                    if ($(this).index() > selected_index) {

                        $(this).removeClass("active");
                    } else {
                        $(this).addClass("active");
                    }
                });
            } else {
                all_tabels_places.removeClass("active");
            }
        });
    }

    init_table_chousing();
    $(".menu_section .right_side").mCustomScrollbar();
});
