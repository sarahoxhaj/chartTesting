<template>
  <div class="hello d-flex justify-content-center" style="margin-top: 150px;">
    <div class="card bg-success bg-opacity-25" style="max-width: 33rem; height: 18rem;">
      <div class="card-body">
        <h4 class="card-text mt-3">This is going to be a short graph feature recognition quiz.<br>Please enter your
          email so we can save the result. </h4>
      </div>
      <div class="card-footer mb-2 d-flex justify-content-center" style="height: 6rem;">
        <div data-mdb-input-init class="form-outline me-3">
          <input type="email" class="form-control mt-4" v-model="email" id="exampleInputEmail1" placeholder="Enter email"
            style="width: 300px;">
        </div>
        <button type="button" class="btn btn-outline-secondary mt-4" style="height: 38px;"
          @click="saveEmail">Continue</button>
      </div>
    </div>
  </div>

  <div class="mt-2 d-flex justify-content-center">
    <div v-if="showAlert" class="alert alert-warning" style="max-width: 33rem; height: 3.5rem;">
      Please enter an email address.
      <a href="#" class="close" @click="dismissAlert" aria-label="Close" style="padding: 5px 10px; text-decoration:none;">
        <span aria-hidden="true" style="color: #545353;">&times;</span>
      </a>
    </div>
  </div>
</template>
<script>

export default {
  name: 'FirstView',
  data() {
    return {
      email: '',
      showAlert: false
    };
  },
  methods: {
    saveEmail() {
      if (this.email.trim() !== '') {
        sessionStorage.setItem('email', this.email);
        this.$router.push('/mainView');
      } else {
        this.showAlert = true;
      }
    },
    dismissAlert() {
      this.showAlert = false;
    }
  }
}
</script>
