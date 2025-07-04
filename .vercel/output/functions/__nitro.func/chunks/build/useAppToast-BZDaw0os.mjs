import { l as useToast } from './server.mjs';

const useAppToast = () => {
  const toast = useToast();
  return {
    toastSuccess: ({ title, description = "" }) => {
      toast.add({
        title,
        description,
        icon: "heroicons-check-circle",
        color: "success"
      });
    },
    toastError: ({ title, description = "" }) => {
      toast.add({
        title,
        description,
        icon: "heroicons-exclamation-circle",
        color: "error"
      });
    }
  };
};

export { useAppToast as u };
//# sourceMappingURL=useAppToast-BZDaw0os.mjs.map
