export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: "heroicons-check-circle",
        color: "success",
      });
    },
    toastError: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: "heroicons-exclamation-circle",
        color: "error",
      });
    },
  };
};
