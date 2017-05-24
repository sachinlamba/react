var Constants = require('../Constants/Constants');
import { browserHistory } from 'react-router';

/*
 products: [{
        _id: '',
        name: "",
        description: "",
        category: "",
        price:0,
        image_url: "",
        avg_rating: 0,
        feedback: [
            {
                comment: "",
                rating: "",
                username: "",
                date: "",
            }
        ],
        deals: [
            {
                date: "",
                name: "",
                discount: 0
            }
        ]
    }]
    
*/
const ProductReducer = (state = {

    products: []
}
    , action) => {
    console.log('in Product reducer');
    switch (action.type) {

        case Constants.GET_INITIAL_PRODUCTS:
            console.log('setting products and categories');
            let categories = [];
            categories = action.data.map(product => product.category)
                .filter((value, index, self) => self.indexOf(value) === index);


            return Object.assign({}, state, { products: action.data, categories: categories });

        case Constants.SEARCH_PRODUCTS:

            console.log('setting products after searching');
            console.log(action.data);


            return Object.assign({}, state, { products: action.data });

        case Constants.PRODUCT_CATEGORY:
            console.log("showing by category");
            console.log(action.data);
            return Object.assign({}, state, { products: action.data });

        case Constants.SUBMIT_FEEDBACK:
            console.log('submitting feedback', action);
            console.log(state);
            for (let i = 0; i < state.products.length; i++) {
                console.log(state.products[i]);
                console.log(state.products[i]._id);
                if (state.products[i]._id == action.data.pdtId) {
                    console.log(state.products[i].feedback);
                    let feedback = state.products[i].feedback;
                    feedback.push(
                        {
                            rating: action.data.rating,
                            comment: action.data.comment,
                            user_name: action.data.user_name,
                            added_date: Date.now().toString().substr(0, 10)
                        }

                    )
                    console.log(feedback);
                    break;
                }
            }
            return Object.assign({}, state, {});

        case Constants.GET_DAILY_DEAL:
            console.log("setting daily deal prodcuts");
            console.log(action.data);
            return Object.assign({}, state, { products: action.data });

        default:
            return state;
    }
}

export default ProductReducer;
