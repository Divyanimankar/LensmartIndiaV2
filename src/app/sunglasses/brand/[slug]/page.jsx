import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("sunglasses", "brand");

export const generateMetadata = route.generateMetadata;
export default route.Page;