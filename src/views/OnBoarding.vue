<template>
    <v-card
        rounded="0"
        theme="dark"
        class="fill-height"
        flat
    >
        <v-window v-model="onboarding">
            <v-window-item
                v-for="n in length"
                :key="`card-${n}`"
                class="fill-height"
                :value="n"
            >
                <v-card
                    class="d-flex justify-center align-center"
                    height="300"
                >
                    <span class="text-h2">
                        Card {{ n }}
                        {{ user.id }}
                    </span>
                </v-card>
            </v-window-item>
        </v-window>

        <v-spacer></v-spacer>

        <v-card-actions class="justify-space-between">
            <v-btn
                icon="mdi-chevron-left"
                variant="plain"
                @click="prev"
            ></v-btn>
            <v-item-group
                v-model="onboarding"
                class="text-center"
                mandatory
            >
                <v-item
                    v-for="n in length"
                    :key="`btn-${n}`"
                    v-slot="{ isSelected, toggle }"
                    :value="n"
                >
                    <v-btn
                        :variant="isSelected ? 'outlined' : 'text'"
                        icon="mdi-record"
                        @click="toggle"
                    ></v-btn>
                </v-item>
            </v-item-group>
            <v-btn
                icon="mdi-chevron-right"
                variant="plain"
                @click="next"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const api = inject('api');
const route = useRoute();
const store = useStore();

const isLoading = ref(false);
const length = ref(3);
const onboarding = ref(1);

const user = computed(() => store.state.user);

onMounted(async () => {
    // await getData();
});

const next = () => {
    onboarding = onboarding + 1 > length
        ? 1
        : onboarding + 1;
};

const prev = () => {
    onboarding = onboarding - 1 <= 0
        ? length
        : onboarding - 1;
};
</script>