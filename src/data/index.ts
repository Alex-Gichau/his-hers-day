import rawData from "./data.json";
import type { SiteData } from "@/types/data";

/**
 * Editable site content lives in `./data.json`.
 * This accessor gives the JSON a strongly typed shape so icon names,
 * field types and other literals are validated at compile time.
 */
export const siteData = rawData as SiteData;

export default siteData;
