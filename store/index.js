export const state = () => ({
    carts: []
})

export const getters = {
    carts: state => state.carts
}

export const mutations = {
    ADD_TO_CART: (state, product) => {
        state.carts.push(product);
    }
}

export const actions = {
    addToCart({ commit }, product) {
        console.log('add to cart');
        commit('ADD_TO_CART', product);
    }
}