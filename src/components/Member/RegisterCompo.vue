<template>
  <div class="register-form">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">Username:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div>
        <label for="phonenumber">Phone Number:</label>
        <input v-model="phonenumber" type="text" id="phonenumber" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <label for="role">Role:</label>
        <input v-model="role" type="text" id="role" />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const email = ref('');
const phonenumber = ref('');
const password = ref('');
const role = ref('');
const message = ref('');
const isSuccess = ref(false);

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/member/register', {
      username: username.value,
      email: email.value,
      phonenumber: phonenumber.value,
      password: password.value,
      role: role.value
    });
    message.value = response.data;
    isSuccess.value = true;
  } catch (error) {
    message.value = 'Registration failed: ' + (error.response?.data || error.message);
    isSuccess.value = false;
  }
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.register-form div {
  margin-bottom: 1em;
}

.register-form label {
  margin-bottom: .5em;
  color: #333;
  display: block;
}

.register-form input {
  border: 1px solid #ccc;
  padding: .5em;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

.register-form button {
  padding: .7em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  width: 100%;
  cursor: pointer;
}

.register-form button:hover {
  background-color: #0056b3;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
