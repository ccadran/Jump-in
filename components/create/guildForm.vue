<script lang="ts" setup>
import { UiButton } from "#components";

const user = useSupabaseUser();
const formData = ref({
  name: "",
  cover: null as File | null,
  description: "",
});

const handleGuildSubmit = async (e: Event) => {
  e.preventDefault();
  console.log("____formData", formData.value);

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.value.name);
  formDataToSend.append("description", formData.value.description);
  formDataToSend.append("owner_id", user.value?.id || "");

  if (formData.value.cover) {
    formDataToSend.append("cover", formData.value.cover); // Add the file
  }

  try {
    const response = await $fetch("/api/guilds", {
      method: "POST",
      body: formDataToSend,
    });
    console.log("Response", response);

    refreshNuxtData("guilds");

    formData.value = {
      name: "",
      cover: null,
      description: "",
    };

    (document.querySelector('input[type="file"]') as HTMLInputElement).value =
      "";
  } catch (error) {
    console.error("Erreur:", error);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    formData.value.cover = target.files[0];
    console.log("File", formData.value.cover);
  }
};
</script>

<template>
  <form @submit="handleGuildSubmit" class="guild-form">
    <div class="form-part">
      <label for="name">Name</label>
      <input
        v-model="formData.name"
        type="text"
        placeholder="Name of the guild"
        id="name"
      />
    </div>
    <div class="form-part">
      <label for="">Description</label>
      <input
        v-model="formData.description"
        type="text"
        placeholder="Description of the guild"
      />
    </div>
    <div class="form-part">
      <label for="">Cover</label>
      <input type="file" @change="handleFileUpload" />
    </div>
    <UiButton text="Create guild" type="submit" color="blue" size="large" />
  </form>
</template>

<style lang="scss">
.guild-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  > .form-part {
    display: flex;
    flex-direction: column;
    gap: 4px;
    > label {
      font-weight: 700;
      font-size: 14px;
    }
    > input {
      padding: 8px;
      font-family: "Inter";
      border-radius: 8px;
      border: 0.25px solid var(--dark);
      background-color: var(--grey);
      &::placeholder {
        opacity: 0.5;
      }

      &[type="file"] {
        padding: 0;
        border-radius: 0;
      }
    }
  }
  > .cta {
    margin-top: 32px;
    margin-left: auto;
  }
}
</style>
