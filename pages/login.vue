<script lang="ts" setup>
const loading = ref(false);
const errorMsg = ref("");
const router = useRouter();

const formIn = reactive({
  email: "",
  password: "",
});

async function signIn(e: Event) {
  e.preventDefault();
  try {
    loading.value = true;
    errorMsg.value = "";

    const data = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: formIn.email,
        password: formIn.password,
      },
    });

    if (data) {
      try {
        await router.push("/account");
      } catch (routerError) {
        window.location.href = "/account";
      }
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}
const logUser = () => {
  const user = useSupabaseUser();
};

const form = reactive({
  email: "",
  password: "",
  userData: {
    firstName: "",
    name: "",
    username: "",
    description: "",
    profilePicture: null as File | null,
  },
});

async function signUp() {
  try {
    loading.value = true;
    errorMsg.value = "";

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("firstName", form.userData.firstName);
    formData.append("name", form.userData.name);
    formData.append("username", form.userData.username);
    formData.append("description", form.userData.description);

    if (form.userData.profilePicture) {
      formData.append("profilePicture", form.userData.profilePicture);
    }

    const { data } = useFetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    if (data.value) {
      form.email = "";
      form.password = "";
      form.userData.firstName = "";
      form.userData.name = "";
      form.userData.username = "";
      form.userData.description = "";
      form.userData.profilePicture = null;

      wantRegister.value = false;
    }
  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

const wantRegister = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.userData.profilePicture = target.files[0];
  }
};

const handleSwitchChange = (side: "left" | "right") => {
  wantRegister.value = side === "right";
};
</script>

<template>
  <div class="login-page">
    <div class="global-hero">
      <h1>CONNEXION</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex dolorem
        neque, sapiente sed voluptatibus sequi fugiat ipsa? Consectetur
        corrupti, quidem provident cupiditate consequuntur dignissimos deserunt!
      </p>
    </div>
    <UiSwitch
      leftText="Se connecter"
      rightText="S'inscrire"
      @switchChange="handleSwitchChange"
    />
    <div v-if="!wantRegister" class="login-form">
      <form @submit="signIn">
        <div class="form-part">
          <label for="">Email</label>
          <input v-model="formIn.email" type="email" placeholder="Email" />
        </div>
        <div class="form-part">
          <label for="">Password</label>
          <input
            v-model="formIn.password"
            type="password"
            placeholder="Mot de passe"
          />
        </div>
        <UiButton text="Se connecter" type="submit" color="blue" size="large" />
      </form>
    </div>

    <div v-if="wantRegister" class="register-form">
      <form @submit.prevent="signUp">
        <div class="form-part">
          <label for="">Email</label>
          <input v-model="form.email" type="email" placeholder="Email" />
        </div>
        <div class="form-part">
          <label for="">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Mot de passe"
          />
        </div>
        <div class="form-part">
          <label for="">First name</label>
          <input
            v-model="form.userData.firstName"
            type="text"
            placeholder="Prénom"
          />
        </div>
        <div class="form-part">
          <label for="">Name</label>
          <input v-model="form.userData.name" type="text" placeholder="Nom" />
        </div>
        <div class="form-part">
          <label for="">Username</label>
          <input
            v-model="form.userData.username"
            type="text"
            placeholder="Pseudo"
          />
        </div>
        <div class="form-part">
          <label for="">Description</label>
          <input
            v-model="form.userData.description"
            type="text"
            placeholder="Description"
          />
        </div>
        <div class="form-part">
          <label for="">Profil picture</label>
          <input type="file" @change="handleFileUpload" />
        </div>
        <UiButton text="S'inscrire" type="submit" color="blue" size="large" />
      </form>
    </div>
  </div>

  <p v-if="loading">Chargement...</p>
  <p v-if="errorMsg">{{ errorMsg }}</p>
</template>

<style lang="scss">
.login-page {
  padding: 0 20px 92px;
  > .register-form,
  .login-form {
    margin-top: 32px;
  }
}
</style>
