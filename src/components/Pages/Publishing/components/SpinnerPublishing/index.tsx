import { SpinnerCustom } from "@/components/SpinnerCustom";

export const SpinnerPublishing = ({ isDone }: { isDone: boolean }) => {
  if (isDone) {
    return <SpinnerCustom />;
  }

  return (
    <svg
      width="162"
      height="162"
      viewBox="0 0 162 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M45.001 81L69.001 105L117.001 57M161.001 81C161.001 125.183 125.184 161 81.001 161C36.8182 161 1.00098 125.183 1.00098 81C1.00098 36.8172 36.8182 1 81.001 1C125.184 1 161.001 36.8172 161.001 81Z"
        stroke="#FF3ED9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
