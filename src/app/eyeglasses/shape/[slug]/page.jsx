import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("eyeglasses", "shape");

export const generateMetadata = route.generateMetadata;
export default route.Page;