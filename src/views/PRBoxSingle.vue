<template>

    <v-container>
        <v-row>
            <v-col>
                <span class="text-h5 font-weight-bold">PR Box: <span v-if="book.name">{{ book.name }}</span></span>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="8">
                <v-sheet
                    variant="outlined"
                    class="mx-auto"
                    border
                    rounded
                >
                    <v-row>
                        <v-col cols="12">
                            <v-card-title class="text-overline">
                                Name
                                <div class="text-h3">
                                    {{ book.name }}
                                </div>
                            </v-card-title>
                        </v-col>
                        <v-col cols="6">
                            <v-card-title class="text-overline">
                                Created At
                                <div class="text-h4">
                                    {{ $formatDate(book.createdAt) }}
                                </div>
                            </v-card-title>
                        </v-col>
                        <v-col cols="6">
                            <v-card-title class="text-overline">
                                Updated At
                                <div class="text-h4">
                                    {{ $formatDate(book.updatedAt) }}
                                </div>
                            </v-card-title>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>
            <v-col cols="4">
                <v-sheet
                    variant="outlined"
                    class="mx-auto"
                    border
                    rounded
                >
                    <v-img src="http://localhost:3000/img/package-1.png"></v-img>
                </v-sheet>
            </v-col>



        </v-row>
    </v-container>

</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BookUpdateForm from './../components/BookUpdateForm.vue';
import BookDeleteConfirmation from './../components/BookDeleteConfirmation.vue';

const api = inject('api');
const route = useRoute();
const bookID = route.params.bookID;

const book = ref({});
const isLoading = ref(true);
const editDialoge = ref(false);

onMounted(async () => {
    await getData();
    isLoading.value = false;
});

const getData = async () => {
    const { data } = await api.books.get(bookID);
    book.value = data;
};

const onClose = () => {
    editDialoge.value = false;
    getData();
};  
</script>