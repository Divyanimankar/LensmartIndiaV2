import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("eyeglasses", "type");

export const generateMetadata = route.generateMetadata;
export default route.Page;