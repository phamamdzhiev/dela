import { createStore } from "vuex";

export const store = createStore({
    state() {
        return {
            data: [
                {
                    id: 1,
                    dessert: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6,
                    carbs: 24,
                    protein: 4,
                },
                {
                    id: 2,
                    dessert: 'Ice Cream sandwich',
                    calories: 237,
                    fat: 9,
                    carbs: 37,
                    protein: 4.3,
                },
            ]
        }
    },
    mutations: {
        ADD_ITEM(state, item) {
            state.data.push(item);
        },
        EDIT_ITEM(state, { id, updatedItem }) {
            const index = state.data.findIndex((item) => item.id === id);

            if (index > -1) {
                state.data[index] = updatedItem;
            }
        },
        DELETE_ITEM(state, { id }) {
            state.data = state.data.filter((item) => item.id !== id);
        }
    },
    actions: {
        deleteItem({ commit }, { id }) {
            commit('DELETE_ITEM', { id });
        },
        editItem({ commit }, { id, updatedItem }) {
            commit('EDIT_ITEM', { id, updatedItem });
        },
        async createItem({ commit }, payload) {
            const newItem = { ...payload, id: Date.now() };
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
            commit('ADD_ITEM', newItem);
        },
    },
});