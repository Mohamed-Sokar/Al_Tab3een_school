<template>
  <UModal
    title="إضافة طالب"
    size="lg"
    @close="resetForm"
    v-model:open="isOpen"
    :default-open="props?.defaultOpen ?? false"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="schema"
        :state="newStudent"
        class="space-y-4"
        @submit="createStudent"
      >
        <UFormField label="الاسم رباعي" name="full_name">
          <UInput
            v-model="newStudent.full_name"
            placeholder="الاسم رباعي"
            label="الاسم"
            class="w-full"
          />
        </UFormField>

        <UFormField label="رقم الهوية" name="identity_number">
          <UInput
            v-model="newStudent.identity_number"
            placeholder="رقم الهوية"
            label="رقم الهوية"
            class="w-full"
          />
        </UFormField>

        <UFormField label="رقم الجوال" name="phone_number">
          <UInput
            v-model="newStudent.phone_number"
            placeholder="05xxxxxxxx"
            label="رقم الجوال"
            class="w-full"
          />
        </UFormField>
        <UFormField label="تاريخ الميلاد" name="birth_date">
          <UInput
            v-model="newStudent.birth_date"
            type="date"
            class="w-full"
            placeholder="تاريخ الميلاد"
            icon="heroicons-calendar-days-solid"
          />
        </UFormField>
        <UFormField label="المستوى الدراسي" name="level">
          <USelect
            v-model="newStudent.level"
            :items="level_options"
            type="text"
            class="w-full"
            placeholder="المستوى الدراسي"
          />
        </UFormField>

        <UFormField label="حالة الحفظ" name="memorization_status">
          <USelect
            v-model="newStudent.memorization_status"
            :items="memorization_status_options"
            type="text"
            class="w-full"
            placeholder="حالة الحفظ"
          />
        </UFormField>

        <UButton
          type="submit"
          class="w-full flex justify-center font-bold"
          color="secondary"
        >
          إضافة
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { memorization_status_options, level_options } from "~/constants";
import { type Student } from "~/types";

const schema = object({
  full_name: string().required("الاسم مطلوب"),
  identity_number: string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),
  phone_number: string()
    .required("رقم الجوال مطلوب")
    .matches(/^\d{10}$/, "رقم الجوال يجب أن يتكون من 10 أرقام"),
  birth_date: string().required("تاريخ الميلاد مطلوب"),
  level: string().required("الصف الدراسي مطلوب"),
  memorization_status: string().required("حالة الحفظ مطلوبة"),
  payments_status: Object(),
  memorized_juz: string(),
  daily_recitation: string(),
  academic_level: string(),
  behavioral_issues: string(),
  section: string(),
});
// const newStudent = reactive<Student>({
//   full_name: "",
//   identity_number: "",
//   phone_number: "",
//   birth_date: undefined,
//   level: "",
//   memorization_status: undefined,
//   payments_status: { يناير: "مدفوعة" },
//   memorized_juz: "30",
//   daily_recitation: "جزء",
//   academic_level: "ممتاز",
//   behavioral_issues: "لا يوجد",
//   section: "1",
// });
const newStudent = reactive<Student>({
  // id: Math.random(),
  full_name: "Mohamed Sokar",
  identity_number: "123456",
  phone_number: "123456",
  birth_date: new Date().toISOString().split("T")[0],
  level: "الصف التاسع",
  memorization_status: "حافظ قوي",
  payments_status: { يناير: "مدفوعة" },
  memorized_juz: "30",
  daily_recitation: "جزء",
  academic_level: "ممتاز",
  behavioral_issues: "لا يوجد",
  section: "1",
});
const props = defineProps({
  modalValue: Boolean,
  defaultOpen: Boolean,
  student: {
    type: Object,
    required: false,
  },
});
const supabase = useSupabaseClient();
const emit = defineEmits(["saved", "update:modalValue"]);
defineShortcuts({
  o: () => (isOpen.value = !isOpen.value),
});
const { toastSuccess, toastError } = useAppToast();

const isLoading = ref(false);
const form = ref();
const isOpen = computed({
  get: () => props.modalValue || false,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modalValue", value);
  },
});

const isEditing = computed(() => !!props.student);

// const initialState = isEditing.value
//   ? {
//       type: props.transaction?.type,
//       amount: props.transaction?.amount,
//       created_at: props.transaction?.created_at.split("T")[0],
//       description: props.transaction?.description,
//       category: props.transaction?.category,
//     }
//   : {
//       type: undefined,
//       amount: 0,
//       created_at: undefined,
//       description: undefined,
//       category: undefined,
//     };

// const state = reactive({ ...initialState });
const createStudent = async () => {
  try {
    const { error } = await supabase.from("students").insert({
      ...newStudent,
    });

    if (error) throw error;

    toastSuccess({
      title: "تم إضافة الطالب بنجاح",
    });

    // إعادة ضبط النموذج
    Object.keys(newStudent).forEach((key) => {
      newStudent[key] = key === "payments_status" ? {} : "";
    });
  } catch (err) {
    toastError({
      title: "حدث خطأ أثناء إضافة الطالب",
      description: err.message,
    });
  }
};

const resetForm = () => {
  //   Object.assign(state, initialState);
  isLoading.value = false;
  form.value.clear(); // clear the errors from the form
};
</script>

<style scoped></style>
