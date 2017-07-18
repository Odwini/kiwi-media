
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


function menu_module(menu_item, toggle_class, category_container, items_container) {

    // constructor base
    this.stringConstructor = "test".constructor;
    this.arrayConstructor = [].constructor;
    this.objectConstructor = {}.constructor;

    // plugin wariables
    this.catContainer = category_container;
    this.storage = localStorage.menu_items;
    this.menu_item = menu_item;
    this.toggle_class = toggle_class;
    this.menu_container = $(items_container);



    this.init = function () {

        if (localStorage.menu_items == "undefined" || localStorage.menu_items == null || localStorage.menu_items == "" || localStorage.menu_items == 'empty') {

            localStorage.setItem('menu_items', "{}");

            this.storage = localStorage.menu_items;

        }

        this.buildSelectedCategory(JSON.parse(this.storage));

        this.bindClicks();

        this.categoryClick();

        this.initActiveCategory();
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

                    break;
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

        for (var ij = 0; ij < Object.keys(jsonSearch).length; ij++) {

            var newObj = jsonSearch[Object.keys(jsonSearch)[ij]];

            var returnValue = false;

            if (newObj.id === "undefined" || newObj.id === null || newObj.id === "" || newObj.category === "undefined" || newObj.category === null || newObj.category === "") {

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
        return jsonKey;
    }





    this.bindClicks = function () {

        var $that = this;

        var toggle_class = this.toggle_class;

        var storage = JSON.parse(localStorage.menu_items);

        var stingConstructor = this.stringConstructor;

        if (storage.slected_items != [] && storage.slected_items != "undefined" && storage.slected_items != "" && storage.slected_items != null) {

            $(this.menu_item).each(function () {

                var this_menuCategory = $(this).data("menu-category");

                var this_menuId = $(this).data("menu-dishid");

                var find = $that.findInJsonArray(storage.slected_items, {category: this_menuCategory, id: this_menuId});


                if (!$.isEmptyObject(find) && find.constructor == $that.objectConstructor) {

                    $(this).addClass("active");

                } else {
                    $(this).removeClass("active");
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

            var selectObject = {category: category, id: id, heading: heading, price: price, description: description};

            if (storage.constructor === stingConstructor) {

                var storage_answer = JSON.parse(localStorage.menu_items);

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





    this.sortByKey = function (field, reverse, primer) {

        var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {

            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));

        }

    }






    this.buildSelectedCategory = function (selectedMenu) {
        // check if empty !!!
        if ($.isEmptyObject(selectedMenu) || selectedMenu.slected_items.length == 0) {

            if ($(this.catContainer).children(":contains('Wybrane')").length > 0) {

                var cloned = $(this.catContainer).children(":contains('Wybrane')").remove();

                $(".calculate_and_deliver").slideUp();
            }

        } else {

            if ($(this.catContainer).children(":contains('Wybrane')").length == 0) {

                var cloned = $(this.catContainer).children(":first-child").clone();

                cloned.text("Wybrane");

                cloned.attr("data-menu-category", 'wybrane');

                cloned.removeClass("active");

                cloned.addClass("current_dishes");

                $(this.catContainer).append(cloned);

            }

            var items = JSON.parse(localStorage.menu_items).slected_items;

            var itemsCount = 0;

            var price = 0;

            for (var iP = 0; iP < Object.keys(items).length; iP++) {

                itemsCount++;

                var primary_key = Object.keys(items)[iP];

                var element = items[primary_key];

                price += parseFloat(items[iP].price.trim().replace(",", "."));

            }
            ;

            $(".calculate_and_deliver").find(".ammount_of_dishes .value").text(itemsCount);

            price = String(price.toFixed(2)).replace(".", ",");

            $(".calculate_and_deliver").find(".price_of_dishes .value").text(price);

            $(".calculate_and_deliver").slideDown();
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

                newObject[jsonObj[keys[i]][parameter]][i] = jsonObj[keys[i]];

            } else {

                newObject[jsonObj[keys[i]][parameter]][i] = jsonObj[keys[i]];

            }

        }

        return newObject;

    };






    this.initActiveCategory = function () {

        var $that = this;

        var activeCat = $($that.catContainer).find(".active");

        if (activeCat.attr("data-menu-category") == "wybrane") {

            var parent_container = $that.menu_container;

            parent_container.empty();

            var jsonObj = $that.findUniqInJSON(JSON.parse(localStorage.menu_items).slected_items, "category");

            var items = (JSON.parse(localStorage.menu_items).slected_items);

            var itemsHtml = "";

            for (var i = 0; i < Object.keys(jsonObj).length; i++) {

                var tmpObj = jsonObj[Object.keys(jsonObj)[i]];

                itemsHtml += "<h2 class='cat_heading'>" + $($that.catContainer).find(".catitem[data-menu-category='" + Object.keys(jsonObj)[i] + "']").text() + "</h2>";

                var array = [];

                for (var a in tmpObj) {

                    array.push(tmpObj[a]);

                }

                array = array.sort($that.sortByKey('id', false, parseInt));
//                       array.reverse();
                tmpObj = array;

                for (var ij = 0; ij < tmpObj.length; ij++) {

                    itemsHtml += '<li class="dish active" data-menu-category="' + tmpObj[ij].category + '" data-menu-dishid="' + tmpObj[ij].id + '">\
                                       <div class="main_desc">\
                                        <p class="dish_name"><span class="dish_index">' + tmpObj[ij].id + '</span><span class="dish_heading">' + tmpObj[ij].heading + '</span></p> \
                                         <div class="price"> \
                                           ' + tmpObj[ij].price + '\
                                            </div> \
                                           </div> \
                                         <div class="description"> \
                                            <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p> \
                                        </div> \
                                    </li>';
                }

            }

            parent_container.append(itemsHtml);

        } else {

            var dania_glowne = {"slected_items":
                        [
                            {
                                "category": "zestawy obiadowe",
                                "id": 1,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n      24,99\n   ",
                                "description": "\n       <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 2,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 3,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n      24,99  \n",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 16,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n                                            24,99\n                                        ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n"},
                            {"category": "zestawy obiadowe",
                                "id": 5,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n 24,99\n ",
                                "description": "\n    <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 4,
                                "heading": ". Penne z polędwicą wieprzową i kurkami", "price": "\n 24,99\n  ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                            {"category": "zestawy obiadowe",
                                "id": 11,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zestawy obiadowe",
                                "id": 12,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n  ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 13,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n  ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zestawy obiadowe",
                                "id": 10,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n     "},
                            {"category": "zestawy obiadowe",
                                "id": 7,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n    24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zestawy obiadowe",
                                "id": 6,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                            {"category": "zestawy obiadowe",
                                "id": 8,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n  ",
                                "description": "\n <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zestawy obiadowe",
                                "id": 9,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n   ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zestawy obiadowe",
                                "id": 15,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n ",
                                "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "},
                            {"category": "zestawy obiadowe",
                                "id": 14,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n    24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "}
                        ]
            };

            var zupy = {"slected_items":
                        [
                            {
                                "category": "zupy",
                                "id": 1,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n      24,99\n   ",
                                "description": "\n       <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 2,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 3,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n      24,99  \n",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 16,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n                                            24,99\n                                        ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n"},
                            {"category": "zupy",
                                "id": 5,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n 24,99\n ",
                                "description": "\n    <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 4,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n 24,99\n  ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                            {"category": "zupy",
                                "id": 11,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zupy",
                                "id": 12,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n  ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 13,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n  ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zupy",
                                "id": 10,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n    ",
                                "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n     "},
                            {"category": "zupy",
                                "id": 7,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n    24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                            {"category": "zupy",
                                "id": 6,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                            {"category": "zupy",
                                "id": 8,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n  ",
                                "description": "\n <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zupy",
                                "id": 9,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n   24,99\n   ",
                                "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                            {"category": "zupy",
                                "id": 15,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n  24,99\n ",
                                "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "},
                            {"category": "zupy",
                                "id": 14,
                                "heading": ". Penne z polędwicą wieprzową i kurkami",
                                "price": "\n    24,99\n   ",
                                "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "}
                        ]
            };
            // make ajax call  
            $($that.menu_container).empty();

            var json_Object = $($that.catContainer).find(".catitem.active").attr("data-menu-category");

            var jsonObj = {};

            if (json_Object == "zestawy obiadowe") {

                jsonObj = dania_glowne.slected_items;

            } else if (json_Object == "zupy") {

                jsonObj = zupy.slected_items;

            }

            var itemsHtml = "";

            var array = [];

            for (var a = 0; a < Object.keys(jsonObj).length; a++) {

                jsonObj[Object.keys(jsonObj)[a]].productKey = a + 1;

                array.push(jsonObj[Object.keys(jsonObj)[a]]);
            }

            array = array.sort($that.sortByKey('productKey', false, parseInt));
//                       array.reverse();
            jsonObj = array;

            for (var ij = 0; ij < jsonObj.length; ij++) {

                itemsHtml += '<li class="dish" data-menu-category="' + jsonObj[ij].category + '" data-menu-dishid="' + jsonObj[ij].id + '">\
                                       <div class="main_desc">\
                                        <p class="dish_name"><span class="dish_index">' + jsonObj[ij].productKey + '</span><span class="dish_heading">' + jsonObj[ij].heading + '</span></p> \
                                         <div class="price"> \
                                           ' + jsonObj[ij].price + '\
                                            </div> \
                                           </div> \
                                         <div class="description"> \
                                            <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p> \
                                        </div> \
                                    </li>';
            }

            $($that.menu_container).append(itemsHtml);

        }

        $that.bindClicks();

    }









    this.categoryClick = function () {

        var $that = this;

        $(this.catContainer).children().click(function (event) {

            $($that.catContainer).children().removeClass("active");

            $(this).addClass("active");

            if ($(this).hasClass("current_dishes")) {

                var parent_container = $that.menu_container;

                parent_container.empty();

                var jsonObj = $that.findUniqInJSON(JSON.parse(localStorage.menu_items).slected_items, "category");

                var items = (JSON.parse(localStorage.menu_items).slected_items);

                var itemsHtml = "";


                for (var i = 0; i < Object.keys(jsonObj).length; i++) {

                    var tmpObj = jsonObj[Object.keys(jsonObj)[i]];

                    itemsHtml += "<h2 class='cat_heading'>" + $($that.catContainer).find(".catitem[data-menu-category='" + Object.keys(jsonObj)[i] + "']").text() + "</h2>";

                    var array = [];

                    for (var a in tmpObj) {

                        array.push(tmpObj[a]);

                    }
                    array = array.sort($that.sortByKey('id', false, parseInt));

//                       array.reverse();
                    tmpObj = array;

                    for (var ij = 0; ij < tmpObj.length; ij++) {

                        itemsHtml += '<li class="dish active" data-menu-category="' + tmpObj[ij].category + '" data-menu-dishid="' + tmpObj[ij].id + '">\
                                       <div class="main_desc">\
                                        <p class="dish_name"><span class="dish_index">' + tmpObj[ij].id + '</span><span class="dish_heading">' + tmpObj[ij].heading + '</span></p> \
                                         <div class="price"> \
                                           ' + tmpObj[ij].price + '\
                                            </div> \
                                           </div> \
                                         <div class="description"> \
                                            <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p> \
                                        </div> \
                                    </li>';
                    }

                }

                parent_container.append(itemsHtml);

            } else {

                var dania_glowne = {"slected_items":
                            [
                                {
                                    "category": "zestawy obiadowe",
                                    "id": 1,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n      24,99\n   ",
                                    "description": "\n       <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 2,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 3,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n      24,99  \n",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 16,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n                                            24,99\n                                        ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n"},
                                {"category": "zestawy obiadowe",
                                    "id": 5,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n 24,99\n ",
                                    "description": "\n    <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 4,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami", "price": "\n 24,99\n  ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                                {"category": "zestawy obiadowe",
                                    "id": 11,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zestawy obiadowe",
                                    "id": 12,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n  ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 13,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n  ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zestawy obiadowe",
                                    "id": 10,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n     "},
                                {"category": "zestawy obiadowe",
                                    "id": 7,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n    24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zestawy obiadowe",
                                    "id": 6,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                                {"category": "zestawy obiadowe",
                                    "id": 8,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n  ",
                                    "description": "\n <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zestawy obiadowe",
                                    "id": 9,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n   ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zestawy obiadowe",
                                    "id": 15,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n ",
                                    "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "},
                                {"category": "zestawy obiadowe",
                                    "id": 14,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n    24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "}
                            ]
                };

                var zupy = {"slected_items":
                            [
                                {
                                    "category": "zupy",
                                    "id": 1,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n      24,99\n   ",
                                    "description": "\n       <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 2,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 3,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n      24,99  \n",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 16,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n                                            24,99\n                                        ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n"},
                                {"category": "zupy",
                                    "id": 5,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n 24,99\n ",
                                    "description": "\n    <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 4,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n 24,99\n  ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                                {"category": "zupy",
                                    "id": 11,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zupy",
                                    "id": 12,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n  ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 13,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n  ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zupy",
                                    "id": 10,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n    ",
                                    "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n     "},
                                {"category": "zupy",
                                    "id": 7,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n    24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n   "},
                                {"category": "zupy",
                                    "id": 6,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n    "},
                                {"category": "zupy",
                                    "id": 8,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n  ",
                                    "description": "\n <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zupy",
                                    "id": 9,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n   24,99\n   ",
                                    "description": "\n   <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n  "},
                                {"category": "zupy",
                                    "id": 15,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n  24,99\n ",
                                    "description": "\n     <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "},
                                {"category": "zupy",
                                    "id": 14,
                                    "heading": ". Penne z polędwicą wieprzową i kurkami",
                                    "price": "\n    24,99\n   ",
                                    "description": "\n  <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p>\n "}
                            ]
                };

                // make ajax call  
                $($that.menu_container).empty();

                var json_Object = $($that.catContainer).find(".catitem.active").attr("data-menu-category");

                var jsonObj = {};

                if (json_Object == "zestawy obiadowe") {

                    jsonObj = dania_glowne.slected_items;

                } else if (json_Object == "zupy") {

                    jsonObj = zupy.slected_items;

                }

                var itemsHtml = "";

                var array = [];

                for (var a = 0; a < Object.keys(jsonObj).length; a++) {

                    jsonObj[Object.keys(jsonObj)[a]].productKey = a + 1;

                    array.push(jsonObj[Object.keys(jsonObj)[a]]);

                }

                array = array.sort($that.sortByKey('productKey', false, parseInt));
//                       array.reverse();
                jsonObj = array;

                for (var ij = 0; ij < jsonObj.length; ij++) {

                    itemsHtml += '<li class="dish" data-menu-category="' + jsonObj[ij].category + '" data-menu-dishid="' + jsonObj[ij].id + '">\
                                       <div class="main_desc">\
                                        <p class="dish_name"><span class="dish_index">' + jsonObj[ij].productKey + '</span><span class="dish_heading">' + jsonObj[ij].heading + '</span></p> \
                                         <div class="price"> \
                                           ' + jsonObj[ij].price + '\
                                            </div> \
                                           </div> \
                                         <div class="description"> \
                                            <p>koperek, koperek, jeszcze raz koperek, trzeba więcej koperku, no i sól</p> \
                                        </div> \
                                    </li>';
                }

                $($that.menu_container).append(itemsHtml);

            }

            $that.bindClicks();

        });
//        this.bindClicks();
    };

    return this.init();
}




























$(document).ready(function () {



    var menumodule = new menu_module(".dish", "active", ".catitems", ".dishes");
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
