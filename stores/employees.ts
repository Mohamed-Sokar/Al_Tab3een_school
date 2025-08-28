import type {
  Employee,
  EmployeeAbsenceReport,
  EmployeeSupervisoryVisit,
  Filters,
  EmployeeAdministrativeIssue,
} from "~/types";
import { defineStore } from "pinia";
import { useAppToast } from "@/composables/useAppToast";

export const useEmployeesStore = defineStore("employees", () => {
  const { toastSuccess, toastError } = useAppToast();
  const client = useSupabaseClient();
  const employees = ref<Employee[]>([]);
  const employeesCount = ref(0);
  const loading = ref(false);
  const behavioralIssues = ref<EmployeeAdministrativeIssue[]>([]);
  const supervisoryVisits = ref<EmployeeSupervisoryVisit[]>([]);
  // const loans = ref<EmployeeLoan[]>([]);
  const absenceReports = ref<EmployeeAbsenceReport[]>([]);

  // Getters
  const absenceReportsData = computed(() => absenceReports.value);
  // const loansData = computed(() => loans.value);
  const employeesData = computed(() => employees.value);
  const employeesCountData = computed(() => employeesCount.value);

  const sortedIssues = computed(() => {
    return behavioralIssues.value.sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return aDate - bDate;
    });
  });
  const sortedSupervisorVisits = computed(() => {
    return supervisoryVisits.value.sort((a, b) => {
      const aDate = a.date ? new Date(a.date).getTime() : 0;
      const bDate = b.date ? new Date(b.date).getTime() : 0;
      return aDate - bDate;
    });
  });
  const sortedLoans = computed(() => {
    return loans.value.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
  });
  const sortedAbsenceReports = computed(() => {
    return absenceReportsData.value.sort(
      (a, b) =>
        new Date(b.date || new Date()).getTime() -
        new Date(a.date || new Date()).getTime()
    );
  });

  // Main Actions
  const fetchEmployees = async (
    pageNum: number = 1,
    pageSize: number = 10,
    filters?: Filters,
    forceRefresh: boolean = false
  ) => {
    const start = (pageNum - 1) * pageSize; // بداية النطاق
    const end = start + pageSize - 1; // نهاية النطاق

    console.log("start", start);
    console.log("end", end);
    // Check if any filter is applied
    const isFilterApplied =
      filters?.firstNameFilter ||
      filters?.secondNameFilter ||
      filters?.thirdNameFilter ||
      filters?.lastNameFilter ||
      filters?.jobTitleFilter;

    // Force refresh if filters are applied or forceRefresh is explicitly true
    const shouldForceRefresh = forceRefresh || isFilterApplied;

    if (!shouldForceRefresh) {
      console.log("force Refresh", forceRefresh);
      const hasEnoughData = employees.value.length > start;
      if (hasEnoughData) {
        const slicedData = employees.value.slice(start, end + 1);
        if (
          slicedData.length >= Math.min(pageSize, employeesCount.value - start)
        ) {
          console.log(`Using cached data for page ${pageNum}`);
          return;
        }
      }
    }

    loading.value = true;
    // let employeesBuffer: Employee[] = [];
    try {
      // const { data } = await api.get("/employees");
      let query = client
        .from("employees")
        .select(
          `*, administrative_issues:employees_administrative_issues(id, description,created_at),
      loans:employees_loans(id,amount,created_at, month_id, month:months(id, name)),
      absence:employees_absence(id, date, reason, excuse_status),
      academic_classes:teachers_academic_classes(class:academic_classes(id,title, group)),
      supervisory_visits:employees_supervisory_visits(notes,date,supervisor,type),
      salaries:employee_salaries(*)
      `,
          { count: "exact" }
        )
        .order("first_name", { ascending: true });

      if (filters?.firstNameFilter) {
        query = query.eq("first_name", filters?.firstNameFilter);
      }
      if (filters?.secondNameFilter) {
        query = query.eq("second_name", filters?.secondNameFilter);
      }
      if (filters?.thirdNameFilter) {
        query = query.eq("third_name", filters?.thirdNameFilter);
      }
      if (filters?.lastNameFilter) {
        query = query.eq("last_name", filters?.lastNameFilter);
      }
      if (filters?.jobTitleFilter) {
        query = query.eq("job_title", filters?.jobTitleFilter);
      }

      const { count, error: countError } = await query;
      if (countError) {
        throw createError({ statusCode: 500, message: countError.message });
      }
      employeesCount.value = count || 0;

      // apply pagination
      query = query.range(start, end);

      const { data, error } = await query;
      console.log("employees", data);
      if (error) {
        throw error;
      }
      if (forceRefresh) {
        employees.value = data as Employee[];
      } else {
        // دمج البيانات الجديدة مع القديمة (تجنب التكرار باستخدام id)
        const existingIds = new Set(
          employees.value.map((teacher) => teacher.id)
        );
        const newData = (data as Employee[]).filter(
          (teacher) => !existingIds.has(teacher.id)
        );
        // set employees data
        employees.value = [...employees.value, ...newData];
      }

      if (error) {
        throw createError({
          statusCode: 500,
          message: (error as Error).message,
        });
      }
    } catch (err) {
      toastError({
        title: "هناك مشكلة في تحميل الموظفين",
        description: (err as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
  const fetchEmployeeById = async (employeeId: string) => {
    try {
      loading.value = true;
      const { data, error } = await client
        .from("employees")
        // .select(
        //   `*, behavioral_issues:employees_administrative_issues(id, description,created_at),
        // loans:employees_loans(id,amount,created_at),
        // absence:employees_absence(id, date, reason, excuse_status),
        // academic_classes:teachers_academic_classes(class:academic_classes(id,title, group)),
        // supervisory_visits:employees_supervisory_visits(*),
        // salaries:employee_salaries(*)
        // `
        // )
        .select(
          `
        *,
        loans:employees_loans(id, amount, created_at),
        absence:employees_absence(id, date, reason, excuse_status),
        academic_classes:teachers_academic_classes(class:academic_classes(id, title, group)),
        salaries:employee_salaries(*),
        supervisory_visits:employees_supervisory_visits(*),
        administrative_issues:employees_administrative_issues(id, description, created_at)
      `
        )
        .eq("id", employeeId)
        .single();

      if (error) {
        throw Error("حدثت مشكلة أثناء جلب بيانات الموظف");
      }
      console.log(data);
      return data;
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء جلب بيانات الموظف",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const getEmployeesCount = async () => {
    try {
      loading.value = true;
      let query = client
        .from("employees")
        .select("*", { count: "exact", head: true });

      // Apply filtering based on month_id
      // if (filters.monthFilter) {
      //   query = query.eq("month_id", filters.monthFilter);
      // }

      // Apply filtering based on semester_id
      // if (filters.semesterFilter) {
      //   query = query.eq("semester_id", filters.semesterFilter);
      // }
      const { count, error } = await query;

      if (error) {
        throw createError({ statusCode: 500, message: error.message });
      }
      employeesCount.value = count || 0;
      return count;
    } catch (err) {
      toastError({ title: "خطأ في جلب عدد الموظفين" });
    } finally {
      loading.value = false;
    }
  };
  const addEmployee = async (employee: Object) => {
    // console.log(teacher);
    try {
      loading.value = true;
      const { data } = await api.post("/employees", employee);
      toastSuccess({
        title: `:تم إضافة المعلم ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // add teacher locally
      employees.value.unshift({ ...data[0] });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة المعلم",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const updateEmployee = async (employeeId: string, newEmployee: Employee) => {
    try {
      loading.value = true;
      const cleaned = removeInvalidFields(newEmployee); // 🧹 remove unfound columns in DB

      const { data } = await api.put(`employees/${employeeId}`, cleaned);

      toastSuccess({
        title: `:تم تحديث بيانات المعلم ${data[0].first_name} ${data[0].last_name} بنجاح`,
      });
      // update teacher locally
      const employeeIndex = getSpesificEmployeeIndex(employeeId);
      const targetedEmployee = getSpesificEmployee(employeeId);

      // Keep existing behavioral_issues from old data
      if (employees.value && employeeIndex !== -1 && !!targetedEmployee) {
        // ensure exsisting the behavioral issues array
        if (!targetedEmployee.behavioral_issues) {
          targetedEmployee.behavioral_issues = [];
        }

        const existingIssues = employees.value[employeeIndex].behavioral_issues;
        // Merge new data and keep behavioral_issues field

        if (!!existingIssues) {
          employees.value[employeeIndex] = {
            ...data[0],
            employees_behavioral_issues: existingIssues,
          };
        }
      }

      employees.value[employeeIndex] = { ...targetedEmployee, ...newEmployee };
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تعديل المعلم",
        description: "تحقق من الاتصال بالنترنت",
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteEmployee = async (employeeId: string) => {
    try {
      loading.value = true;
      const { data } = await api.delete(`employees/${employeeId}`);
      toastSuccess({
        title: `:تم حذف المعلم ( ${(data[0] as Employee).first_name} ${
          (data[0] as Employee).last_name
        } ) بنجاح`,
      });
      // console.log(data);
      // delete student locally
      const teacherIndex = getSpesificEmployeeIndex(employeeId);
      employees.value.splice(teacherIndex, 1);
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الموظف",
        description: (err as Error).message,
      });
      throw Error("حدث مشكلة في حذف الموظف");
    } finally {
      loading.value = false;
    }
  };
  const getSpesificEmployee = (employeeId: string) => {
    return employees.value.find((employee) => employee.id === employeeId);
  };
  const getSpesificEmployeeIndex = (employeeId: string) => {
    return employees.value.findIndex((employee) => employee.id === employeeId);
  };

  // supervisoryVisits actions
  const fetchSupervisoryVisits = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/employees/supervisory-visits");
      // console.log(data);
      // set supervisory visits data to ref locally
      supervisoryVisits.value = data;
      // toastSuccess({
      //   title: "تم تحميل الزيارات بنجاح",
      // });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تحميل الزيارات الإدارية",
        description: err instanceof Error ? err.message : String(err),
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const addSupervisoryVisit = async (
    employeeId: string,
    visit: SupervisoryVisitTeacher
  ) => {
    const targetedEmployee = getSpesificEmployee(employeeId);

    if (!targetedEmployee) return;

    try {
      loading.value = true;
      const { data } = await api.post("/employees/supervisory-visits", {
        ...visit,
        teacher_id: employeeId,
      });
      // console.log(data);
      toastSuccess({
        title: "تم إضافة الزيارة بنجاح",
      });

      if (employees.value && !!targetedEmployee) {
        // ensure exsisting the supervisory visits array
        if (!targetedEmployee.supervisory_visits) {
          targetedEmployee.supervisory_visits = [];
        }

        // add new supervisory visits
        targetedEmployee.supervisory_visits.push({
          ...data[0], // الزيارة التي أرجعها السيرفر
        });
      }

      const newVisit = {
        ...visit,
        teacher: {
          first_name: targetedEmployee.first_name,
          last_name: targetedEmployee.last_name,
        },
      };
      supervisoryVisits.value.unshift({ ...newVisit, ...data[0] });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة الزيارة",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const editSupervisorVisits = async (
    visitId: number,
    newVisit: SupervisoryVisitTeacher
  ) => {
    try {
      loading.value = true;
      const visitIndex = getSpesificSupervisorVisitIndex(visitId);
      const targetedVisit = getSpesificSupervisorVisit(visitId);
      const teacherIndex = getSpesificEmployeeIndex(
        targetedVisit?.teacher_id ?? ""
      );
      const targetedEmployee = getSpesificEmployee(
        targetedVisit?.teacher_id ?? ""
      );
      const payload = {
        notes: newVisit?.notes,
        type: newVisit?.type,
        supervisor: newVisit?.supervisor,
        date: newVisit?.date,
      };
      const { data } = await api.put(
        `/employees/supervisory-visits/${visitId}`,
        payload
      );
      // console.log(data);

      supervisoryVisits.value[visitIndex] = {
        ...supervisoryVisits.value[visitIndex],
        ...payload,
      };

      // update students behavioral issues array locally
      if (
        employees.value &&
        employees.value[teacherIndex] &&
        employees.value[teacherIndex].supervisory_visits
      ) {
        // You can safely access students_behavioral_issues[issueIndex] here
        const visitIndex =
          targetedEmployee?.supervisory_visits?.findIndex(
            (visit) => visit.id === visitId
          ) || 0;

        // For example, update the description:
        employees.value[teacherIndex].supervisory_visits[visitIndex] = {
          ...payload,
          ...data[0],
        };
      }

      toastSuccess({
        title: "تم تعديل الزيارة بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل الزيارة",
        description: err instanceof Error ? err.message : String(err),
      });
      throw Error(err instanceof Error ? err.message : String(err));
    } finally {
      loading.value = false;
    }
  };
  const deleteSupervisorVisit = async (visitId: number) => {
    // Update the teacher's supervisor visits
    const targetedVisit = getSpesificSupervisorVisit(visitId);
    const visitIndex = getSpesificSupervisorVisitIndex(visitId);
    const targetedEmployee = getSpesificEmployee(
      targetedVisit?.teacher_id ?? ""
    );

    try {
      // delete issue from DB
      loading.value = true;
      const { data } = await api.delete(
        `employees/supervisory-visits/${visitId}`
      );
      toastSuccess({
        title: `:تم حذف الزيارة بنجاح`,
      });
      // console.log(data);
      // delete issue locally
      supervisoryVisits.value.splice(visitIndex, 1);

      // delete issue from the student behavioral issues array
      if (!!targetedEmployee) {
        const targetedVisitIndex =
          targetedEmployee.supervisory_visits?.findIndex(
            (visit) => visit.id === visitId
          );

        targetedEmployee.supervisory_visits?.splice(targetedVisitIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف الزيارة",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificSupervisorVisit = (visitId: number) => {
    return supervisoryVisits.value.find((visit) => visit.id === visitId);
  };
  const getSpesificSupervisorVisitIndex = (visitId: number) => {
    return supervisoryVisits.value.findIndex((visit) => visit.id === visitId);
  };

  // Employee loans operations
  // const fetchLoans = async () => {
  //   loading.value = true;
  //   try {
  //     const { data } = await api.get("/employees/loans");
  //     // console.log(data);
  //     // set loans data to ref locally
  //     loans.value = data;

  //     // toastSuccess({
  //     //   title: "تم تحميل السلف بنجاح",
  //     // });
  //     // tableKey.value = Math.random();
  //   } catch (err) {
  //     toastError({
  //       title: "حدث مشكلة في تحميل السلف",
  //       description: "تحقق من الاتصال بالنترنت",
  //     });
  //     throw Error(err instanceof Error ? err.message : String(err));
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const addLoan = async (employeeId: string, amount: number) => {
  //   const targetedEmployee = getSpesificEmployee(employeeId);

  //   if (!targetedEmployee) return;

  //   const loan = {
  //     teacher_id: targetedEmployee.id,
  //     amount: amount,
  //   };

  //   try {
  //     loading.value = true;
  //     const { data } = await api.post("/employees/loans", loan);
  //     // console.log(data);
  //     toastSuccess({
  //       title: "تم إضافة السلفة",
  //     });

  //     if (employees.value && !!targetedEmployee) {
  //       // ensure exsisting the loans array
  //       if (!targetedEmployee.loans) {
  //         targetedEmployee.loans = [];
  //       }

  //       // add new loan
  //       targetedEmployee.loans.unshift({
  //         ...data[0],
  //       });
  //     }
  //     const newLoan = {
  //       ...loan,
  //       teacher: {
  //         first_name: targetedEmployee.first_name,
  //         last_name: targetedEmployee.last_name,
  //       },
  //     };
  //     loans.value.unshift({ ...newLoan, ...data[0] });
  //   } catch (err) {
  //     toastError({
  //       title: "حدث مشكلة في إضافة السلفة",
  //       description: err instanceof Error ? err.message : String(err),
  //     });
  //     // throw Error(err instanceof Error ? err.message : String(err));s
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const editLoan = async (loanId: number, amount: number) => {
  //   try {
  //     loading.value = true;
  //     const loanIndex = getSpesificLoanIndex(loanId);
  //     const targetedLoan = getSpesificLoan(loanId);
  //     const employeeIndex = getSpesificEmployeeIndex(
  //       targetedLoan?.employee_id ?? ""
  //     );
  //     const targetedEmployee = getSpesificEmployee(
  //       targetedLoan?.employee_id || ""
  //     );

  //     const { data } = await api.put(`/employees/loans/${loanId}`, {
  //       // ...behavioralIssues.value[loanIndex],
  //       amount,
  //     });
  //     // console.log(data);

  //     // update loans data locally
  //     loans.value[loanIndex] = {
  //       // ...data[0],
  //       ...loans.value[loanIndex],
  //       amount: amount,
  //     };
  //     // update teacher loans array locally
  //     if (
  //       employees.value &&
  //       employees.value[employeeIndex] &&
  //       employees.value[employeeIndex].loans
  //     ) {
  //       // You can safely access employees.value[employeeIndex].loans[loanIndex] here
  //       const loanIndex =
  //         targetedEmployee?.loans?.findIndex((loan) => loan.id === loanId) || 0;

  //       employees.value[employeeIndex].loans[loanIndex].amount = amount;
  //     }

  //     toastSuccess({
  //       title: "تم تعديل السلفة بنجاح",
  //     });
  //   } catch (err) {
  //     toastError({
  //       title: "حدثت مشكلة أثناء تعديل السلفة",
  //       description: err instanceof Error ? err.message : String(err),
  //     });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const deleteLoan = async (loanId: number) => {
  //   const targetedLoan = getSpesificLoan(loanId);
  //   const loanIndex = getSpesificLoanIndex(loanId);
  //   const targetedEmployee = getSpesificEmployee(
  //     targetedLoan?.employee_id ?? ""
  //   );

  //   try {
  //     // delete issue from DB
  //     loading.value = true;
  //     const { data } = await api.delete(`teachers/loans/${loanId}`);
  //     toastSuccess({
  //       title: `:تم حذف السلفة بنجاح`,
  //     });
  //     // console.log(data);
  //     // delete issue locally
  //     loans.value.splice(loanIndex, 1);

  //     // delete issue from the student behavioral issues array
  //     if (!!targetedEmployee) {
  //       const targetedLoanIndex = targetedEmployee.loans?.findIndex(
  //         (loan) => loan.id === loanId
  //       );

  //       targetedEmployee.loans?.splice(targetedLoanIndex ?? 0, 1);
  //     }
  //   } catch (err) {
  //     toastError({
  //       title: "حدث مشكلة في حذف السلفة",
  //       description: err instanceof Error ? err.message : String(err),
  //     });
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const getSpesificLoan = (loanId: number) => {
  //   return loans.value.find((loan) => loan.id === loanId);
  // };
  // const getSpesificLoanIndex = (loanId: number) => {
  //   return loans.value.findIndex((loan) => loan.id === loanId);
  // };

  // Employee Absence Reports operations
  const fetchAbsenceReports = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/employees/absence");
      // console.log(data);
      // set loans data to ref locally
      absenceReports.value = data;

      // toastSuccess({
      //   title: "تم تحميل تقارير الغياب بنجاح",
      // });
      // tableKey.value = Math.random();
    } catch (err) {
      toastError({
        title: "حدث مشكلة في تحميل تقارير الغياب",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const addAbsenceReport = async (
    employee_id: string,
    report: EmployeeAbsenceReport
  ) => {
    const targetedEmployee = getSpesificEmployee(employee_id);
    if (!targetedEmployee) return;

    const newReport = {
      employee_id: targetedEmployee.id,
      ...report,
    };

    try {
      loading.value = true;
      const { data } = await api.post("/employees/absence", newReport);
      // console.log(data);
      toastSuccess({
        title: "تم إضافة التقرير",
      });

      if (employees.value && !!targetedEmployee) {
        // ensure exsisting the loans array
        if (!targetedEmployee.absence) {
          targetedEmployee.absence = [];
        }

        // add new loan
        targetedEmployee.absence.unshift({
          ...data[0],
        });
      }
      const newAbsenceReport = {
        ...newReport,
        teacher: {
          first_name: targetedEmployee.first_name,
          last_name: targetedEmployee.last_name,
        },
      };
      // add report locally
      absenceReports.value.unshift({
        ...newAbsenceReport,
        ...data[0],
      });
    } catch (err) {
      toastError({
        title: "حدث مشكلة في إضافة التقرير",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const deleteAbsenceReport = async (reportId: number) => {
    const targetedreport = getSpesificAbsenceReport(reportId);
    const reportIndex = getSpesificAbsenceReportIndex(reportId);
    const targetedEmployee = getSpesificEmployee(
      targetedreport?.teacher_id ?? ""
    );

    try {
      // delete report from DB
      loading.value = true;
      const { data } = await api.delete(`employees/absence/${reportId}`);
      toastSuccess({
        title: `:تم حذف التقرير بنجاح`,
      });
      // console.log(data);
      // delete report locally
      absenceReports.value.splice(reportIndex, 1);

      // delete report from the student absence reports array
      if (!!targetedEmployee) {
        const targetedReportIndex = targetedEmployee.absence?.findIndex(
          (loan) => loan.id === reportId
        );

        targetedEmployee.loans?.splice(targetedReportIndex ?? 0, 1);
      }
    } catch (err) {
      toastError({
        title: "حدث مشكلة في حذف التقرير",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const editAbsenceReport = async (
    reportId: number,
    newReport: EmployeeAbsenceReport
  ) => {
    try {
      loading.value = true;
      const targetedReport = getSpesificAbsenceReport(reportId);
      const reportIndex = getSpesificAbsenceReportIndex(reportId);
      const teacherIndex = getSpesificEmployeeIndex(
        targetedReport?.teacher_id ?? ""
      );
      const targetedEmployee = getSpesificEmployee(
        targetedReport?.teacher_id || ""
      );

      const { data } = await api.put(`employees/absence/${reportId}`, {
        // ...behavioralIssues.value[loanIndex],
        // ...targetedReport,
        ...newReport,
      });
      console.log(data);

      // update report data locally
      absenceReports.value[reportIndex] = {
        // ...data[0],
        ...absenceReports.value[reportIndex],
        ...newReport,
      };
      // update employee absence reports array locally
      if (
        employees.value &&
        employees.value[teacherIndex] &&
        employees.value[teacherIndex].absence
      ) {
        // You can safely access teachers_loans[loanIndex] here
        const reportIndex =
          targetedEmployee?.absence?.findIndex(
            (report) => report.id === reportId
          ) || 0;

        employees.value[teacherIndex].absence[reportIndex] = data[0];
      }
      toastSuccess({
        title: "تم تعديل التقرير بنجاح",
      });
    } catch (err) {
      toastError({
        title: "حدثت مشكلة أثناء تعديل التقرير",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      loading.value = false;
    }
  };
  const getSpesificAbsenceReport = (reportId: number) => {
    return absenceReports.value.find((report) => report.id == reportId);
  };
  const getSpesificAbsenceReportIndex = (reportId: number) => {
    return absenceReports.value.findIndex((r) => r.id === reportId);
  };
  // helpre methods
  function removeInvalidFields(employee: Employee): Partial<Employee> {
    const allowedFields = [
      "id",
      "manager_id",
      "first_name",
      "second_name",
      "third_name",
      "last_name",
      "identity_number",
      "phone_number",
      "whatsapp_number",
      "enrollment_date",
      "children_count",
      "marital_status",
      "birth_date",
      "subject",
      "job_title",
      "masjed",
      "address",
      "created_at",
    ];

    return Object.fromEntries(
      Object.entries(employee).filter(([key]) => allowedFields.includes(key))
    );
  }

  return {
    // Data
    employees,
    behavioralIssues,
    absenceReports,
    supervisoryVisits,
    loading,
    // Actions
    fetchEmployees,
    fetchEmployeeById,
    getEmployeesCount,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getSpesificEmployee,
    getSpesificEmployeeIndex,

    // employee supervisory visits
    fetchSupervisoryVisits,
    addSupervisoryVisit,
    editSupervisorVisits,
    deleteSupervisorVisit,
    getSpesificSupervisorVisit,
    getSpesificSupervisorVisitIndex,
    // employee absence reports
    fetchAbsenceReports,
    addAbsenceReport,
    editAbsenceReport,
    deleteAbsenceReport,
    getSpesificAbsenceReport,
    getSpesificAbsenceReportIndex,
    // computed properties ==> Getters
    absenceReportsData,
    employeesData,
    employeesCountData,
    sortedLoans,
    sortedIssues,
    sortedSupervisorVisits,
    sortedAbsenceReports,
  };
});
