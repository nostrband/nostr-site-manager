import { useState, useCallback } from "react";

export const useEditSettingMode = (
  submitForm: () => Promise<void>,
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

  return [isEdit, handleAction];
};
