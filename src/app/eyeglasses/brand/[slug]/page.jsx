import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("eyeglasses", "brand");

export const generateMetadata = route.generateMetadata;
export default route.Page;