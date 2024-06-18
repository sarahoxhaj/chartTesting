<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top"
            style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
            <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
                <h5 class="text-center text-md-left">Test</h5>
            </div>
            <button @click="changeViewMatrix" type="button" class="btn btn-outline-success btn-sm d-none d-md-inline"
                style="margin-top:-0.5rem; margin-right:1rem;">Back</button>
        </nav>

        <div class="container-fluid d-flex justify-content-center align-items-center" style="height: 100vh;">
            <div class="card border" style="border: 1px solid #DDD; width: 47rem; height: 30rem; margin-top:-5rem;">
                <img :src="require(`@/assets/${getImageFileName()}`)" alt="My Image"
                    style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDisplay",
    data() {
        return {
            number: null
        };
    },
    created() {
        this.number = this.$route.query.number;
    },
    methods: {
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        getImageFileName() {
            let formattedNumber = String(this.number);
            if (formattedNumber.length === 1) {
                formattedNumber = '0' + formattedNumber;
            }
            return `${formattedNumber}vis.png`;
        }
    },
};
</script>
