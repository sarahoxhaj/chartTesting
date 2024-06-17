<template>
  <div class="hello d-flex justify-content-center" style="margin-top: 150px;">
    <div class="card bg-success bg-opacity-25" style="max-width: 33rem; height: 18rem;">
      <div class="card-body">
        <h4 class="card-text mt-3" style="line-height: 1.4;">This is going to be a short quiz about complexity and graph
          feature recognition.<br>Please enter your
          full name so we can save the result. </h4>
      </div>
      <div class="card-footer mb-2 d-flex justify-content-center" style="height: 6rem;">
        <div data-mdb-input-init class="form-outline me-3">
          <input type="text" class="form-control mt-4" v-model="name" placeholder="Enter name" style="width: 300px;">
        </div>
        <button type="button" class="btn btn-outline-secondary mt-4" style="height: 38px;"
          @click="saveData">Continue</button>
      </div>
    </div>
  </div>
  <div class="card" style="max-width: 33rem; margin: 20px auto; background-color: #e4e4e4;">
    <div style="display: flex; flex-wrap: wrap; align-items: center;">
      <p class="mt-3" style="flex: 1 1 100%; text-align: center; margin-left:-10rem;">Not a participant?</p>
      <div class="form-outline flex-grow-1" style="flex: 1 1 200px; max-width: 120px; margin-left:-10rem;">
        <input type="password" class="form-control" v-model="code" placeholder="Enter code">
      </div>
      <button type="button" class="btn btn-outline-secondary btn-sm"
        style="flex: 0 0 auto; margin-right:4.5rem; margin-left:1rem; " @click="checkResult">Continue</button>
    </div>
  </div>



  <div class="mt-2 d-flex justify-content-center">
    <div v-if="showAlert" class="alert alert-warning" style="max-width: 33rem; height: 3.5rem;">
      Please enter your name.
      <a href="#" class="close" @click="dismissAlert" aria-label="Close" style="padding: 5px 10px; text-decoration:none;">
        <span aria-hidden="true" style="color: #545353;">&times;</span>
      </a>
    </div>
  </div>
  <div class="mt-2 d-flex justify-content-center">
    <div v-if="showAlertCode" class="alert alert-warning" style="max-width: 33rem; height: 3.5rem;">
      Please enter your code.
      <a href="#" class="close" @click="dismissAlertCode" aria-label="Close"
        style="padding: 5px 10px; text-decoration:none;">
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
      name: '',
      showAlert: false,
      showAlertCode: false,
      validCodes: ['sara', 'Sara', 'laura', 'Laura', 'torsten', 'Torsten']
    };
  },
  methods: {
    saveData() {
      if (this.name.trim() !== '') {
        sessionStorage.setItem('name', this.name);
        this.$router.push('/mainView');
      } else {
        this.showAlert = true;
      }
    },
    dismissAlert() {
      this.showAlert = false;
    },
    dismissAlertCode() {
      this.showAlertCode = false;
    },
    checkResult() {
      if (this.validCodes.includes(this.code.toLowerCase())) {
        this.$router.push('/resultView');
      } else {
        this.showAlertCode = true; 
      }
    },
  }
}
</script>
