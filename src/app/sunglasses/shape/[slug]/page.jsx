import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("sunglasses", "shape");

export const generateMetadata = route.generateMetadata;
export default route.Page;