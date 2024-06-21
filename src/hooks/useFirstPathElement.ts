import { usePathname } from "next/navigation";

export const useFirstPathElement = () => {
  const pathname = usePathname();

  const cleanPathname = pathname.split("?")[0];

  const parts = cleanPathname.split("/").filter(Boolean);

  return `/${parts[0]}`;
};
