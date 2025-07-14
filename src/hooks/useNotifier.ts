import { useSnackbar, type VariantType } from "notistack";

const useNotifier = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = (message: string, variant: VariantType = "default") => {
        enqueueSnackbar(message, { variant });
    };

    return notify;
};

export default useNotifier;
