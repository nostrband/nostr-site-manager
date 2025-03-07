import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";

export default function Loading() {
  return (
    <SpinerWrap>
      <SpinerCircularProgress />
    </SpinerWrap>
  );
}
