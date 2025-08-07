import type {
  AvgScoreResult,
  ExamType,
  GradesReport,
  Semester,
  Subject,
} from "~/types";
import { defineStore } from "pinia";
import { useStudentStore } from "@/stores/students";

export const useGradsStore = defineStore("grads", () => {
  // init
  const client = useSupabaseClient();

  // helper composables
  const { toastError, toastSuccess } = useAppToast();
  // Data
  const reports = ref<GradesReport[]>([]);
  const semesters = ref<Semester[]>([]);
  const examTypes = ref<ExamType[]>([]);
  const subjects = ref<Subject[]>([]);
  const avg_scores_by_class = ref<AvgScoreResult[]>([]);
  const loading = ref(false);

  // Getters
  const reportsData = computed(() => reports.value);
  const semestersData = computed(() => semesters.value);
  const examTypesData = computed(() => examTypes.value);
  const subjectsData = computed(() => subjects.value);
  const avgScoresByClassData = computed(() => avg_scores_by_class.value);
  // Actions
  const fetchGradsReport = async (
    semesterId?: number,
    examTypeId?: number,
    academicClassId = 16,
    subjectId?: number
  ) => {
    if (reportsData.value.length) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data, error } = await client
        .from("student_exam_results")
        .select(
          `
            id,
            score,
            notes,
            student:student_id ( first_name, last_name ),
            semester:semester_id( year, name ),
            subject:subject_exam_id(name:subject_id(name), exam_type:exam_type_id(name))
          `
        )
        .eq("academic_class_id", academicClassId);

      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      // console.log("gradsReport: ", data);
      // set reports data to ref locally
      reports.value = data;
      toastSuccess({
        title: "تم تحميل تقارير الدرجات بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل تقارير الدرجات",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  // const get_avg_scores_by_class = async (class_id: number) => {
  //   try {
  //     loading.value = true;
  //     const { data, error } = await client.rpc("get_avg_scores_by_class", {
  //       class_id: class_id, // ID of the academic class you want to get averages for
  //     } as any);
  //     avg_scores_by_class.value = data;
  //     toastSuccess({
  //       title: "تم تحميل معدل التقارير بنجاح",
  //     });
  //     // console.log("AvgScoreResult: ", data);
  //     if (error) {
  //       throw createError({ statusCode: 500, message: error.message });
  //     }
  //   } catch (err) {
  //     toastError({
  //       title: "حدث مشكلة أثناء تحميل معدل التقارير",
  //       description:
  //         err instanceof Error
  //           ? err.message
  //           : typeof err === "string"
  //           ? err
  //           : JSON.stringify(err),
  //     });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  const get_avg_scores_filtered = async (
    semester_id: number | null = null,
    class_id: number | null = null,
    exam_type_id: number | null = null,
    subject_id: number | null = null
  ) => {
    try {
      loading.value = true;
      const { error, data } = await client.rpc("get_avg_scores_filtered", {
        p_academic_class_id: class_id,
        p_semester_id: semester_id,
        p_exam_type_id: exam_type_id,
        p_subject_id: subject_id,
      } as any);
      // console.log(data);
      avg_scores_by_class.value = data as any;
      toastSuccess({
        title: "تم تحميل معدل التقارير بنجاح",
      });
      // console.log("AvgScoreResult: ", data);
      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل معدل التقارير",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const getSubjectExamsByExamTypeId = async (examTypeId: number) => {
    loading.value = true;
    try {
      const { data, error } = await client
        .from("subject_exams")
        .select()
        .eq("exam_type_id", examTypeId)
        .limit(1);

      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      return data[0];
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء جلب القيمة القصوى والدنيا",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const addReport = async (report: GradesReport) => {
    loading.value = true;

    try {
      const { data } = await api.post("/grads", report);
      toastSuccess({
        title: `:تم إضافة تقرير الدرجات بنجاح`,
      });
      // console.log(data);
      // add student locally
      reports.value.unshift({
        ...report,
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة تقرير الدرجات",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteGradesReport = async (reportId: number) => {
    try {
      loading.value = true;
      await api.delete(`grades/${reportId}`);

      toastSuccess({
        title: `:تم حذف تقرير الدرجات بنجاح`,
      });
      // delete driver locally
      const reportIndex = getSpecificReportIndex(reportId);
      reports.value.splice(reportIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف تقرير الدرجات",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const updateReport = async (reportId: number, newReport: GradesReport) => {
    try {
      loading.value = true;
      const { data } = await api.put(`grades/${reportId}`, newReport);

      toastSuccess({
        title: `:تم تحديث بيانات تقرير الدرجات بنجاح`,
      });

      // console.log(data);

      // update class locally
      const reportIndex = getSpecificReportIndex(reportId);
      const targetedReport = getSpecificReport(reportId);

      reports.value[reportIndex] = {
        ...targetedReport,
        ...newReport,
        // ...data,
      };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل بيانات تقرير الدرجات",
        description:
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpecificReport = (reportId: number) => {
    return reports.value.find((report: GradesReport) => report.id === reportId);
  };
  const getSpecificReportIndex = (reportId: number) => {
    return reports.value.findIndex(
      (report: GradesReport) => report.id === reportId
    );
  };
  const fetchSemesters = async () => {
    if (semesters.value.length) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data, error } = await client.from("semesters").select();

      // console.log(data);
      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      // set semesters data to ref locally
      semesters.value = data;
      // toastSuccess({
      //   title: "تم تحميل الفصول بنجاح",
      // });
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل الفصول",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const fetchExamTypes = async () => {
    if (examTypes.value.length) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data, error } = await client.from("exam_types").select();
      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      // set semesters data to ref locally
      examTypes.value = data;
      // toastSuccess({
      //   title: "تم تحميل أنواع الاختبار بنجاح",
      // });
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل أنواع الاختبار",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const fetchSubjects = async () => {
    if (subjects.value.length) return; // تجنب الجلب أكثر من مرة
    loading.value = true;
    try {
      const { data, error } = await client.from("subjects").select();

      // console.log("subjects: ", data);
      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      // set semesters data to ref locally
      subjects.value = data;
      // toastSuccess({
      //   title: "تم تحميل المواد بنجاح",
      // });
    } catch (err) {
      toastError({
        title: "حدث مشكلة أثناء تحميل المواد",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const checkSubjecExamsExsisting = async (
    subject_id: number,
    exam_type_id: number,
    semester_id: number,
    max_score: number,
    min_score: number
  ) => {
    try {
      loading.value = true;
      // تأكد أنك ترسل: subject_id, exam_type_id, semester_id
      const { data: subjectExam, error: subject_exams_error } = await client
        .from("subject_exams")
        .select("id")
        .match({
          subject_id: subject_id,
          exam_type_id: exam_type_id,
        })
        .single();
      if (subject_exams_error) {
        throw createError({
          statusCode: 500,
          message: subject_exams_error.message,
        });
      }
      // إذا لم يكن موجودًا، أنشئه:
      if (!subjectExam) {
        const { data: newExam, error } = await client
          .from("subject_exams")
          .insert({
            subject_id: subject_id,
            exam_type_id: exam_type_id,
            semester_id: semester_id,
            min_score: min_score,
            max_score: max_score,
          })
          .select()
          .single();
        if (error) {
          console.warn("insert to subject_exams");
          throw createError({
            statusCode: 500,
            message: error.message,
          });
        }
        return { subject_exam_id: newExam.id };
      } else {
        return { subject_exam_id: subjectExam.id };
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في فحص subjectExams",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const checkExamResultsExisting = async (
    academic_class_id: number,
    subject_exam_id: number,
    semester_id: number,
    subject_id: number
  ) => {
    let isExist = false;
    const { data: existingGrades, error } = await client
      .from("student_exam_results")
      .select()
      .eq("academic_class_id", academic_class_id)
      .eq("subject_exam_id", subject_exam_id)
      .eq("semester_id", semester_id) // إذا كان عندك هذا الحقل
      .eq("subject_id", subject_id)
      .limit(1);
    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }

    if (existingGrades && existingGrades.length > 0) {
      isExist = true;
    }
    return { isExist };
  };
  const saveGrades = async (payload: GradesReport[]) => {
    loading.value = true;
    try {
      const { data, error } = await client
        .from("student_exam_results")
        .upsert(payload, {
          onConflict: ["student_id", "subject_exam_id", "subject_id"],
        })
        .select();
      // console.log("returned grades from store: ", data);
      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      toastSuccess({ title: "تم حفظ الدرجات بنجاح" });
    } catch (err) {
      toastError({
        title: "مشكلة في حفظ الدرجات",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const getStudentsWithGrades = async (
    academic_class_id: number,
    semester_id: number,
    subject_id: number,
    subject_exam_id: number
  ) => {
    try {
      const { data, error } = (await client
        .from("student_exam_results")
        .select(
          "id, student:student_id(id,first_name,second_name,third_name,last_name,identity_number), score"
        )
        .eq("academic_class_id", academic_class_id ?? 0)
        .eq("semester_id", semester_id ?? 0)
        .eq("subject_id", subject_id ?? 0)
        .eq("subject_exam_id", subject_exam_id ?? 0)) as any;

      if (error) {
        useAppToast().toastError({
          title: "خطأ",
          description: (error as Error).message,
        });
        return;
      }

      return data;
    } catch (err) {
    } finally {
      // isLoading.value = false;
    }
  };

  return {
    // Data
    loading,
    reports,
    avg_scores_by_class,
    //Getters
    reportsData,
    semestersData,
    examTypesData,
    subjectsData,
    avgScoresByClassData,
    // Actions
    fetchGradsReport,
    addReport,
    updateReport,
    deleteGradesReport,
    getSpecificReport,
    getSpecificReportIndex,
    // semesters
    fetchSemesters,
    // exam types
    fetchExamTypes,
    // subjects
    fetchSubjects,
    // rpc DB function
    // get_avg_scores_by_class,
    get_avg_scores_filtered,

    getSubjectExamsByExamTypeId,
    checkSubjecExamsExsisting,
    checkExamResultsExisting,
    getStudentsWithGrades,
    saveGrades,
  };
});
