<template>
    <div hidden>
        <p>Name: {{ userName }}</p>
        <div v-for="(data, key) in testData" :key="key" style="text-align: left;">
            <p>{{ key }}</p>
            <div v-if="data.selectedCheckboxes && data.selectedCheckboxes.length > 0">
                <ul>
                    <li v-for="checkbox in data.selectedCheckboxes" :key="checkbox">{{ checkbox }}</li>
                </ul>
            </div>
            <div v-if="data.comment">
                <p>Comment: {{ data.comment }}</p>
            </div>
            <div v-if="data.complexity !== undefined">
                <p>Complexity: {{ data.complexity }}</p>
            </div>
            <div v-if="data.commentComplexity">
                <p>Comment on complexity: {{ data.commentComplexity }}</p>
            </div>
        </div>
    </div>
    <div class="hello d-flex justify-content-center" style="margin-top: 180px;">
        <div class="card bg-success bg-opacity-25" style="width: 25rem; height: 6rem;">
            <div class="card-body">
                <h4 class="card-text mt-3">Thank you for participating!</h4>
            </div>
        </div>
    </div>
</template>

<script>
import { firebaseApp } from "@/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default {
    name: "TestResult",
    data() {
        return {
            testData: {},
            userName: ''
        };
    },
    created() {
        const storedCheckboxes = JSON.parse(sessionStorage.getItem('selectedCheckboxes')) || {};
        const storedComments = JSON.parse(sessionStorage.getItem('imageComments')) || {};
        const storedComplexities = JSON.parse(sessionStorage.getItem('imageComplexities')) || {};
        const storedCommentComplexities = JSON.parse(sessionStorage.getItem('imageCommentComplexities')) || {};

        const name = sessionStorage.getItem('name');
        if (name) {
            this.userName = name; // Set userName data property
        }

        for (const key in storedCheckboxes) {
            this.testData[key] = { // Directly assign properties
                selectedCheckboxes: storedCheckboxes[key],
                comment: storedComments[key],
                complexity: storedComplexities[key],
                commentComplexity: storedCommentComplexities[key]
            };
        }
        this.saveDataToFirebase();

        sessionStorage.removeItem('selectedCheckboxes');
        sessionStorage.removeItem('imageComments');
        sessionStorage.removeItem('imageComplexities');
        sessionStorage.removeItem('imageCommentComplexities');
    },
    methods: {
        async saveDataToFirebase() {
            try {
                const db = getFirestore(firebaseApp);
                const testDataCollection = collection(db, "testData");

                for (const key in this.testData) {
                    await addDoc(testDataCollection, {
                        userName: this.userName,
                        selectedCheckboxes: this.testData[key].selectedCheckboxes,
                        comment: this.testData[key].comment,
                        complexity: this.testData[key].complexity,
                        commentComplexity: this.testData[key].commentComplexity,
                        key: key
                    });
                }
                console.log("Data saved to Firebase successfully!");
            } catch (error) {
                console.error("Error saving data to Firebase: ", error);
            }
        }
    },
};
</script>
