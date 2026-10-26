import { makeRoute } from "@/lib/glassesRoute";

const route = makeRoute("sunglasses", "type");

export const generateMetadata = route.generateMetadata;
export default route.Page;