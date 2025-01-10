import { usePathname, useRouter } from "next/navigation";

export const useBack = () => {
  const path = usePathname();
  const router = useRouter();

  const back = (slug: string = "") => {
    const pathParts = path.split("/");

    pathParts.pop();

    const backPath = pathParts.join("/");

    const pathUpdate = slug.length ? `${backPath}/${slug}` : backPath;

    router.push(pathUpdate);
  };

  return { back };
};
