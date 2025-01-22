<template>
    <Teleport to="body">
        <div @click.self="cancel" class="z-[5000] fixed inset-0 bg-black/60 w-full h-full">
            <div
                class="top-1/2 left-1/2 z-[5001] absolute bg-white shadow-md m-4 mx-auto p-4 rounded-md w-full max-w-xl h-auto -translate-x-1/2 -translate-y-1/2 overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg capitalize">Confirmation modal</h2>
                    <button class="text-red-500 hover:text-red-700" @click="cancel">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <slot></slot>
                <div class="flex justify-between items-center mt-6">
                    <button type="button" class="btn-success" @click="confirm">Yes</button>
                    <button type="button" class="btn-danger" @click="cancel">No</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
export default {
    emits: ['confirm', 'cancel'],
    methods: {
        confirm() {
            this.$emit('confirm');
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>