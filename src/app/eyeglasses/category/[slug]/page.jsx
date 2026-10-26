import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("eyeglasses", "category");

export const generateMetadata = route.generateMetadata;
export default route.Page;