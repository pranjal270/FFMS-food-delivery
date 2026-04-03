import basket_icon from './basket_icon.png'
import logo from './logo.png'
import header_img from './header_img.png'
import search_icon from './search_icon.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'

import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: menu_1
    },
    {
        menu_name: "Rolls",
        menu_image: menu_2
    },
    {
        menu_name: "Deserts",
        menu_image: menu_3
    },
    {
        menu_name: "Sandwich",
        menu_image: menu_4
    },
    {
        menu_name: "Cake",
        menu_image: menu_5
    },
    {
        menu_name: "Pure Veg",
        menu_image: menu_6
    },
    {
        menu_name: "Pasta",
        menu_image: menu_7
    },
    {
        menu_name: "Noodles",
        menu_image: menu_8
    }]

export const food_list = [
    {
        _id: "1",
        name: "Greek salad",
        image: food_1,
        price: 189,
        description: "Fresh lettuce, olives, cherry tomatoes and feta with our house dressing.",
        category: "Salad",
        type: "veg"
    },
    {
        _id: "2",
        name: "Veg salad",
        image: food_2,
        price: 169,
        description: "Crisp seasonal veggies tossed with herbs for a light and wholesome bite.",
        category: "Salad",
        type: "veg"
    }, {
        _id: "3",
        name: "Clover Salad",
        image: food_3,
        price: 199,
        description: "Crunchy greens with roasted seeds and a tangy citrus finish.",
        category: "Salad",
        type: "veg"
    }, {
        _id: "4",
        name: "Chicken Salad",
        image: food_4,
        price: 249,
        description: "Smoked chicken, lettuce and creamy pepper dressing in every forkful.",
        category: "Salad",
        type: "non-veg"
    }, {
        _id: "5",
        name: "Lasagna Rolls",
        image: food_5,
        price: 219,
        description: "Cheesy baked rolls packed with rich tomato sauce and herbs.",
        category: "Rolls",
        type: "veg"
    }, {
        _id: "6",
        name: "Peri Peri Rolls",
        image: food_6,
        price: 229,
        description: "Spicy peri peri filling wrapped in a soft roll with mayo drizzle.",
        category: "Rolls",
        type: "veg"
    }, {
        _id: "7",
        name: "Chicken Rolls",
        image: food_7,
        price: 259,
        description: "Juicy chicken roll with onions, mint chutney and street-style masala.",
        category: "Rolls",
        type: "non-veg"
    }, {
        _id: "8",
        name: "Veg Rolls",
        image: food_8,
        price: 189,
        description: "Loaded veggie roll with crunchy fillings and house-made sauces.",
        category: "Rolls",
        type: "veg"
    }, {
        _id: "9",
        name: "Ripple Ice Cream",
        image: food_9,
        price: 149,
        description: "Creamy ripple ice cream with smooth swirls and a chilled finish.",
        category: "Deserts",
        type: "veg"
    }, {
        _id: "10",
        name: "Fruit Ice Cream",
        image: food_10,
        price: 159,
        description: "Real fruit notes blended into rich ice cream for a refreshing dessert.",
        category: "Deserts",
        type: "veg"
    }, {
        _id: "11",
        name: "Jar Ice Cream",
        image: food_11,
        price: 179,
        description: "A generous dessert jar layered with ice cream and sweet toppings.",
        category: "Deserts",
        type: "veg"
    }, {
        _id: "12",
        name: "Vanilla Ice Cream",
        image: food_12,
        price: 129,
        description: "Classic vanilla scoop that pairs perfectly with every meal.",
        category: "Deserts",
        type: "veg"
    },
    {
        _id: "13",
        name: "Chicken Sandwich",
        image: food_13,
        price: 239,
        description: "Grilled chicken sandwich with crisp veggies and spicy mayo.",
        category: "Sandwich",
        type: "non-veg"
    },
    {
        _id: "14",
        name: "Vegan Sandwich",
        image: food_14,
        price: 199,
        description: "Plant-powered sandwich with hummus, fresh greens and crunchy veggies.",
        category: "Sandwich",
        type: "veg"
    }, {
        _id: "15",
        name: "Grilled Sandwich",
        image: food_15,
        price: 209,
        description: "Golden grilled sandwich with melty cheese and masala filling.",
        category: "Sandwich",
        type: "veg"
    }, {
        _id: "16",
        name: "Bread Sandwich",
        image: food_16,
        price: 179,
        description: "Simple comfort sandwich with creamy spread and crunchy vegetables.",
        category: "Sandwich",
        type: "veg"
    }, {
        _id: "17",
        name: "Cup Cake",
        image: food_17,
        price: 119,
        description: "Soft cupcake topped with silky frosting for a quick sweet fix.",
        category: "Cake",
        type: "veg"
    }, {
        _id: "18",
        name: "Vegan Cake",
        image: food_18,
        price: 189,
        description: "Moist vegan cake with deep cocoa notes and smooth texture.",
        category: "Cake",
        type: "veg"
    }, {
        _id: "19",
        name: "Butterscotch Cake",
        image: food_19,
        price: 229,
        description: "Butterscotch sponge layered with cream and caramel crunch.",
        category: "Cake",
        type: "veg"
    }, {
        _id: "20",
        name: "Sliced Cake",
        image: food_20,
        price: 139,
        description: "Single-serve cake slice for when you want dessert without sharing.",
        category: "Cake",
        type: "veg"
    }, {
        _id: "21",
        name: "Garlic Mushroom ",
        image: food_21,
        price: 219,
        description: "Sauteed mushrooms in garlic butter with bold flavor and aroma.",
        category: "Pure Veg",
        type: "veg"
    }, {
        _id: "22",
        name: "Fried Cauliflower",
        image: food_22,
        price: 209,
        description: "Crispy cauliflower bites tossed in spices and served hot.",
        category: "Pure Veg",
        type: "veg"
    }, {
        _id: "23",
        name: "Mix Veg Pulao",
        image: food_23,
        price: 199,
        description: "Fragrant pulao with colorful veggies and balanced spices.",
        category: "Pure Veg",
        type: "veg"
    }, {
        _id: "24",
        name: "Rice Zucchini",
        image: food_24,
        price: 189,
        description: "Light zucchini rice bowl with herbs and a clean, savory finish.",
        category: "Pure Veg",
        type: "veg"
    },
    {
        _id: "25",
        name: "Cheese Pasta",
        image: food_25,
        price: 229,
        description: "Creamy cheese pasta that feels indulgent in every bite.",
        category: "Pasta",
        type: "veg"
    },
    {
        _id: "26",
        name: "Tomato Pasta",
        image: food_26,
        price: 219,
        description: "Classic tomato pasta with basil and a rich Italian-style sauce.",
        category: "Pasta",
        type: "veg"
    }, {
        _id: "27",
        name: "Creamy Pasta",
        image: food_27,
        price: 239,
        description: "Rich white sauce pasta finished with herbs and cracked pepper.",
        category: "Pasta",
        type: "veg"
    }, {
        _id: "28",
        name: "Chicken Pasta",
        image: food_28,
        price: 279,
        description: "Tender chicken pasta in a creamy sauce with extra protein.",
        category: "Pasta",
        type: "non-veg"
    }, {
        _id: "29",
        name: "Buttter Noodles",
        image: food_29,
        price: 199,
        description: "Buttery noodles tossed in sauces for a warm comfort meal.",
        category: "Noodles",
        type: "veg"
    }, {
        _id: "30",
        name: "Veg Noodles",
        image: food_30,
        price: 189,
        description: "Wok-tossed noodles with crunchy vegetables and Indo-Chinese flavor.",
        category: "Noodles",
        type: "veg"
    }, {
        _id: "31",
        name: "Somen Noodles",
        image: food_31,
        price: 229,
        description: "Light somen noodles with a savory sauce and balanced seasoning.",
        category: "Noodles",
        type: "veg"
    }, {
        _id: "32",
        name: "Cooked Noodles",
        image: food_32,
        price: 249,
        description: "Street-style noodles loaded with sauces and satisfying texture.",
        category: "Noodles",
        type: "non-veg"
    }
]
