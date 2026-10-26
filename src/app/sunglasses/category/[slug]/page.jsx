import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("sunglasses", "category");

export const generateMetadata = route.generateMetadata;
export default route.Page;