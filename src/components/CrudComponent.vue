<template>
    <div class="my-12">
        <div class="space-x-2 mb-4">
            <input type="text" v-model="searchQuery" placeholder="Search..." aria-label="Search items"
                class="border-gray-300 px-3 py-2 border rounded-md" />
            <button @click="resetFilters" class="btn-danger" aria-label="Reset filters">
                Reset
            </button>
        </div>
        <button @click="openModal('create')" class="btn-primary" aria-label="Create new item">Create</button>
        <div class="relative shadow-md rounded-md overflow-x-auto">
            <table class="w-full text-gray-700 text-left text-sm">
                <thead class="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                        <th scope="col" class="px-6 py-3">Dessert (100g serving)</th>
                        <th scope="col" class="px-6 py-3">Calories</th>
                        <th scope="col" class="px-6 py-3">Fat (g)</th>
                        <th scope="col" class="px-6 py-3">Carbs (g)</th>
                        <th scope="col" class="px-6 py-3">Protein (g)</th>
                        <th scope="col" class="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredData" :key="item.id" class="bg-white hover:bg-gray-50 border-b">
                        <th class="px-6 py-4 font-normal text-gray-500">
                            {{ item.dessert }}
                        </th>
                        <th class="px-6 py-4 font-normal text-gray-500">
                            {{ item.calories }}
                        </th>
                        <th class="px-6 py-4 font-normal text-gray-500">
                            {{ item.fat }}
                        </th>
                        <th class="px-6 py-4 font-normal text-gray-500">
                            {{ item.carbs }}
                        </th>
                        <th class="px-6 py-4 font-normal text-gray-500">
                            {{ item.protein }}
                        </th>
                        <td class="px-6 py-4">
                            <button @click="openModal('view', item.id)" :aria-label="`View details of ${item.dessert}`"
                                class="ml-2 text-green-600 hover:text-green-900">View</button>
                            <button @click="openModal('edit', item.id)"
                                class="ml-2 text-indigo-600 hover:text-indigo-900"
                                :aria-label="`Edit details of ${item.dessert}`">Edit</button>
                            <button @click="openModal('delete', item.id)" class="ml-2 text-red-600 hover:text-red-900"
                                :aria-label="`Delete ${item.dessert}`">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="filteredData.length === 0" class="bg-white py-4 text-center text-gray-500">
                No results found.
            </div>
        </div>
        <Modal v-if="showModal" @close="closeModal">
            <template #header>
                <h2 class="font-bold text-lg capitalize">{{ modalType }}</h2>
            </template>
            <form class="space-y-3" @submit.prevent="createItem">
                <div v-for="(field, index) in fields" :key="index">
                    <label class="font-semibold text-gray-800 text-sm capitalize" :aria-label="`Enter ${field}`"
                        :for="field">{{
                            field }}</label>
                    <input type="text" v-model.lazy="formData[field]" :id="field" :disabled="modalType === 'view'"
                        :aria-label="`Enter ${field} value`"
                        class="block border-gray-300 shadow-sm mt-0.5 p-1.5 border rounded-md w-full text-sm"
                        required />
                </div>
                <button v-if="modalType === 'create'" type="submit"
                    class="bg-blue-500 hover:bg-blue-700 mt-4 px-4 py-2 rounded font-bold text-white">
                    Save
                </button>
                <button v-if="modalType === 'edit'" type="button" @click="editItem"
                    class="bg-blue-500 hover:bg-blue-700 mt-4 px-4 py-2 rounded font-bold text-white">
                    Edit
                </button>
            </form>
        </Modal>
        <ConfirmationModal v-if="showConfirmationModal" @confirm="deleteItem" @cancel="closeModal">
            <p class="text-lg">Are you sure you want to delete this item?</p>
        </ConfirmationModal>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Modal from './Modal.vue';
import ConfirmationModal from './ConfirmationModal.vue';

export default {
    components: {
        Modal,
        ConfirmationModal
    },
    data() {
        return {
            fields: ['dessert', 'calories', 'fat', 'carbs', 'protein'],
            showModal: false,
            showConfirmationModal: false,
            modalType: '',
            searchQuery: '',
            formData: {},
        }
    },
    computed: {
        ...mapState(['data']),
        filteredData() {
            if (!this.searchQuery) return this.data;

            let filtered = this.data;

            filtered = filtered.filter((item) => {
                // Exclude the 'id' key from the values used in the search
                const filteredValues = Object.keys(item)
                    .filter(key => key !== 'id')
                    .map(key => item[key]);

                return filteredValues
                    .join(' ')
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
            });

            return filtered;
        }
    },
    methods: {
        resetFilters() {
            this.searchQuery = '';
        },
        createItem() {
            this.$store.dispatch('createItem', this.formData);
            this.closeModal();
        },
        editItem() {
            this.$store.dispatch('editItem', { id: this.formData.id, updatedItem: this.formData });
            this.closeModal();
        },
        deleteItem() {
            this.$store.dispatch('deleteItem', { id: this.formData.id });
            this.closeModal();
        },
        closeModal() {
            this.showModal = false;
            this.showConfirmationModal = false;
            this.formData = {};
        },
        openModal(type, itemId = null) {
            this.formData = itemId
                ? { ...this.data.find(item => item.id === itemId) }
                : {};

            this.modalType = type;
            this.showModal = this.showConfirmationModal = (type === 'delete');
            this.showModal = (type !== 'delete');
        }
    }
}
</script>