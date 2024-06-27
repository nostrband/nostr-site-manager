import { useState, useCallback, useEffect } from "react";

export const useEditSettingMode = (
  submitForm: () => Promise<void>,
  isLoading: boolean = false,
): [boolean, () => Promise<void>] => {
  const [isEdit, setIsEdit] = useState(false);

  const handleAction = useCallback(async () => {
    if (isEdit) {
      await submitForm();
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [isEdit, submitForm]);

  useEffect(() => {
    if (isLoading) {
      setIsEdit(false);
    }
  }, [isLoading]);

  return [isEdit, handleAction];
};
